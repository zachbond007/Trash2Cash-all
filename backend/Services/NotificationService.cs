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
        Console.WriteLine($"[NOTIFY] token={fcmToken ?? "NULL"} title={title}");
        if (string.IsNullOrEmpty(fcmToken))
        {
            Console.WriteLine("[NOTIFY] Skipped - fcmToken is null/empty");
            return;
        }

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
                Android = new AndroidConfig()
                {
                    Priority = Priority.High,
                    Notification = new AndroidNotification()
                    {
                        ChannelId = "high-priority",
                     }
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
