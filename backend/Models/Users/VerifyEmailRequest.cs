using System;
namespace trash2cash_backend.Models.Users
{
	public class VerifyEmailRequest
    {
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
