namespace trash2cash_backend.Helpers;

using Microsoft.EntityFrameworkCore;
using trash2cash_backend.Entities;
using Microsoft.Extensions.Configuration;

public class ApplicationDbContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public ApplicationDbContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to sql server database
        options.UseNpgsql(
        Configuration.GetConnectionString("DefaultConnection"),
             opts => opts.SetPostgresVersion(new Version(12, 1)));
    }
  
    public DbSet<User> Users { get; set; }
    public DbSet<Action> Actions { get; set; }
    public DbSet<Claim> Claims { get; set; }
    public DbSet<Config> Configs { get; set; }
    public DbSet<Hunt> Hunts { get; set; }
    public DbSet<HuntVerification> HuntVerifications { get; set; }
    public DbSet<Level> Levels { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Merchant> Merchants { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<OnlineVoucher> OnlineVouchers { get; set; }
    public DbSet<Voucher> Vouchers { get; set; }
    public DbSet<VoucherLocation> VoucherLocations { get; set; }
    public DbSet<PointTransaction> PointTransactions { get; set; }
}