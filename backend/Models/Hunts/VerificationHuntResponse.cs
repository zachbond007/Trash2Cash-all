using System;
using trash2cash_backend.Entities;

namespace trash2cash_backend.Models.Hunts
{
	public class VerificationHuntResponse
	{
		public DateTime CreatedAt { get; set; }
		public string ImageKey { get; set; }
		public int HuntId { get; set; }
        //public int YesVoteCount { get; set; }
        //public int NoVoteCount { get; set; }
        //public string UserImageKey { get; set; }
        //public string UserName { get; set; }
        //      public string UserLevel { get; set; }
    }
}

