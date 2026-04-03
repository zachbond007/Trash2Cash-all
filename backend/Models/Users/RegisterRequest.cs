using System;
namespace trash2cash_backend.Models.Users
{
	public class RegisterRequest
	{
        public string Name { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Avatar { get; set; }
        public string? FcmToken { get; set; }
        public string? verificationToken { get; set; }
    }
}
