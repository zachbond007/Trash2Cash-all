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

public interface IClaimService
{
    Task<ListResponse<Claim>> GetAllClaimsAsync(IQueryCollection query);
    Task<List<Claim>> GetAllClaimsWithIds(List<int> idList);
    Task<Claim> GetClaimByIdAsync(int id);
    Task<Claim> AddClaimAsync(Claim claim);
    Task UpdateClaimAsync(Claim claim);
    Task DeleteClaimAsync(int id);
    Task DeleteClaimRangeAsync(List<int> id);
}

public class ClaimService : IClaimService
{
    private readonly ApplicationDbContext _dbContext;

    public ClaimService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<Claim>> GetAllClaimsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Claims.CountAsync();
        var claims = await _dbContext.Claims.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<Claim>
        {
            data = claims,
            length = length
        };
        return resp;
    }

    public async Task<List<Claim>> GetAllClaimsWithIds(List<int> idList)
    {
        return await _dbContext.Claims.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<Claim> GetClaimByIdAsync(int id)
    {
        return await _dbContext.Claims.FindAsync(id);
    }

    public async Task<Claim> AddClaimAsync(Claim claim)
    {
        var _claim = claim;
        _claim.CreatedAt = DateTime.Now;
        _dbContext.Claims.Add(_claim);
        await _dbContext.SaveChangesAsync();
        return _claim;
    }

    public async Task UpdateClaimAsync(Claim claim)
    {
        _dbContext.Claims.Update(claim);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteClaimAsync(int id)
    {
        var claim = await _dbContext.Claims.FindAsync(id);
        _dbContext.Claims.Remove(claim);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteClaimRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Claims.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Claims.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }
}
