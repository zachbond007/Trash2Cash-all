using System;
using System.IO;
using System.Security.Cryptography;

namespace trash2cash_backend.Helpers
{
    public class EncryptDecryptString
    {
        // The key and IV are Base64 strings, convert them to byte arrays
        static string key256bitBase64 = "3q2+V+Hjg6Zq+VMcb9Z8tTneS1Kc8mPQFclI7iNs8vw=";
        static byte[] key = Convert.FromBase64String(key256bitBase64);

        static string iv128bitBase64 = "ABEiM0RVZneImaq7zN3u/w==";
        static byte[] iv = Convert.FromBase64String(iv128bitBase64);
        public static string Encrypt(string plainText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = key;
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    using (StreamWriter sw = new StreamWriter(cs))
                    {
                        sw.Write(plainText);
                    }

                    byte[] encryptedBytes = ms.ToArray();
                    string base64Url = Convert.ToBase64String(encryptedBytes)
                        .TrimEnd('=') // Remove padding characters
                        .Replace('+', '-') // Plus to dash
                        .Replace('/', '_'); // Slash to underscore

                    return base64Url;
                }
            }
        }

        public static string Decrypt(string cipherText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = key;
                aes.IV = iv;

                // Replace the Base64Url characters back to regular Base64 characters
                string base64 = cipherText
                    .Replace('-', '+') // Dash to plus
                    .Replace('_', '/'); // Underscore to slash

                // Add back the padding characters
                int padding = base64.Length % 4;
                if (padding > 0)
                {
                    base64 += new string('=', 4 - padding);
                }

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(base64)))
                {
                    using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    using (StreamReader sr = new StreamReader(cs))
                    {
                        return sr.ReadToEnd();
                    }
                }
            }
        }
    }

}

