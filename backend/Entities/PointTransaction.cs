using System;
namespace trash2cash_backend.Entities
{
	public class PointTransaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ActionType { get; set; }
        public int EarnedXP { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
