using System;
namespace trash2cash_backend.Entities
{
    public class VoucherLocation
    {
        public int Id { get; set; }
        public int VoucherId { get; set; }
        public int LocationId { get; set; }
    }
}
