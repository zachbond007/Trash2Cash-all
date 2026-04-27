namespace trash2cash_backend.Services;

using System.Data;
using Amazon.S3;
using Amazon.S3.Transfer;
using BCrypt.Net;
using trash2cash_backend.Authorization;
using trash2cash_backend.Entities;
using trash2cash_backend.Helpers;
using trash2cash_backend.Models;
using trash2cash_backend.Models.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

public interface IS3Service
{
    Task<string> UploadFile(IFormFile file, string path);
    Task<bool> DeleteFile(string imageKey);
    Task<string> ReplaceFile(string prevImageKey, IFormFile newImage, string path);
}

public class S3Service : IS3Service
{
    private readonly S3 _s3Settings;

    private readonly IWebHostEnvironment _env;

    public S3Service(IOptions<S3> s3Settings, IWebHostEnvironment env)
    {
        _s3Settings = s3Settings.Value;
        _env = env;
    }

    public async Task<string> UploadFile(IFormFile file, string path)
    {
        if (file == null || file.Length == 0)
            throw new Exception("Empty file");

        // Instantiate an AmazonS3Client object with your AWS credentials
        var client = new AmazonS3Client(_s3Settings.AccessKey, _s3Settings.SecretKey, Amazon.RegionEndpoint.EUNorth1);

        // Instantiate a TransferUtility object
        var utility = new TransferUtility(client);
     
        // Specify the bucket name and file path in S3
        var filePathInS3 = (_env.EnvironmentName == "Development" ? "dev" : "prod") + "/images/" + path;

        //// Read the file into a MemoryStream
        //using (var stream = new MemoryStream())
        //{
        //        await file.CopyToAsync(stream);
        //         await utility.UploadAsync(stream, _s3Settings.BucketName, filePathInS3);
        //}
        // Read the file into a MemoryStream
        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream);
            var fileBytes = stream.ToArray(); // Convert the stream to byte array

            // Create a new MemoryStream from the byte array for UploadAsync
            using (var uploadStream = new MemoryStream(fileBytes))
            {
                await utility.UploadAsync(uploadStream, _s3Settings.BucketName, filePathInS3);
            }
        }

        return filePathInS3;
    }


    public async Task<bool> DeleteFile(string imageKey)
    {
        try
        {
            var _s3Client = new AmazonS3Client(_s3Settings.AccessKey, _s3Settings.SecretKey, Amazon.RegionEndpoint.EUNorth1);

            // Delete the object from S3
            await _s3Client.DeleteObjectAsync(new Amazon.S3.Model.DeleteObjectRequest
            {
                BucketName = _s3Settings.BucketName,
                Key = imageKey
            });
            return true;
        }
        catch (AmazonS3Exception ex)
        {
            return false;
        }
    }

    public async Task<string> ReplaceFile(string prevImageKey, IFormFile newImage, string path)
    {
        if (newImage == null || newImage.Length == 0)
            throw new Exception("Empty file");

        var _s3Client = new AmazonS3Client(_s3Settings.AccessKey, _s3Settings.SecretKey, Amazon.RegionEndpoint.EUNorth1);
        await _s3Client.DeleteObjectAsync(new Amazon.S3.Model.DeleteObjectRequest
        {
            BucketName = _s3Settings.BucketName,
            Key = path
        });
        return await UploadFile(newImage, path);
    }
}
