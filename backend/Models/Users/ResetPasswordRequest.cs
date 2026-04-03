using System;
namespace trash2cash_backend.Models.Users
{
	public class ResetPasswordRequest
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}

