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

public interface IActionService
{
    Task<ListResponse<trash2cash_backend.Entities.Action>> GetAllActionsAsync(IQueryCollection query);
    Task<List<trash2cash_backend.Entities.Action>> GetAllActionsWithIds(List<int> idList);
    Task<trash2cash_backend.Entities.Action> GetActionByIdAsync(int id);
    Task<trash2cash_backend.Entities.Action> AddActionAsync(trash2cash_backend.Entities.Action action);
    Task UpdateActionAsync(trash2cash_backend.Entities.Action action);
    Task DeleteActionAsync(int id);
    Task DeleteActionRangeAsync(List<int> id);
    Task<trash2cash_backend.Entities.Action> GetActionByType(string type);

    
}

public class ActionService : IActionService
{
    private readonly ApplicationDbContext _dbContext;

    public ActionService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<trash2cash_backend.Entities.Action>> GetAllActionsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Actions.CountAsync();
        var actions = await _dbContext.Actions.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<trash2cash_backend.Entities.Action>
        {
            data = actions,
            length = length
        };
        return resp;
    }

    public async Task<List<trash2cash_backend.Entities.Action>> GetAllActionsWithIds(List<int> idList)
    {
        return await _dbContext.Actions.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<trash2cash_backend.Entities.Action> GetActionByIdAsync(int id)
    {
        return await _dbContext.Actions.FindAsync(id);
    }

    public async Task<trash2cash_backend.Entities.Action> AddActionAsync(trash2cash_backend.Entities.Action action)
    {
        _dbContext.Actions.Add(action);
        await _dbContext.SaveChangesAsync();
        return action;
    }

    public async Task UpdateActionAsync(trash2cash_backend.Entities.Action action)
    {
        _dbContext.Actions.Update(action);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteActionAsync(int id)
    {
        var action = await _dbContext.Actions.FindAsync(id);
        _dbContext.Actions.Remove(action);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteActionRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Actions.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Actions.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<trash2cash_backend.Entities.Action> GetActionByType(string type)
    {
       return  await _dbContext.Actions.FirstOrDefaultAsync(x => x.ActionType == type);
    }
    
}
