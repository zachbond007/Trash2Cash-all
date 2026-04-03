namespace trash2cash_backend.Services;

using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MimeKit;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

public interface INotificationService
{
    Task SendNotification(string fcmToken, string title, string body);
}

public class NotificationService : INotificationService
{
    private readonly IConfiguration _configuration;

    public NotificationService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendNotification(string fcmToken, string title, string body)
    {
        if (fcmToken != null && fcmToken != "")
        {
            var serverKey = _configuration.GetValue<string>("NotificationSettings:ServerKey");

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "key=" + serverKey);

                var notification = new
                {
                    to = fcmToken,
                    notification = new
                    {
                        title = title,
                        body = body,
                        sound = "default"
                    }
                };

                var json = JsonConvert.SerializeObject(notification);

                var response = await client.PostAsync("https://fcm.googleapis.com/fcm/send", new StringContent(json, Encoding.UTF8, "application/json"));

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Notification has been sent successfully.");
                }
                else
                {
                    Console.WriteLine("Failed to send notification.");
                }
            }
        }
    }
}