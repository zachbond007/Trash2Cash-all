using System;
namespace trash2cash_backend.Entities
{
	public class Claim
	{
        public int Id { get; set; }
        public int VoucherId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
