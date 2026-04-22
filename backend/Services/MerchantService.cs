namespace trash2cash_backend.Services;

using System.Data;
using trash2cash_backend.Entities;
using trash2cash_backend.Helpers;
using trash2cash_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public interface IMerchantService
{
    Task<ListResponse<Merchant>> GetAllMerchantsAsync(IQueryCollection query);
    Task<List<Merchant>> GetAllMerchantsWithIds(List<int> idList);
    Task<Merchant> GetMerchantByIdAsync(int id);
    Task<Merchant> AddMerchantAsync(Merchant merchant);
    Task UpdateMerchantAsync(Merchant merchant,bool updateImage);
    Task DeleteMerchantAsync(int id);
    Task DeleteMerchantRangeAsync(List<int> id);
    Task<List<string>> GetMerchantImageUris();
}

public class MerchantService : IMerchantService
{
    private readonly ApplicationDbContext _dbContext;

    public MerchantService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<Merchant>> GetAllMerchantsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Merchants.CountAsync();
        var merchants = await _dbContext.Merchants.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage)
            .Select(x=> new Merchant{
                Id= x.Id,
                Name = x.Name,
                ImageKey =  S3Helper.S3BaseUrl + x.ImageKey
            })
            .ToListAsync();


        var resp = new ListResponse<Merchant>
        {
            data = merchants,
            length = length
        };
        return resp;
    }

    public async Task<List<Merchant>> GetAllMerchantsWithIds(List<int> idList)
    {
        return await _dbContext.Merchants.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<Merchant> GetMerchantByIdAsync(int id)
    {
        var merchant =  await _dbContext.Merchants.FindAsync(id);
        merchant.ImageKey = S3Helper.S3BaseUrl + merchant.ImageKey;
        return merchant;
    }

    public async Task<Merchant> AddMerchantAsync(Merchant merchant)
    {
        _dbContext.Merchants.Add(merchant);
        await _dbContext.SaveChangesAsync();
        return merchant;
    }

    public async Task UpdateMerchantAsync(Merchant merchant, bool updateImage)
    {
        var merchantToUpdate = await _dbContext.Merchants.FindAsync(merchant.Id);
        if (merchantToUpdate == null) throw new Exception($"Merchant {merchant.Id} not found");
        merchantToUpdate.Name = merchant.Name;
        merchantToUpdate.ContactEmail = merchant.ContactEmail;
        merchantToUpdate.ContactName = merchant.ContactName;
        merchantToUpdate.ContactPhone = merchant.ContactPhone;
        merchantToUpdate.Color = merchant.Color;
        merchantToUpdate.IsActive = merchant.IsActive;
        if (updateImage)
        {
            merchantToUpdate.ImageKey = merchant.ImageKey;
        }
        _dbContext.Merchants.Update(merchantToUpdate);
        await _dbContext.SaveChangesAsync();
    }


    public async Task DeleteMerchantAsync(int id)
    {
        var merchant = await _dbContext.Merchants.FindAsync(id);
        _dbContext.Merchants.Remove(merchant);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteMerchantRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Merchants.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Merchants.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<string>> GetMerchantImageUris()
    {
        var list = await _dbContext.Merchants.Where(x=> x.IsActive).Select( x=> x.ImageKey).ToListAsync();
        return list;
    }
}
