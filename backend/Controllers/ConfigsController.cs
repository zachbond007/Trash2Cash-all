namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using Microsoft.EntityFrameworkCore;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ConfigsController : ControllerBase
{
    private readonly IConfigService _configService;

    public ConfigsController(IConfigService configService)
    {
        _configService = configService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Config>>> GetAllConfigs()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _configService.GetAllConfigsWithIds(idList));
        }
        else
        {
            return Ok(await _configService.GetAllConfigsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Config>> GetConfigById(int id)
    {
        var config = await _configService.GetConfigByIdAsync(id);
        if (config == null)
        {
            return NotFound();
        }
        return Ok(config);
    }

    [HttpPost]
    public async Task<ActionResult<Config>> AddConfig(Config config)
    {
        var addedConfig = await _configService.AddConfigAsync(config);
        return CreatedAtAction(nameof(GetConfigById), new { id = addedConfig.Id }, addedConfig);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateConfig(int id, Config config)
    {
        if (id != config.Id)
        {
            return BadRequest();
        }

        var configToUpdate = await _configService.GetConfigByIdAsync(id);
        if (configToUpdate == null)
        {
            return NotFound();
        }

        configToUpdate.Key = config.Key;
        configToUpdate.Value = config.Value;
        await _configService.UpdateConfigAsync(configToUpdate);
        return Ok(configToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteConfig()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _configService.DeleteConfigRangeAsync(idList);
        return Ok(idList);
    }

    [AllowAnonymous]
    [HttpGet("fetchConfigData")]
    public async Task<IActionResult> FetchConfigData()
    {
       var result = await _configService.FetchConfigData();
        return Ok(result);
    }

    [HttpGet("getConfigByKey/{key}")]
    public async Task<IActionResult> GetConfigByKey(string key)
    {
        var result = await _configService.GetConfigByKey(key);
        return Ok(result);
    }
}
