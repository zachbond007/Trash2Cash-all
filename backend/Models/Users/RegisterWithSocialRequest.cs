using System;
namespace trash2cash_backend.Models.Users
{
	public class RegisterWithSocialRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string? Avatar { get; set; }
        public string? Uid { get; set; }
        public string? FcmToken { get; set; }

    }
}

