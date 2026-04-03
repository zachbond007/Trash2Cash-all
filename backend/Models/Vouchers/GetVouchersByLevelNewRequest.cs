using System;
namespace trash2cash_backend.Models.Vouchers
{
	public class GetVouchersByLevelNewRequest
	{
        public int level { get; set; }
        public double lat { get; set; }
        public double lng { get; set; }
    }
}

