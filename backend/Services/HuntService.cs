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
using trash2cash_backend.Models.Hunts;

public interface IHuntService
{
    Task<ListResponse<Hunt>> GetAllHuntsAsync(IQueryCollection query);
    Task<List<Hunt>> GetAllHuntsWithIds(List<int> idList);
    Task<Hunt> GetHuntByIdAsync(int id);
    Task<Hunt> AddHuntAsync(Hunt hunt);
    Task UpdateHuntAsync(Hunt hunt);
    Task DeleteHuntAsync(int id);
    Task DeleteHuntRangeAsync(List<int> id);
    Task<bool> AdminVerifyHunt(AdminVerifyHuntRequest hunt);
    Task CreateHunt(CreateHuntRequest req, User user);
    Task<List<VerificationHuntResponse>> GetHuntsForVerification(GetHuntsForVerificationRequest req, User user);

    
}

public class HuntService : IHuntService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly INotificationService _notificationService;

    public HuntService(ApplicationDbContext dbContext,INotificationService notificationService)
    {
        _dbContext = dbContext;
        _notificationService = notificationService;
    }

    public async Task<ListResponse<Hunt>> GetAllHuntsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        string statusFilter = query["filter[status]"];
        string userIdFilter = query["filter[userId]"];
        var hunts = await _dbContext.Hunts.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        if (statusFilter != null)
        {
            hunts = hunts.Where(x => x.Status == statusFilter).ToList();
        }
        if (userIdFilter != null)
        {
            hunts = hunts.Where(x => x.UserId == Convert.ToInt32(userIdFilter)).ToList();
        }

        hunts = hunts.Select(x => new Hunt
                       {
                           Id = x.Id,
                           CreatedAt = x.CreatedAt,
                           EarnedXP = x.EarnedXP,
                           UserId = x.UserId,
                           Status = x.Status,
                           VerifiedAs = x.VerifiedAs,
                           ImageKey = S3Helper.S3BaseUrl + x.ImageKey,

                       })
                       .ToList();

        var resp = new ListResponse<Hunt>
        {
            data = hunts,
            length = hunts.Count
        };
        return resp;
    }

    public async Task<List<Hunt>> GetAllHuntsWithIds(List<int> idList)
    {
        return await _dbContext.Hunts.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<Hunt> GetHuntByIdAsync(int id)
    {
        return await _dbContext.Hunts.FindAsync(id);
    }

    public async Task<Hunt> AddHuntAsync(Hunt hunt)
    {
        hunt.CreatedAt = DateTime.Now;
        _dbContext.Hunts.Add(hunt);
        await _dbContext.SaveChangesAsync();
        return hunt;
    }

    public async Task UpdateHuntAsync(Hunt hunt)
    {
        _dbContext.Hunts.Update(hunt);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteHuntAsync(int id)
    {
        var hunt = await _dbContext.Hunts.FindAsync(id);
        _dbContext.Hunts.Remove(hunt);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteHuntRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Hunts.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Hunts.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<bool> AdminVerifyHunt(AdminVerifyHuntRequest req)
    {
        try
        {
            var hunt = await GetHuntByIdAsync(req.Id);
            var actions = _dbContext.Actions.ToList();
            var levels = _dbContext.Levels.ToList();
            hunt.Status = "COMPLETED";
            hunt.VerifiedAs = req.AdminVerifiedAs;
            hunt.IsAdminVerified = true;
            switch (req.AdminVerifiedAs)
            {
                case "NO_TRASH_THROWN":
                    hunt.EarnedXP = 0;
                    break;
                case "1_10_ITEMS":
                    hunt.EarnedXP = actions.FirstOrDefault(x => x.ActionType == "5_PLUS_VERIFIED_ITEMS")?.RewardXP ?? 0;
                    break;
                case "SMALL_BAG":
                    hunt.EarnedXP = actions.FirstOrDefault(x => x.ActionType == "5_PLUS_VERIFIED_SMALL_BAG")?.RewardXP ?? 0;
                    break;
                case "LARGE_BAG":
                    hunt.EarnedXP = actions.FirstOrDefault(x => x.ActionType == "5_PLUS_VERIFIED_LARGE_BAG")?.RewardXP ?? 0;
                    break;
                case "MORE_THAN_LARGE_BAG":
                    hunt.EarnedXP = actions.FirstOrDefault(x => x.ActionType == "5_PLUS_VERIFIED_MORE_THAN_LARGE_BAG")?.RewardXP ?? 0;
                    break;
            }
            var user = _dbContext.Users.First(x => x.Id == hunt.UserId);
            if (hunt.EarnedXP != 0)
            {
                user.EarnedXP += Convert.ToInt32(hunt.EarnedXP);
                var level = levels.FirstOrDefault(x => x.LevelNumber == user.CurrentLevel + 1);
                if (level != null && level.RequiredXP <= user.EarnedXP)
                {
                    user.CurrentLevel++;
                    await _notificationService.SendNotification(user.FcmToken, "Level Up 😎", "You leveled up, nice! Check to see what rewards you’ve unlocked");

                }
                else
                {
                    await _notificationService.SendNotification(user.FcmToken, "Trash Verified ✅", "Congratulations, your trash has been verified!");
                }

                _dbContext.Users.Update(user);

                var pointTransactionHuntOwner = new PointTransaction()
                {
                    ActionType = req.AdminVerifiedAs,
                    CreatedAt = DateTime.Now,
                    UserId = user.Id,
                    EarnedXP = Convert.ToInt32(hunt.EarnedXP)
                };
                _dbContext.PointTransactions.Add(pointTransactionHuntOwner);
            }
            else
            {
                await _notificationService.SendNotification(user.FcmToken, "Photo Declined 😬", "It wasn’t clear that you were throwing away trash. Make sure you capture this action in your next photo.");
            }
            _dbContext.Hunts.Update(hunt);
            _dbContext.SaveChanges();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AdminVerifyHunt failed: {ex.Message}");
            return false;
        }
        return true;
    }

    public async Task CreateHunt(CreateHuntRequest req, User user)
    {
        var newHunt = new Hunt()
        {
           CreatedAt = DateTime.Now,
           ImageKey = req.imageKey,
           IsAdminVerified = false,
           Status =  "PENDING",
           UserId = user.Id,
        };
        _dbContext.Hunts.Add(newHunt);
        _dbContext.SaveChanges();
    }

    public async Task<List<VerificationHuntResponse>> GetHuntsForVerification(GetHuntsForVerificationRequest req, User user)
    {
        var verifiedHuntIdList = _dbContext.HuntVerifications.Where(x => x.VerifiedBy == user.Id).Select(x => x.HuntId).ToList();
        var list = _dbContext.Hunts
            .Where(x => x.UserId != user.Id && !verifiedHuntIdList.Contains(x.Id) && x.Status != "COMPLETED" && !req.HuntIds.Contains(x.Id))
            .Take(req.Quantity)
            .Select(x => new VerificationHuntResponse
            {
                CreatedAt = x.CreatedAt,
                HuntId = x.Id,
                ImageKey = x.ImageKey
            })
            .ToList();
        return list;
    }
}
