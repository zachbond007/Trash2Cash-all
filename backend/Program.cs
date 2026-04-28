using trash2cash_backend.Authorization;
using trash2cash_backend.Helpers;
using trash2cash_backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Hosting;
using System.Timers;
using static trash2cash_backend.Services.EmailService;
using System.Threading;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

var builder = WebApplication.CreateBuilder(args );

var services = builder.Services;
var env = builder.Environment;
{
    var builderConf = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
        .AddEnvironmentVariables();

    AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

    // use sql server db in production and sqlite db in development
    services.AddDbContext<ApplicationDbContext>();
    //var db = services.BuildServiceProvider().GetService<ApplicationDbContext>();
    //StartTimer(db);

    //services.AddCors();
    services.AddControllers();

    // configure strongly typed settings object
    services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
    services.Configure<S3>(builder.Configuration.GetSection("S3"));

    // configure DI for application services
    services.AddScoped<IJwtUtils, JwtUtils>();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IS3Service, S3Service>();
    services.AddScoped<IActionService, ActionService>();
    services.AddScoped<IClaimService, ClaimService>();
    services.AddScoped<IConfigService, ConfigService>();
    services.AddScoped<IHuntService, HuntService>();
    services.AddScoped<IHuntVerificationService, HuntVerificationService>();
    services.AddScoped<ILevelService, LevelService>();
    services.AddScoped<ILocationService, LocationService>();
    services.AddScoped<IMerchantService, MerchantService>();
    services.AddScoped<IRoleService, RoleService>();
    services.AddScoped<IOnlineVoucherService, OnlineVoucherService>();
    services.AddScoped<IVoucherService, VoucherService>();
    services.AddScoped<IVoucherLocationService, VoucherLocationService>();
    services.AddScoped<IPointTransactionService, PointTransactionService>();
    services.AddScoped<IEmailService, EmailService>();
    services.AddScoped<INotificationService, NotificationService>();
    services.AddHttpContextAccessor();
}

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var serviceAccountPath = builder.Configuration.GetValue<string>("NotificationSettings:ServiceAccountPath");
if (!string.IsNullOrEmpty(serviceAccountPath) && File.Exists(serviceAccountPath))
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.FromFile(serviceAccountPath)
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
   app.UseHttpsRedirection();
}

app.UseAuthorization();
// configure HTTP request pipeline
{
    // global cors policy
    app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
    app.Use(async (context, next) => {
        Console.WriteLine($"[REQ] {context.Request.Method} {context.Request.Path}");
        await next();
        Console.WriteLine($"[RES] {context.Response.StatusCode} {context.Request.Path}");
    });

    // global error handler
    app.UseMiddleware<ErrorHandlerMiddleware>();

    // custom jwt auth middleware
    app.UseMiddleware<JwtMiddleware>();

    app.MapControllers();
    app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));
    app.MapGet("/hashpassword/{password}", (string password) => Results.Ok(BCrypt.Net.BCrypt.HashPassword(password)));

}
app.Run();

ApplicationDbContext dbcontext;

//void StartTimer(ApplicationDbContext _dbContext)
//{
//    dbcontext = _dbContext;
//    System.Timers.Timer timer = new System.Timers.Timer(1000* 60 * 60);

//    timer.Elapsed += TimerElapsed;
//    timer.Enabled = true;
//    TimerElapsed(null,null);
//}

//async void TimerElapsed(Object source, ElapsedEventArgs e)
//{
//    try
//    {
//        var timeUtc = DateTime.UtcNow;
//        TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById("America/New_York");
//        DateTime easternTime = TimeZoneInfo.ConvertTimeFromUtc(timeUtc, easternZone);

//        if (easternTime.Hour == 0)
//        {
//            var onlineVouchers = dbcontext.OnlineVouchers.Where(x => x.IsActive).ToList();
//            foreach (var voucher in onlineVouchers)
//            {
//                if (voucher.EndDate.Date <= easternTime.Date)
//                {
//                    voucher.IsActive = false;
//                    dbcontext.OnlineVouchers.Update(voucher);
//                }
//            }
//            dbcontext.SaveChanges();
//        }
//        else
//            return;
//    }
//    catch (Exception ex)
//    {
//        try
//        {
//            using (StreamWriter file = new StreamWriter("log.txt"))
//            {
//                file.WriteLine("===========");
//                file.WriteLine(ex.Message);
//                file.WriteLine(ex.InnerException?.Message);
//                file.WriteLine(DateTime.Now.Date.ToLongDateString());
//            }
//        }
//        catch
//        {
//        }
//    }
//}
