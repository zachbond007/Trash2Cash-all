
using System;
using trash2cash_backend.Entities;

namespace trash2cash_backend.Models.OnlineVouchers
{
	public class GetOnlineVouchersResponse
    {
		public OnlineVoucher voucher { get; set; }
		public Merchant merchant { get; set; }
    }
}
