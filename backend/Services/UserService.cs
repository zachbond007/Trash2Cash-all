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
using trash2cash_backend.Models.Users;
using BCrypt.Net;
using trash2cash_backend.Authorization;
using static System.Net.Mime.MediaTypeNames;
using Org.BouncyCastle.Ocsp;
using Newtonsoft.Json;
using System.Text;

public interface IUserService
{
    Task<ListResponse<User>> GetAllUsersAsync(IQueryCollection query);
    Task<List<User>> GetAllUsersWithIds(List<int> idList);
    Task<User> GetUserByIdAsync(int id);
    Task<User> AddUserAsync(User user);
    Task UpdateUserAsync(User user);
    Task DeleteUserAsync(User user);
    Task DeleteUserRangeAsync(List<int> id);
    AuthenticateResponse Authenticate(LoginRequest model);
    AuthenticateResponse Register(RegisterRequest req);
    void RegisterEmailVerification(RegisterEmailVerification req);

    AuthenticateResponse RegisterWithSocial(RegisterWithSocialRequest req);
    bool VerifyEmail(VerifyEmailRequest req);
    void ForgotPassword(ForgotPasswordRequest req);
    AuthenticateResponse ResetPassword(ResetPasswordRequest req);
    AuthenticateResponse FetchUserData(FetchUserDataRequest req, User user);
    ProfileDataResponse FetchProfileData(User user);
    User UpdateUser(UpdateUserRequest req, User user);
}

public class UserService : IUserService
{
    private ApplicationDbContext _dbContext;
    private IJwtUtils _jwtUtils;
    private IEmailService _emailService;
    private IS3Service _s3Service;

    public UserService(
        ApplicationDbContext context,
        IJwtUtils jwtUtils,
        IEmailService emailService,
        IS3Service s3Service
        )


    {
        _dbContext = context;
        _jwtUtils = jwtUtils;
        _emailService = emailService;
        _s3Service = s3Service;
    }

