using System;
namespace trash2cash_backend.Models.HuntVerifications
{
	public class SubmitHuntVerificationRequest
	{
        public int HuntId{ get; set; }
        public string Answer { get; set; }
        public string? ItemSize { get; set; }
    }
}
