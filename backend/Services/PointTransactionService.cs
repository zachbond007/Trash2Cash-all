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

public interface IPointTransactionService
{
    Task<ListResponse<PointTransaction>> GetAllPointTransactionsAsync(IQueryCollection query);
    Task<List<PointTransaction>> GetAllPointTransactionsWithIds(List<int> idList);
    Task<PointTransaction> GetPointTransactionByIdAsync(int id);
    Task<PointTransaction> AddPointTransactionAsync(PointTransaction pointTransaction);
    Task UpdatePointTransactionAsync(PointTransaction pointTransaction);
    Task DeletePointTransactionAsync(int id);
    Task DeletePointTransactionRangeAsync(List<int> id);
}

public class PointTransactionService : IPointTransactionService
{
    private readonly ApplicationDbContext _dbContext;

    public PointTransactionService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<PointTransaction>> GetAllPointTransactionsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.PointTransactions.CountAsync();
        var pointTransactions = await _dbContext.PointTransactions.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<PointTransaction>
        {
            data = pointTransactions,
            length = length
        };
        return resp;
    }

    public async Task<List<PointTransaction>> GetAllPointTransactionsWithIds(List<int> idList)
    {
        return await _dbContext.PointTransactions.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<PointTransaction> GetPointTransactionByIdAsync(int id)
    {
        return await _dbContext.PointTransactions.FindAsync(id);
    }

    public async Task<PointTransaction> AddPointTransactionAsync(PointTransaction pointTransaction)
    {
        _dbContext.PointTransactions.Add(pointTransaction);
        await _dbContext.SaveChangesAsync();
        return pointTransaction;
    }

    public async Task UpdatePointTransactionAsync(PointTransaction pointTransaction)
    {
        _dbContext.PointTransactions.Update(pointTransaction);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeletePointTransactionAsync(int id)
    {
        var pointTransaction = await _dbContext.PointTransactions.FindAsync(id);
        _dbContext.PointTransactions.Remove(pointTransaction);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeletePointTransactionRangeAsync(List<int> idList)
    {
        var list = await _dbContext.PointTransactions.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.PointTransactions.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }
}
