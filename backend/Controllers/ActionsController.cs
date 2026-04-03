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
public class ActionsController : ControllerBase
{
    private readonly IActionService _actionService;

    public ActionsController(IActionService actionService)
    {
        _actionService = actionService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Action>>> GetAllActions()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _actionService.GetAllActionsWithIds(idList));
        }
        else
        {
            return Ok(await _actionService.GetAllActionsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Action>> GetActionById(int id)
    {
        var action = await _actionService.GetActionByIdAsync(id);
        if (action == null)
        {
            return NotFound();
        }
        return Ok(action);
    }

    [HttpPost]
    public async Task<ActionResult<Action>> AddAction(Action action)
    {
        var addedAction = await _actionService.AddActionAsync(action);
        return CreatedAtAction(nameof(GetActionById), new { id = addedAction.Id }, addedAction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAction(int id, Action action)
    {
        if (id != action.Id)
        {
            return BadRequest();
        }

        var actionToUpdate = await _actionService.GetActionByIdAsync(id);
        if (actionToUpdate == null)
        {
            return NotFound();
        }

        actionToUpdate.ActionType = action.ActionType;
        actionToUpdate.RewardXP = action.RewardXP;
        await _actionService.UpdateActionAsync(actionToUpdate);
        return Ok(actionToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteAction()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _actionService.DeleteActionRangeAsync(idList);
        return Ok(idList);
    }
}