    public async Task<ListResponse<User>> GetAllUsersAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Users.CountAsync();
        var users = await _dbContext.Users.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<User>
        {
            data = users,
            length = length
        };
        return resp;
    }

    public async Task<List<User>> GetAllUsersWithIds(List<int> idList)
    {
        return await _dbContext.Users.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<User> GetUserByIdAsync(int id)
    {
        return await _dbContext.Users.FindAsync(id);
    }

    public async Task<User> AddUserAsync(User user)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        return user;
    }

    public async Task UpdateUserAsync(User user)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(User user)
    {
        var userHunts = _dbContext.Hunts.Where(x => x.UserId == user.Id).ToList();
        _dbContext.Hunts.RemoveRange(userHunts);
        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteUserRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Users.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Users.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }


    public AuthenticateResponse Authenticate(LoginRequest model)
    {
        var user = _dbContext.Users.SingleOrDefault(x => x.Email == model.Email);

        // validate
        if (user == null || !BCrypt.Verify(model.Password, user.PasswordHash))
            throw new AppException("Username or password is incorrect");


        var role = _dbContext.Roles.SingleOrDefault(x => x.Id == user.RoleId);
        if (role == null)
        {
            throw new AppException("User has no role");
        }

        var levels = _dbContext.Levels.ToList();
        var userLevel = levels.First(x => x.LevelNumber == user.CurrentLevel);
        var userNextLevel = levels.First(x => x.LevelNumber == user.CurrentLevel + 1);
        var currentXP = user.EarnedXP - userLevel.RequiredXP;
        var targetXP = userNextLevel.RequiredXP - userLevel.RequiredXP;
        var response = new AuthenticateResponse()
        {
            Email = user.Email,
            Name = user.Name,
            Id = user.Id,
            Avatar = user.ImageKey,
            Birthday = user.Birthday,
            Level = user.CurrentLevel,
            Username = user.Username,
            CurrentXp = currentXP,
            TargetXp = targetXP,
            CreatedAt = user.CreatedAt
        };
        response.JwtToken = _jwtUtils.GenerateToken(user);
        user.JwtToken = response.JwtToken;
        _dbContext.Users.Update(user);
        _dbContext.SaveChanges();
        return response;
    }

    public AuthenticateResponse Register(RegisterRequest model)
    {
        // validate
        if (_dbContext.Users.Any(x => x.Email == model.Email))
            throw new AppException("Email '" + model.Email + "' is already taken");

        string decryptedData = EncryptDecryptString.Decrypt(model.verificationToken);
        // Split decryptedData back into its components
        string[] parts = decryptedData.Split(new string[] { "=====" }, StringSplitOptions.None);
        string specialKey = parts[0];
        string email = parts[1];
        DateTime createdAt = DateTime.Parse(parts[2]);
        if (specialKey != "TRASH-2-CASH-SPECIAL-KEY" || email != model.Email)
        {
            throw new AppException("Wrong verification token");
        }

        var customerRoleId = _dbContext.Roles.SingleOrDefault(x => x.Name == "USER")!.Id;
        var level2XP = _dbContext.Levels.First(x => x.LevelNumber == 2).RequiredXP;


        var user = new User()
        {
            Name = model.Name,
            Email = model.Email,
            Username = model.Username,
            //Birthday = model.Birthday,
            PasswordHash = BCrypt.HashPassword(model.Password),
            Active = true,
            CreatedAt = DateTime.Now,
            RoleId = customerRoleId,
            CurrentLevel = 2,
            EarnedXP = level2XP,
            IsVerified = true,
            ImageKey = model.Avatar,
            FcmToken = model.FcmToken,
            Uid = ""
        };
        // save user
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        var token = _jwtUtils.GenerateToken(user);
        user.JwtToken = token;
        _dbContext.Users.Update(user);
        var transaction1 = new PointTransaction()
        {
            CreatedAt = DateTime.Now,
            ActionType = "VERIFICATION",
            EarnedXP = 10,
            UserId = user.Id
        };
        var transaction2 = new PointTransaction()
        {
            CreatedAt = DateTime.Now,
            ActionType = "VERIFICATION",
            EarnedXP = 10,
            UserId = user.Id
        };
        _dbContext.PointTransactions.Add(transaction1);
        _dbContext.PointTransactions.Add(transaction2);
        _dbContext.SaveChanges();

        var levels = _dbContext.Levels.ToList();
        var userLevel = levels.First(x => x.LevelNumber == user.CurrentLevel);
        var userNextLevel = levels.First(x => x.LevelNumber == user.CurrentLevel + 1);
        var currentXP = user.EarnedXP - userLevel.RequiredXP;
        var targetXP = userNextLevel.RequiredXP - userLevel.RequiredXP;
        var response = new AuthenticateResponse()
        {
            Email = user.Email,
            Name = user.Name,
            Id = user.Id,
            JwtToken = token,
            Avatar = user.ImageKey,
            Birthday = user.Birthday,
            Level = user.CurrentLevel,
            Username = user.Username,
            CurrentXp = currentXP,
            TargetXp = targetXP,
            CreatedAt = user.CreatedAt
        };

        SendZapierEmail(user.Email);

        return response;

    }
    private static readonly HttpClient client = new HttpClient();

    public async void RegisterEmailVerification(RegisterEmailVerification req)
    {
        string encryptedData = EncryptDecryptString.Encrypt("TRASH-2-CASH-SPECIAL-KEY" + "=====" + req.Email + "=====" + DateTime.Now.ToString());
        var link = await _emailService.GetVerificationEmailLink(encryptedData, "email-verify", "email", req.Email);

        var htmlBody = $"<html>\n<body>\nWelcome to Trash2Cash! :))<br><br><strong><a href=\"{link}\">Click here to verify your email</a></strong><br><br>Thanks!<br><br>The Trash2Cash Team\n</body></html>";
        _emailService.SendEmail(req.Email, "Trash2Cash email verification", htmlBody);

    }
    public bool VerifyEmail(VerifyEmailRequest req)
    {
        string decryptedData = EncryptDecryptString.Decrypt(req.Token);
        // Split decryptedData back into its components
        string[] parts = decryptedData.Split(new string[] { "=====" }, StringSplitOptions.None);
        string specialKey = parts[0];
        string email = parts[1];
        DateTime createdAt = DateTime.Parse(parts[2]);
        return specialKey == "TRASH-2-CASH-SPECIAL-KEY" && req.Email == email;
        //if (req.Email == email)
        //{
        //    var user = _dbContext.Users.FirstOrDefault(x => x.Email == email);
        //    if (user != null)
        //    {
        //        user.IsVerified = true;
        //        var token = _jwtUtils.GenerateToken(user);
        //        user.JwtToken = token;
        //        _dbContext.Users.Update(user);
        //        _dbContext.SaveChanges();
        //        var levels = _dbContext.Levels.ToList();
        //        var userLevel = levels.First(x => x.LevelNumber == user.CurrentLevel);
        //        var userNextLevel = levels.First(x => x.LevelNumber == user.CurrentLevel + 1);
        //        var currentXP = user.EarnedXP - userLevel.RequiredXP;
        //        var targetXP = userNextLevel.RequiredXP - userLevel.RequiredXP;
        //        var response = new AuthenticateResponse()
        //        {
        //            Email = user.Email,
        //            Name = user.Name,
        //            Id = user.Id,
        //            JwtToken = token,
        //            Avatar = user.ImageKey,
        //            Birthday = user.Birthday,
        //            Level = user.CurrentLevel,
        //            Username = user.Username,
        //            CurrentXp = currentXP,
        //            TargetXp = targetXP,
        //            CreatedAt = user.CreatedAt
        //        };
        //        return response;
        //    }
        //}
        //return null;
    }
    public async void ForgotPassword(ForgotPasswordRequest req)
    {
        var user = _dbContext.Users.FirstOrDefault(x => x.Email == req.Email);
        if (user != null)
        {
            string encryptedData = EncryptDecryptString.Encrypt(user.Name + "=====" + user.Email + "=====" + DateTime.Now.ToString());
            var link = await _emailService.GetVerificationEmailLink(encryptedData, "forgot-password", "email", user.Email);
            var htmlBody = $"<html>\n<body><a href=\"{link}\">Click here to reset your password</a><br></br>Thanks! <br></br>The Trash2Cash Team<br></br></body></html>";
            _emailService.SendEmail(user.Email, "Trash2Cash reset password", htmlBody);
        }
    }
    public AuthenticateResponse ResetPassword(ResetPasswordRequest req)
    {
        string decryptedData = EncryptDecryptString.Decrypt(req.Token);

        // Split decryptedData back into its components
        string[] parts = decryptedData.Split(new string[] { "=====" }, StringSplitOptions.None);
        string name = parts[0];
        string email = parts[1];
        DateTime createdAt = DateTime.Parse(parts[2]);
        var user = _dbContext.Users.FirstOrDefault(x => x.Email == email);
        if (user != null)
        {
            user.PasswordHash = BCrypt.HashPassword(req.NewPassword);
            var token = _jwtUtils.GenerateToken(user);
            user.JwtToken = token;
            _dbContext.Users.Update(user);
            _dbContext.SaveChanges();
            var levels = _dbContext.Levels.ToList();
            var userLevel = levels.First(x => x.LevelNumber == user.CurrentLevel);
            var userNextLevel = levels.First(x => x.LevelNumber == user.CurrentLevel + 1);
            var currentXP = user.EarnedXP - userLevel.RequiredXP;
            var targetXP = userNextLevel.RequiredXP - userLevel.RequiredXP;
            var response = new AuthenticateResponse()
            {
                Email = user.Email,
                Name = user.Name,
                Id = user.Id,
                JwtToken = token,
                Avatar = user.ImageKey,
                Birthday = user.Birthday,
                Level = user.CurrentLevel,
                Username = user.Username,
                CurrentXp = currentXP,
                TargetXp = targetXP,
                CreatedAt = user.CreatedAt
            };
            return response;
        }
        return null;
    }
    public AuthenticateResponse FetchUserData(FetchUserDataRequest req, User user)
    {
        user.FcmToken = req.FcmToken;
        _dbContext.Update(user);
        _dbContext.SaveChanges();
        var levels = _dbContext.Levels.ToList();
        var userLevel = levels.First(x => x.LevelNumber == user.CurrentLevel);
        var userNextLevel = levels.First(x => x.LevelNumber == user.CurrentLevel + 1);
        var currentXP = user.EarnedXP - userLevel.RequiredXP;
        var targetXP = userNextLevel.RequiredXP - userLevel.RequiredXP;
        var response = new AuthenticateResponse()
        {
            Email = user.Email,
            Name = user.Name,
            Id = user.Id,
            JwtToken = user.JwtToken,
            Avatar = user.ImageKey,
            Birthday = user.Birthday,
            Level = user.CurrentLevel,
            Username = user.Username,
            CurrentXp = currentXP,
            TargetXp = targetXP,
            CreatedAt = user.CreatedAt,
            IsSocialUser = user.IsSocialUser
        };
        return response;
    }

    public ProfileDataResponse FetchProfileData(User user)
    {
        var photosVerified = _dbContext.HuntVerifications.Count(x => x.VerifiedBy == user.Id);
        var photosSubmitted = _dbContext.Hunts.Count(x => x.UserId == user.Id);
        var offersRedeemed = _dbContext.Claims.Count(x => x.UserId == user.Id);
        var pointsHistory = _dbContext.PointTransactions.Where(x => x.UserId == user.Id).OrderByDescending(x => x.Id).Take(3).ToList();

        var response = new ProfileDataResponse()
        {
            PhotosVerified = photosVerified,
            PhotosSubmitted = photosSubmitted,
            OffersRedeemed = offersRedeemed,
            PointHistory = pointsHistory
        };
        return response;
    }

    public User UpdateUser(UpdateUserRequest req, User user)
    {
        var _user = _dbContext.Users.Find(user.Id);
        _user.Name = req.Name;
        _user.Username = req.Username;
        if (!string.IsNullOrEmpty(req.Avatar))
        {
            _user.ImageKey = req.Avatar;
        }
        _dbContext.Users.Update(_user);
        _dbContext.SaveChanges();
        return _user;
    }
    public AuthenticateResponse RegisterWithSocial(RegisterWithSocialRequest req)
    {
        var user = _dbContext.Users.FirstOrDefault(x => x.Email == req.Email);
        if (user == null)
        {
            var customerRoleId = _dbContext.Roles.SingleOrDefault(x => x.Name == "USER")!.Id;
            var level2XP = _dbContext.Levels.First(x => x.LevelNumber == 2).RequiredXP;
            // map model to new user object
            user = new User()
            {
                Name = req.Name,
                Email = req.Email,
                Username = RemoveEmailRest(req.Email),
                //Birthday = model.Birthday,
                //PasswordHash = BCrypt.HashPassword(model.Password),
                Active = true,
                CreatedAt = DateTime.Now,
                RoleId = customerRoleId,
                CurrentLevel = 2,
                EarnedXP = level2XP,
                IsVerified = true,
                ImageKey = req.Avatar,
                IsSocialUser = true,
                Uid = req.Uid,
                FcmToken = req.FcmToken
            };

            // save user
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();



            var transaction1 = new PointTransaction()
            {
                CreatedAt = DateTime.Now,
                ActionType = "VERIFICATION",
                EarnedXP = 10,
                UserId = user.Id
            };
            var transaction2 = new PointTransaction()
            {
                CreatedAt = DateTime.Now,
                ActionType = "VERIFICATION",
                EarnedXP = 10,
                UserId = user.Id
            };
            _dbContext.PointTransactions.Add(transaction1);
            _dbContext.PointTransactions.Add(transaction2);
            SendZapierEmail(user.Email);
        }

        var token = _jwtUtils.GenerateToken(user);
        user.JwtToken = token;
        _dbContext.Users.Update(user);
        _dbContext.SaveChanges();

        var levels = _dbContext.Levels.ToList();
        var userLevel = levels.First(x => x.LevelNumber == user.CurrentLevel);
        var userNextLevel = levels.First(x => x.LevelNumber == user.CurrentLevel + 1);
        var currentXP = user.EarnedXP - userLevel.RequiredXP;
        var targetXP = userNextLevel.RequiredXP - userLevel.RequiredXP;
        var response = new AuthenticateResponse()
        {
            Email = user.Email,
            Name = user.Name,
            Id = user.Id,
            JwtToken = user.JwtToken,
            Avatar = user.ImageKey,
            //Birthday = user.Birthday,
            Level = user.CurrentLevel,
            Username = user.Username,
            CurrentXp = currentXP,
            TargetXp = targetXP,
            IsSocialUser = true,
            CreatedAt = user.CreatedAt
        };
        return response;
    }


    public string RemoveEmailRest(string email)
    {
        int atIndex = email.IndexOf('@');
        if (atIndex >= 0)
        {
            return email.Substring(0, atIndex);
        }
        else
        {
            // No "@" symbol found, return the original email
            return email;
        }
    }

    public class RequestBody
    {
        public string email { get; set; }
    }

    public void SendZapierEmail(string email)
    {
        try
        {
            var requestBody = new RequestBody
            {
                email = email
            };
            var url = "https://hooks.zapier.com/hooks/catch/18918454/23quw0c/";
            var jsonContent = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var resp = client.PostAsync(url, content).Result;

            if (resp.IsSuccessStatusCode)
            {
                var responseData = resp.Content.ReadAsStringAsync().Result;
            }

        }
        catch
        {
        }
    }

}
