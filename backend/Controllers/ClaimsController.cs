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
public class ClaimsController : ControllerBase
{
    private readonly IClaimService _claimService;

    public ClaimsController(IClaimService claimService)
    {
        _claimService = claimService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Claim>>> GetAllClaims()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _claimService.GetAllClaimsWithIds(idList));
        }
        else
        {
            return Ok(await _claimService.GetAllClaimsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Claim>> GetClaimById(int id)
    {
        var claim = await _claimService.GetClaimByIdAsync(id);
        if (claim == null)
        {
            return NotFound();
        }
        return Ok(claim);
    }

    [HttpPost]
    public async Task<ActionResult<Claim>> AddClaim(Claim claim)
    {
        var addedClaim = await _claimService.AddClaimAsync(claim);
        return CreatedAtAction(nameof(GetClaimById), new { id = addedClaim.Id }, addedClaim);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClaim(int id, Claim claim)
    {
        if (id != claim.Id)
        {
            return BadRequest();
        }

        var claimToUpdate = await _claimService.GetClaimByIdAsync(id);
        if (claimToUpdate == null)
        {
            return NotFound();
        }

        claimToUpdate.VoucherId = claim.VoucherId;
        claimToUpdate.UserId = claim.UserId;
        await _claimService.UpdateClaimAsync(claimToUpdate);
        return Ok(claimToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteClaim()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _claimService.DeleteClaimRangeAsync(idList);
        return Ok(idList);
    }
}
