using System;
namespace trash2cash_backend.Models.HuntVerifications
{
	public class SubmitHuntVerificationResponse
	{
		public int YesCount { get; set; }
		public int NoCount { get; set; }
		public string UserName { get; set; }
		public string UserImageKey { get; set; }
		public int UserLevel { get; set; }
		public int? HuntOwnerEarnedXP { get; set; }
        public bool IsSocialUser { get; set; }
    }
}
