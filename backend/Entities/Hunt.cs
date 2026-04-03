using System;
namespace trash2cash_backend.Entities
{
    public class Hunt
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ImageKey { get; set; }
        public string Status { get; set; }
        public string? VerifiedAs { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? EarnedXP { get; set; }
        public bool IsAdminVerified{ get; set; }
    }
}

