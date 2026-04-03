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

public interface ILocationService
{
    Task<ListResponse<Location>> GetAllLocationsAsync(IQueryCollection query);
    Task<List<Location>> GetAllLocationsWithIds(List<int> idList);
    Task<Location> GetLocationByIdAsync(int id);
    Task<Location> AddLocationAsync(Location location);
    Task UpdateLocationAsync(Location location);
    Task DeleteLocationAsync(int id);
    Task DeleteLocationRangeAsync(List<int> id);
}

public class LocationService : ILocationService
{
    private readonly ApplicationDbContext _dbContext;

    public LocationService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<Location>> GetAllLocationsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Locations.CountAsync();
        var locations = await _dbContext.Locations.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<Location>
        {
            data = locations,
            length = length
        };
        return resp;
    }

    public async Task<List<Location>> GetAllLocationsWithIds(List<int> idList)
    {
        return await _dbContext.Locations.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<Location> GetLocationByIdAsync(int id)
    {
        return await _dbContext.Locations.FindAsync(id);
    }

    public async Task<Location> AddLocationAsync(Location location)
    {
        _dbContext.Locations.Add(location);
        await _dbContext.SaveChangesAsync();
        return location;
    }

    public async Task UpdateLocationAsync(Location location)
    {
        _dbContext.Locations.Update(location);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteLocationAsync(int id)
    {
        var location = await _dbContext.Locations.FindAsync(id);
        _dbContext.Locations.Remove(location);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteLocationRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Locations.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Locations.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }
}
