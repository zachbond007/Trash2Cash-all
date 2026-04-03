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
using trash2cash_backend.Models.VoucherLocations;

public interface IVoucherLocationService
{
    Task<ListResponse<VoucherLocation>> GetAllVoucherLocationsAsync(IQueryCollection query);
    Task<List<VoucherLocation>> GetAllVoucherLocationsWithIds(List<int> idList);
    Task<VoucherLocation> GetVoucherLocationByIdAsync(int id);
    Task<VoucherLocation> AddVoucherLocationAsync(VoucherLocation voucherLocation);
    Task UpdateVoucherLocationAsync(VoucherLocation voucherLocation);
    Task DeleteVoucherLocationAsync(int id);
    Task DeleteVoucherLocationRangeAsync(List<int> id);
    Task<List<GetNearestLocationsResponse>> GetNearestLocations(GetNearestLocationsRequest req);
    
}

public class VoucherLocationService : IVoucherLocationService
{
    private readonly ApplicationDbContext _dbContext;

    public VoucherLocationService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<VoucherLocation>> GetAllVoucherLocationsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.VoucherLocations.CountAsync();
        var voucherLocations = await _dbContext.VoucherLocations.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<VoucherLocation>
        {
            data = voucherLocations,
            length = length
        };
        return resp;
    }

    public async Task<List<VoucherLocation>> GetAllVoucherLocationsWithIds(List<int> idList)
    {
        return await _dbContext.VoucherLocations.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<VoucherLocation> GetVoucherLocationByIdAsync(int id)
    {
        return await _dbContext.VoucherLocations.FindAsync(id);
    }

    public async Task<VoucherLocation> AddVoucherLocationAsync(VoucherLocation voucherLocation)
    {
        _dbContext.VoucherLocations.Add(voucherLocation);
        await _dbContext.SaveChangesAsync();
        return voucherLocation;
    }

    public async Task UpdateVoucherLocationAsync(VoucherLocation voucherLocation)
    {
        _dbContext.VoucherLocations.Update(voucherLocation);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteVoucherLocationAsync(int id)
    {
        var voucherLocation = await _dbContext.VoucherLocations.FindAsync(id);
        _dbContext.VoucherLocations.Remove(voucherLocation);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteVoucherLocationRangeAsync(List<int> idList)
    {
        var list = await _dbContext.VoucherLocations.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.VoucherLocations.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<GetNearestLocationsResponse>> GetNearestLocations(GetNearestLocationsRequest req)
    {
        var voucherLocations = _dbContext.VoucherLocations
               .Join(_dbContext.Locations,
                           joined => joined.LocationId,
                           loc => loc.Id,
                           (joined, loc) => new { VoucherLocation = joined, Location = loc })
            .Where(x => x.VoucherLocation.VoucherId == req.VoucherId)
            .Select(x=> new
            {  VoucherLocation = x.VoucherLocation, Location = x.Location }
            )
            .ToList();

        var result = new List<GetNearestLocationsResponse>();
        foreach (var item in voucherLocations)
        {
            result.Add(new GetNearestLocationsResponse() {
                Address = item.Location.Address,
                //Distance = Convert.ToDecimal(DirectionsHelper.GetDistanceInMiles(item.Location.Lat,item.Location.Lng, req.Lat,req.Lng)),
                Lat = item.Location.Lat,
                Lng = item.Location.Lng,
            });
        }

        return result.OrderBy(x => x.Distance).ToList();
    }
}
