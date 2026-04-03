using System;
namespace trash2cash_backend.Models.VoucherLocations
{
	public class GetNearestLocationsResponse
	{
		public string Address { get; set; } 
		public decimal Distance { get; set; }
		public double Lat { get; set; }
		public double Lng { get; set; }
		public string VocuherCode { get; set; }
    }
}

