namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models.Users;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using trash2cash_backend.Models;
using Microsoft.EntityFrameworkCore;
using trash2cash_backend.Helpers;
using BCrypt.Net;
using Newtonsoft.Json;
using System.Text;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private IUserService _userService;
    private IS3Service _s3Service;
    private IEmailService _emailService;
    private ApplicationDbContext _dbContext;

    public UsersController(IUserService userService, IS3Service s3Service, ApplicationDbContext applicationDbContext,
        IEmailService emailService
        )
    {
        _userService = userService;
        _s3Service = s3Service;
        _dbContext = applicationDbContext;
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<User>>> GetAllUsers()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _userService.GetAllUsersWithIds(idList));
        }
        else
        {
            return Ok(await _userService.GetAllUsersAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<User>> AddUser(User user)
    {
        user.CreatedAt = DateTime.Now;
        user.PasswordHash = BCrypt.HashPassword(user.PasswordHash);
        var addedUser = await _userService.AddUserAsync(user);
        return CreatedAtAction(nameof(GetUserById), new { id = addedUser.Id }, addedUser);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.Id)
        {
            return BadRequest();
        }

        var userToUpdate = await _userService.GetUserByIdAsync(id);
        if (userToUpdate == null)
        {
            return NotFound();
        }

        userToUpdate.Name = user.Name;
        userToUpdate.Username = user.Username;
        userToUpdate.Email = user.Email;
        if (userToUpdate.PasswordHash != user.PasswordHash)
        {
            userToUpdate.PasswordHash = BCrypt.HashPassword(user.PasswordHash);
        }
        userToUpdate.Birthday = user.Birthday;
        userToUpdate.CreatedAt = user.CreatedAt;
        userToUpdate.CurrentLevel = user.CurrentLevel;
        userToUpdate.EarnedXP = user.EarnedXP;
        userToUpdate.ImageKey = user.ImageKey;
        userToUpdate.RoleId = user.RoleId;
        userToUpdate.Active = user.Active;
        userToUpdate.IsVerified = user.IsVerified;
        await _userService.UpdateUserAsync(userToUpdate);
        return Ok(userToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteUser()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _userService.DeleteUserRangeAsync(idList);
        return Ok(idList);
    }

    [HttpPost("deleteUser")]
    public async Task<IActionResult> DeleteSingleUser()
    {
        var user = HttpContext.Items["User"] as User;
        await _userService.DeleteUserAsync(user);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public IActionResult Authenticate(LoginRequest model)
    {
        try
        {
            var response = _userService.Authenticate(model);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }

    }

    [AllowAnonymous]
    [HttpPost("uploadProfileImage")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Empty file");
        }

        var ext = Path.GetExtension(file.FileName);
        var imageKey = await _s3Service.UploadFile(file, "users/" + Guid.NewGuid() + ext);
        return Ok(new { imageKey });
    }

    [AllowAnonymous]
    [HttpPost("registerWithEmail")]
    public IActionResult Register(RegisterRequest req)
    {
        try
        {
            var newUser = _userService.Register(req);
            return Ok(newUser);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpPost("registerEmailVerification")]
    public IActionResult Register(RegisterEmailVerification req)
    {
        try
        {
            _userService.RegisterEmailVerification(req);
            return Ok(true);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }
    [AllowAnonymous]
    [HttpPost("registerWithSocial")]
    public IActionResult RegisterWithSocial(RegisterWithSocialRequest req)
    {
        try
        {
            var res = _userService.RegisterWithSocial(req);
            return Ok(res);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("verifyEmail")]
    public IActionResult VerifyEmail(VerifyEmailRequest req)
    {
        try
        {
            var response = _userService.VerifyEmail(req);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("forgotPassword")]
    public IActionResult ForgotPassword(ForgotPasswordRequest req)
    {
       _userService.ForgotPassword(req);
       return Ok();
    }

    [AllowAnonymous]
    [HttpPost("resetPassword")]
    public IActionResult ResetPassword(ResetPasswordRequest req)
    {
        var response = _userService.ResetPassword(req);
        return Ok(response);
    }

    [HttpPost("fetchUserData")]
    public IActionResult FetchUserData(FetchUserDataRequest req)
    {
        var user = HttpContext.Items["User"] as User;
        var response = _userService.FetchUserData(req,user);
        return Ok(response);
    }

    [HttpGet("fetchProfileData")]
    public IActionResult FetchProfileData()
    {
        var user = HttpContext.Items["User"] as User;
        var response = _userService.FetchProfileData(user);
        return Ok(response);
    }

    [HttpPost("updateUser")]
    public IActionResult UpdateUser(UpdateUserRequest req)
    {
        var user = HttpContext.Items["User"] as User;
        var response = _userService.UpdateUser(req,user);
        return Ok(response);
    }
    
    [AllowAnonymous]
    [HttpGet("isalive")]
    public async Task<IActionResult> asdfdsaf()
    {
        //var link =  await _emailService.GetVerificationEmailLink("asdfwnerw", "email-verify");
        //var htmlBody = $"<html>\n<body>\n Welcome to Trash2Cash! :)) <br></br> <a href=\"{link}\">Click here to verify your email</a><br></br>Thanks! <br></br>The Trash2Cash Team<br></br></body></html>";
        // _emailService.SendEmail("thaledox@hotmail.com", "Trash2Cash email verification", htmlBody);
        return Ok("yes8");
    }
}
 
