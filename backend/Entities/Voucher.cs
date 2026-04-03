using System;
namespace trash2cash_backend.Entities
{
    public class Voucher
    {
        public int Id { get; set; }
        public int MerchantId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Code { get; set; }
        public string Type { get; set; }
        public int Level { get; set; }
        public bool IsActive { get; set; }
    }
}

