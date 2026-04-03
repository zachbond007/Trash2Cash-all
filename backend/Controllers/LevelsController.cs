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
public class LevelsController : ControllerBase
{
    private readonly ILevelService _levelService;

    public LevelsController(ILevelService levelService)
    {
        _levelService = levelService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Level>>> GetAllLevels()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _levelService.GetAllLevelsWithIds(idList));
        }
        else
        {
            return Ok(await _levelService.GetAllLevelsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Level>> GetLevelById(int id)
    {
        var level = await _levelService.GetLevelByIdAsync(id);
        if (level == null)
        {
            return NotFound();
        }
        return Ok(level);
    }

    [HttpPost]
    public async Task<ActionResult<Level>> AddLevel(Level level)
    {
        var addedLevel = await _levelService.AddLevelAsync(level);
        return CreatedAtAction(nameof(GetLevelById), new { id = addedLevel.Id }, addedLevel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLevel(int id, Level level)
    {
        if (id != level.Id)
        {
            return BadRequest();
        }

        var levelToUpdate = await _levelService.GetLevelByIdAsync(id);
        if (levelToUpdate == null)
        {
            return NotFound();
        }

        levelToUpdate.LevelNumber = level.LevelNumber;
        levelToUpdate.RequiredXP = level.RequiredXP;
        await _levelService.UpdateLevelAsync(levelToUpdate);
        return Ok(levelToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteLevel()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _levelService.DeleteLevelRangeAsync(idList);
        return Ok(idList);
    }
}
