using System;
namespace trash2cash_backend.Entities
{
    public class HuntVerification
    {
        public int Id { get; set; }
        public int HuntId { get; set; }
        public int VerifiedBy { get; set; }
        public bool IsTrashThrown { get; set; }
        public string HowMuchTrash { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}