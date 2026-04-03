using System;
using trash2cash_backend.Entities;

namespace trash2cash_backend.Models.Users
{
	public class ProfileDataResponse
	{
        public int PhotosSubmitted { get; set; }
        public int PhotosVerified { get; set; }
        public int OffersRedeemed { get; set; }
        public List<PointTransaction> PointHistory { get; set; }
    }
}

