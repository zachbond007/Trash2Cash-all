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
using trash2cash_backend.Models.Config;

public interface IConfigService
{
    Task<ListResponse<Config>> GetAllConfigsAsync(IQueryCollection query);
    Task<List<Config>> GetAllConfigsWithIds(List<int> idList);
    Task<Config> GetConfigByIdAsync(int id);
    Task<Config> AddConfigAsync(Config config);
    Task UpdateConfigAsync(Config config);
    Task DeleteConfigAsync(int id);
    Task DeleteConfigRangeAsync(List<int> id);
    Task<ConfigDataResponse> FetchConfigData();
    Task<Config> GetConfigByKey(string key);

    
}

public class ConfigService : IConfigService
{
    private readonly ApplicationDbContext _dbContext;
    private IMerchantService _merchantService;


    public ConfigService(ApplicationDbContext dbContext,IMerchantService merchantService)
    {
        _dbContext = dbContext;
        _merchantService = merchantService;
    }

    public async Task<ListResponse<Config>> GetAllConfigsAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.Configs.CountAsync();
        var configs = await _dbContext.Configs.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<Config>
        {
            data = configs,
            length = length
        };
        return resp;
    }

    public async Task<List<Config>> GetAllConfigsWithIds(List<int> idList)
    {
        return await _dbContext.Configs.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<Config> GetConfigByIdAsync(int id)
    {
        return await _dbContext.Configs.FindAsync(id);
    }

    public async Task<Config> AddConfigAsync(Config config)
    {
        _dbContext.Configs.Add(config);
        await _dbContext.SaveChangesAsync();
        return config;
    }

    public async Task UpdateConfigAsync(Config config)
    {
        _dbContext.Configs.Update(config);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteConfigAsync(int id)
    {
        var config = await _dbContext.Configs.FindAsync(id);
        _dbContext.Configs.Remove(config);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteConfigRangeAsync(List<int> idList)
    {
        var list = await _dbContext.Configs.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.Configs.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<ConfigDataResponse> FetchConfigData()
    {
        var imageUris = await _merchantService.GetMerchantImageUris();
        var verificationRewardXP = _dbContext.Actions.First(x => x.ActionType == "VERIFICATION").RewardXP;
        return new ConfigDataResponse()
        {
            MerchantImageUris = imageUris,
            VerificationRewardXP = verificationRewardXP
        };
    }

    public async Task<Config> GetConfigByKey(string key)
    {
        return _dbContext.Configs.FirstOrDefault(x => x.Key == key);
    }
}
