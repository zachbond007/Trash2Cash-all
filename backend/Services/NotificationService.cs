namespace trash2cash_backend.Services;

using FirebaseAdmin.Messaging;

public interface INotificationService
{
    Task SendNotification(string? fcmToken, string title, string body);
}

public class NotificationService : INotificationService
{
    public async Task SendNotification(string? fcmToken, string title, string body)
    {
        if (string.IsNullOrEmpty(fcmToken)) return;

        try
        {
            var message = new Message()
            {
                Token = fcmToken,
                Notification = new Notification()
                {
                    Title = title,
                    Body = body,
                },
                Apns = new ApnsConfig()
                {
                    Aps = new Aps() { Sound = "default" }
                }
            };

            await FirebaseMessaging.DefaultInstance.SendAsync(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send notification: {ex.Message}");
        }
    }
}
