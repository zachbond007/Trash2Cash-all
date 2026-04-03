namespace trash2cash_backend.Services;

using System.Data;
using BCrypt.Net;
using trash2cash_backend.Authorization;
using trash2cash_backend.Entities;
using trash2cash_backend.Helpers;
using trash2cash_backend.Models;
using trash2cash_backend.Models.Users;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using trash2cash_backend.Entities;
using trash2cash_backend.Helpers;
using trash2cash_backend.Models;

public interface IRoleService
{
    Task<ListResponse<Role>> GetAllRolesAsync(IQueryCollection query);
    Task<List<Role>> GetAllRolesWithIds(List<int> idList);
    Task<Role> GetRoleByIdAsync(int id);
    Task<Role> AddRoleAsync(Role Role);
    Task UpdateRoleAsync(Role Role);
    Task DeleteRoleAsync(int id);
    Task DeleteRoleRangeAsync(List<int> id);
}

public class RoleService : IRoleService
{
    private readonly ApplicationDbContext _dbContext;


    public RoleService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<Role>> GetAllRolesAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Roles.CountAsync();
        var roles = await _dbContext.Roles.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<Role>
        {
            data = roles,
            length = length
        };
        return resp;
    }


    public async Task<List<Role>> GetAllRolesWithIds(List<int> idList)
    {
        return await _dbContext.Roles.Where(x => idList.Contains(x.Id)).ToListAsync();
    }
    public async Task<Role> GetRoleByIdAsync(int id)
    {
        return await _dbContext.Roles.FindAsync(id);
    }

    public async Task<Role> AddRoleAsync(Role role)
    {
        _dbContext.Roles.Add(role);
        await _dbContext.SaveChangesAsync();
        return role;
    }

    public async Task UpdateRoleAsync(Role role)
    {
        _dbContext.Roles.Update(role);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteRoleAsync(int id)
    {
        var role = await _dbContext.Roles.FindAsync(id);
        _dbContext.Roles.Remove(role);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteRoleRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Roles.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Roles.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }
}