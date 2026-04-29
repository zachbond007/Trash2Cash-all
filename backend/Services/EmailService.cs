namespace trash2cash_backend.Services;

using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MimeKit;
using Newtonsoft.Json;
using System.Text;

public interface IEmailService
{
    void SendEmail(string toEmail, string subject, string body);
    Task<string> GetVerificationEmailLink(string data, string type, string param1 = "", string param1Value = "");
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void SendEmail(string toEmail, string subject, string body)
    {
        var email = _configuration.GetValue<string>("EmailSettings:EmailAddress");
        var password = _configuration.GetValue<string>("EmailSettings:EmailPassword");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Trash2Cash", email));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = subject;

        message.Body = new TextPart("html")
        {
            Text = body
        };

        using (var client = new SmtpClient())
        {
            client.Connect("smtp.gmail.com", 587, false);
            client.Authenticate(email, password);
            client.Send(message);
            client.Disconnect(true);
        }
    }

    public async Task<string> GetVerificationEmailLink(string data, string type, string param1 = "", string param1Value = "")
    {
        using (HttpClient client = new HttpClient())
        {
            // Set up the data for the link
            var link = "https://trash2cashapp.page.link/" + type + "?data=" + data;
            if (param1 != "")
            {
                link += "&" + param1 + "=" + param1Value;
            }
            var dynamicLinkInfo = new
            {
                dynamicLinkInfo = new
                {
                    domainUriPrefix = "https://trash2cashapp.page.link",
                    link = link,
                    androidInfo = new
                    {
                        androidPackageName = "com.trash2cashapp"
                    },
                    iosInfo = new
                    {
                        iosBundleId = "com.trash2cashapp"
                    }
                },
                suffix = new
                {
                    option = "SHORT"
                }
            };

            // Serialize the data to JSON
            var json = JsonConvert.SerializeObject(dynamicLinkInfo);

            // Create the HTTP content for the request
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            // Make the POST request to the Firebase Dynamic Links API
            var dynamicLinksApiKey = _configuration.GetValue<string>("Firebase:DynamicLinksApiKey");
            HttpResponseMessage response = await client.PostAsync(
                "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=" + dynamicLinksApiKey,
                httpContent
            );

            // Get the response content
            var result = await response.Content.ReadAsStringAsync();

            // Parse the response and get the short link
            dynamic responseObject = JsonConvert.DeserializeObject<dynamic>(result);
            string shortLink = responseObject.shortLink;
            // Now you can do something with the short link...
            return shortLink;
        }
    }
} 
