namespace trash2cash_backend.Services;

using System.Data;
using trash2cash_backend.Entities;
using trash2cash_backend.Helpers;
using trash2cash_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using trash2cash_backend.Models.HuntVerifications;
using System.Collections;

public interface IHuntVerificationService
{
    Task<ListResponse<HuntVerification>> GetAllHuntVerificationsAsync(IQueryCollection query);
    Task<List<HuntVerification>> GetAllHuntVerificationsWithIds(List<int> idList);
    Task<HuntVerification> GetHuntVerificationByIdAsync(int id);
    Task<HuntVerification> AddHuntVerificationAsync(HuntVerification huntVerification);
    Task UpdateHuntVerificationAsync(HuntVerification huntVerification);
    Task DeleteHuntVerificationAsync(int id);
    Task DeleteHuntVerificationRangeAsync(List<int> id);
    Task<SubmitHuntVerificationResponse> SubmitHuntVerification(SubmitHuntVerificationRequest req,User user);
}

public class HuntVerificationService : IHuntVerificationService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly INotificationService _notificationService;

    public HuntVerificationService(ApplicationDbContext dbContext, INotificationService notificationService)
    {
        _dbContext = dbContext;
        _notificationService = notificationService;
    }

    public async Task<ListResponse<HuntVerification>> GetAllHuntVerificationsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        string huntIdFilter = query["filter[huntId]"];
        var huntVerifications = await _dbContext.HuntVerifications.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        if (huntIdFilter != null)
        {
            huntVerifications = huntVerifications.Where(x => x.HuntId == Convert.ToInt32(huntIdFilter)).ToList();
        }
        var resp = new ListResponse<HuntVerification>
        {
            data = huntVerifications,
            length = huntVerifications.Count
        };
        return resp;
    }

    public async Task<List<HuntVerification>> GetAllHuntVerificationsWithIds(List<int> idList)
    {
        return await _dbContext.HuntVerifications.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<HuntVerification> GetHuntVerificationByIdAsync(int id)
    {
        return await _dbContext.HuntVerifications.FindAsync(id);
    }

    public async Task<HuntVerification> AddHuntVerificationAsync(HuntVerification huntVerification)
    {
        huntVerification.CreatedAt = DateTime.Now;
        _dbContext.HuntVerifications.Add(huntVerification);
        await _dbContext.SaveChangesAsync();
        return huntVerification;
    }

    public async Task UpdateHuntVerificationAsync(HuntVerification huntVerification)
    {
        _dbContext.HuntVerifications.Update(huntVerification);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteHuntVerificationAsync(int id)
    {
        var huntVerification = await _dbContext.HuntVerifications.FindAsync(id);
        _dbContext.HuntVerifications.Remove(huntVerification);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteHuntVerificationRangeAsync(List<int> idList)
    {
        var list = await _dbContext.HuntVerifications.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.HuntVerifications.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<SubmitHuntVerificationResponse> SubmitHuntVerification(SubmitHuntVerificationRequest req,User user)
    {
        var otherVerifications = _dbContext.HuntVerifications.Where(x => x.HuntId == req.HuntId);
        var yesCount = otherVerifications.Count(x => x.IsTrashThrown);
        var noCount = otherVerifications.Count(x => !x.IsTrashThrown);
        var hunt = _dbContext.Hunts.Find(req.HuntId);
        var huntOwner = _dbContext.Users.Find(hunt.UserId);
        var userLevel = huntOwner.CurrentLevel;
        var userName = huntOwner.Username;
        var userImageKey = huntOwner.ImageKey;
        var levels = _dbContext.Levels.ToList();
        var isSocialUser = huntOwner.IsSocialUser;

        var newHuntVerification = new HuntVerification()
        {
            CreatedAt = DateTime.Now,
            IsTrashThrown = req.Answer == "YES" ? true : false,
            HowMuchTrash = req.Answer == "YES" ? req.ItemSize : "",
            HuntId = req.HuntId,
            VerifiedBy = user.Id,
        };

        _dbContext.Add(newHuntVerification);

        var actionsData = _dbContext.Actions.ToList();
        var verificationAction = actionsData.First(x => x.ActionType == "VERIFICATION");
        user.EarnedXP += verificationAction.RewardXP;
        var nextLevelForVerifier = levels.First(x => x.LevelNumber == user.CurrentLevel + 1);
        // User levels up
        if (nextLevelForVerifier.RequiredXP <= user.EarnedXP)
        {
            user.CurrentLevel++;
        }
        _dbContext.Users.Update(user);
        var actionTypeForReward = "";
        if (req.ItemSize != null)
        {
            switch (req.ItemSize)
            {
                case "1_10_ITEMS":
                    actionTypeForReward = "5_PLUS_VERIFIED_ITEMS";
                    break;
                case "SMALL_BAG":
                    actionTypeForReward = "5_PLUS_VERIFIED_SMALL_BAG";
                    break;
                case "LARGE_BAG":
                    actionTypeForReward = "5_PLUS_VERIFIED_LARGE_BAG";
                    break;
                case "MORE_THAN_LARGE_BAG":
                    actionTypeForReward = "5_PLUS_VERIFIED_MORE_THAN_LARGE_BAG";
                    break;
                default:
                    break;
            }
        }

        var pointTransactionVerifier = new PointTransaction()
        {
            ActionType = "VERIFICATION",
            CreatedAt = DateTime.Now,
            UserId = user.Id,
            EarnedXP = verificationAction.RewardXP
        };
        _dbContext.PointTransactions.Add(pointTransactionVerifier);

        var huntOwnerEarnedXP = 0;
        if ((yesCount == 4 && req.Answer == "YES") || (noCount == 4 && req.Answer == "NO"))
        {
            if (req.Answer == "NO")
            {
                hunt.Status = "COMPLETED";
                hunt.EarnedXP = 0;
                hunt.VerifiedAs = "NO_TRASH_THROWN";
                await _notificationService.SendNotification(huntOwner.FcmToken, "Photo Declined 😬", "It wasn’t clear that you were throwing away trash. Make sure you capture this action in your next photo.");
            }
            else
            {
                hunt.Status = "COMPLETED";
                var mostCommonItemSize = otherVerifications.Where(x=> x.IsTrashThrown)
                         .GroupBy(i => i.HowMuchTrash)
                         .OrderByDescending(grp => grp.Count())
                         .Select(grp => grp.Key)
                         .First();

                var huntOwnerVerifiedAs = ActionUtils.ItemSizeToActionType(mostCommonItemSize);
                hunt.VerifiedAs = huntOwnerVerifiedAs;
                huntOwnerEarnedXP = actionsData.First(x => x.ActionType == huntOwnerVerifiedAs).RewardXP;
                hunt.EarnedXP = huntOwnerEarnedXP;
                huntOwner.EarnedXP += huntOwnerEarnedXP;
                var nextLevelForHuntOwner = levels.First(x => x.LevelNumber == huntOwner.CurrentLevel + 1);
                // User levels up
                if (nextLevelForHuntOwner.RequiredXP < huntOwner.EarnedXP)
                {
                    huntOwner.CurrentLevel++;
                    await _notificationService.SendNotification(huntOwner.FcmToken, "Level Up 😎", "You leveled up, nice! Check to see what rewards you’ve unlocked");
                }
                else
                {
                    await _notificationService.SendNotification(huntOwner.FcmToken, "Trash Verified ✅", "Congratulations, your trash has been verified!");
                }
                _dbContext.Users.Update(huntOwner);
                var pointTransactionHuntOwner = new PointTransaction()
                {
                    ActionType = req.ItemSize,
                    CreatedAt = DateTime.Now,
                    UserId = huntOwner.Id,
                    EarnedXP = verificationAction.RewardXP
                };
                _dbContext.PointTransactions.Add(pointTransactionHuntOwner);
            }
            _dbContext.Hunts.Update(hunt);
        }

        var result = new SubmitHuntVerificationResponse()
        {
            YesCount = yesCount,
            NoCount = noCount,
            UserImageKey = userImageKey,
            UserLevel = userLevel,
            UserName = userName,
            HuntOwnerEarnedXP = huntOwnerEarnedXP,
            IsSocialUser = isSocialUser
        };

        _dbContext.SaveChanges();

        return result;
    }
}
