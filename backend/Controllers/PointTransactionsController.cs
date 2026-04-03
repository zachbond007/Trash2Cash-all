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
public class PointTransactionsController : ControllerBase
{
    private readonly IPointTransactionService _pointTransactionService;

    public PointTransactionsController(IPointTransactionService pointTransactionService)
    {
        _pointTransactionService = pointTransactionService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<PointTransaction>>> GetAllPointTransactions()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _pointTransactionService.GetAllPointTransactionsWithIds(idList));
        }
        else
        {
            return Ok(await _pointTransactionService.GetAllPointTransactionsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PointTransaction>> GetPointTransactionById(int id)
    {
        var pointTransaction = await _pointTransactionService.GetPointTransactionByIdAsync(id);
        if (pointTransaction == null)
        {
            return NotFound();
        }
        return Ok(pointTransaction);
    }

    [HttpPost]
    public async Task<ActionResult<PointTransaction>> AddPointTransaction(PointTransaction pointTransaction)
    {
        var addedPointTransaction = await _pointTransactionService.AddPointTransactionAsync(pointTransaction);
        return CreatedAtAction(nameof(GetPointTransactionById), new { id = addedPointTransaction.Id }, addedPointTransaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePointTransaction(int id, PointTransaction pointTransaction)
    {
        if (id != pointTransaction.Id)
        {
            return BadRequest();
        }

        var pointTransactionToUpdate = await _pointTransactionService.GetPointTransactionByIdAsync(id);
        if (pointTransactionToUpdate == null)
        {
            return NotFound();
        }

        pointTransactionToUpdate.UserId = pointTransaction.UserId;
        pointTransactionToUpdate.ActionType = pointTransaction.ActionType;
        pointTransactionToUpdate.EarnedXP = pointTransaction.EarnedXP;
        await _pointTransactionService.UpdatePointTransactionAsync(pointTransactionToUpdate);
        return Ok(pointTransactionToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeletePointTransaction()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _pointTransactionService.DeletePointTransactionRangeAsync(idList);
        return Ok(idList);
    }
}
