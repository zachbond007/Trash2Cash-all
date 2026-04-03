namespace trash2cash_backend.Models.Users;

public class AuthenticateResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string JwtToken { get; set; }
    public string Role { get; set; }
    public int Level { get; set; }
    public int CurrentXp { get; set; }
    public int TargetXp { get; set; }
    public string Avatar { get; set; }
    public DateTime Birthday { get; set; }
    public bool? IsSocialUser { get; set; }
    public DateTime CreatedAt { get; set; }
}