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

public interface ILevelService
{
    Task<ListResponse<Level>> GetAllLevelsAsync(IQueryCollection query);
    Task<List<Level>> GetAllLevelsWithIds(List<int> idList);
    Task<Level> GetLevelByIdAsync(int id);
    Task<Level> AddLevelAsync(Level level);
    Task UpdateLevelAsync(Level level);
    Task DeleteLevelAsync(int id);
    Task DeleteLevelRangeAsync(List<int> id);
    Task<int> GetNextLevelRequiredXp(int nextLevelRequiredXp);
}

public class LevelService : ILevelService
{
    private readonly ApplicationDbContext _dbContext;

    public LevelService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<Level>> GetAllLevelsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Levels.CountAsync();
        var levels = await _dbContext.Levels.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<Level>
        {
            data = levels,
            length = length
        };
        return resp;
    }

    public async Task<List<Level>> GetAllLevelsWithIds(List<int> idList)
    {
        return await _dbContext.Levels.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<Level> GetLevelByIdAsync(int id)
    {
        return await _dbContext.Levels.FindAsync(id);
    }

    public async Task<Level> AddLevelAsync(Level level)
    {
        _dbContext.Levels.Add(level);
        await _dbContext.SaveChangesAsync();
        return level;
    }

    public async Task UpdateLevelAsync(Level level)
    {
        _dbContext.Levels.Update(level);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteLevelAsync(int id)
    {
        var level = await _dbContext.Levels.FindAsync(id);
        _dbContext.Levels.Remove(level);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteLevelRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Levels.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Levels.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<int> GetNextLevelRequiredXp(int level)
    {
        var currentLevel = await _dbContext.Levels.FindAsync(level);
        var nextLevel = await _dbContext.Levels.FindAsync(level+1);
        var nextLevelRequiredXp = nextLevel.RequiredXP - currentLevel.RequiredXP;

        return nextLevelRequiredXp;
       
    }
}
