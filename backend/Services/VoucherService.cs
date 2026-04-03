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
using trash2cash_backend.Models.Vouchers;
using System.Reflection.Emit;
using trash2cash_backend.Models.OnlineVouchers;

public interface IVoucherService
{
    Task<ListResponse<Voucher>> GetAllVouchersAsync(IQueryCollection query);
    Task<List<Voucher>> GetAllVouchersWithIds(List<int> idList);
    Task<Voucher> GetVoucherByIdAsync(int id);
    Task<Voucher> AddVoucherAsync(Voucher voucher);
    Task UpdateVoucherAsync(Voucher voucher);
    Task DeleteVoucherAsync(int id);
    Task DeleteVoucherRangeAsync(List<int> id);
    Task<List<GetVouchersResponse>> GetVouchersByLevel(int level);
    Task<List<object>> GetVouchersByLevelNew(GetVouchersByLevelNewRequest req);
    Task<List<GetVouchersResponse>> GetVouchersForMarketPlace();
    Task<List<GetVouchersResponse>> GetVouchersForMarketPlace(GetVouchersForMarketPlaceRequest req);

    
}

public class VoucherService : IVoucherService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IOnlineVoucherService _onlineVoucherService;

    public VoucherService(ApplicationDbContext dbContext, IOnlineVoucherService onlineVoucherService)
    {
        _dbContext = dbContext;
        _onlineVoucherService = onlineVoucherService;
    }

    public async Task<ListResponse<Voucher>> GetAllVouchersAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Vouchers.CountAsync();
        var vouchers = await _dbContext.Vouchers.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<Voucher>
        {
            data = vouchers,
            length = length
        };
        return resp;
    }

    public async Task<List<Voucher>> GetAllVouchersWithIds(List<int> idList)
    {
        return await _dbContext.Vouchers.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<Voucher> GetVoucherByIdAsync(int id)
    {
        return await _dbContext.Vouchers.FindAsync(id);
    }

    public async Task<Voucher> AddVoucherAsync(Voucher voucher)
    {
        _dbContext.Vouchers.Add(voucher);
        await _dbContext.SaveChangesAsync();
        return voucher;
    }

    public async Task UpdateVoucherAsync(Voucher voucher)
    {
        _dbContext.Vouchers.Update(voucher);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteVoucherAsync(int id)
    {
        var voucher = await _dbContext.Vouchers.FindAsync(id);
        _dbContext.Vouchers.Remove(voucher);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteVoucherRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Vouchers.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Vouchers.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<GetVouchersResponse>> GetVouchersByLevel(int level)
    {
        return await _dbContext.Vouchers.Join(_dbContext.Merchants,
                           voucher => voucher.MerchantId,
                           merchant => merchant.Id,
                           (voucher, merchant) => new { Merchant = merchant, Voucher = voucher }).
            Where(x => x.Voucher.Level == level).
            Select(x=> new GetVouchersResponse
            {
                voucher= x.Voucher,
                merchant = x.Merchant
            }).
            ToListAsync();
    }


    public async Task<List<object>> GetVouchersByLevelNew(GetVouchersByLevelNewRequest req)
    {
        List<object> result = new List<object>();
        var onlineVouchers = await _onlineVoucherService.GetOnlineVouchersByLevel(req.level);
        foreach (var item in onlineVouchers)
        {
            result.Add(new
            {
                voucher = item.voucher,
                merchant = item.merchant,
            });
        }

        if (req.level != 2)
        {
            var localVouchers = await GetVouchersForMarketPlace(new GetVouchersForMarketPlaceRequest() { lat = req.lat, lng = req.lng });
            foreach (var item in localVouchers)
            {
                if (item.voucher.Level == req.level)
                {
                    result.Add(new
                    {
                        voucher = item.voucher,
                        merchant = item.merchant,
                    });
                }
            }
        }

        if (req.level == 2 && result.Count() == 0)
        {
            var onlineVouchersLevel3 = await _onlineVoucherService.GetOnlineVouchersByLevel(3);
            foreach (var item in onlineVouchersLevel3)
            {
                result.Add(new
                {
                    voucher = item.voucher,
                    merchant = item.merchant,
                });
            }

        }

        return result;
    }


    
    public async Task<List<GetVouchersResponse>> GetVouchersForMarketPlace()
    {
        return await _dbContext.Vouchers.Join(_dbContext.Merchants,
                           voucher => voucher.MerchantId,
                           merchant => merchant.Id,
                           (voucher, merchant) => new { Merchant = merchant, Voucher = voucher }).
                           Where(x => x.Merchant.IsActive && x.Voucher.IsActive).
            Select(x => new GetVouchersResponse
            {
                voucher = x.Voucher,
                merchant = x.Merchant
            }).
            OrderBy(x => x.voucher.Level).
            ToListAsync();
    }

    public async Task<List<GetVouchersResponse>> GetVouchersForMarketPlace(GetVouchersForMarketPlaceRequest req)
    {
        var voucherLocations = _dbContext.VoucherLocations
               .Join(_dbContext.Locations,
                           joined => joined.LocationId,
                           loc => loc.Id,
                           (joined, loc) => new { VoucherLocation = joined, Location = loc })
            .Select(x => new
            {
                VoucherId = x.VoucherLocation.VoucherId,
                Lat = x.Location.Lat,
                Lng = x.Location.Lng
            }
            )
            .ToList();
        var availableVouchers = new List<int>();
        foreach (var voucherLocation in voucherLocations)
        {
            if (DirectionsHelper.GetDistanceInMiles(req.lat,req.lng,voucherLocation.Lat,voucherLocation.Lng) < 20)
            {
                if (!availableVouchers.Contains(voucherLocation.VoucherId))
                {
                    availableVouchers.Add(voucherLocation.VoucherId);
                }
            }
        }

        return await _dbContext.Vouchers.Join(_dbContext.Merchants,
                           voucher => voucher.MerchantId,
                           merchant => merchant.Id,
                           (voucher, merchant) => new { Merchant = merchant, Voucher = voucher }).
            Where(x=> x.Merchant.IsActive && x.Voucher.IsActive && availableVouchers.Contains(x.Voucher.Id)).
            Select(x => new GetVouchersResponse
            {
                voucher = x.Voucher,
                merchant = x.Merchant
            }).
            OrderBy(x=> x.voucher.Level).
            ToListAsync();
    }
}
