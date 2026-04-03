using System;
using trash2cash_backend.Entities;

namespace trash2cash_backend.Models.Vouchers
{
	public class GetVouchersResponse
	{
		public Voucher voucher { get; set; }
		public Merchant merchant { get; set; }
    }
}
