using System;
namespace trash2cash_backend.Models.Hunts
{
	public class GetHuntsForVerificationRequest
	{
		public int Quantity { get; set; }
        public List<int>? HuntIds { get; set; }

    }
}

