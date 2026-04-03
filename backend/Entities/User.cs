using System.Text.Json.Serialization;
namespace trash2cash_backend.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string? Email { get; set; }
        public bool Active { get; set; }
        public bool IsVerified { get; set; }
        public string? ImageKey { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? PasswordHash { get; set; }
        public string? JwtToken { get; set; }
        public int? RoleId { get; set; }
        public DateTime Birthday { get; set; }
        public int CurrentLevel { get; set; }
        public int EarnedXP { get; set; }
        public bool IsSocialUser { get; set; }
        public string Uid { get; set; }
        public string FcmToken { get; set; }
    }

}