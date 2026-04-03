namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using Microsoft.EntityFrameworkCore;
using trash2cash_backend.Models.Hunts;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class HuntsController : ControllerBase
{
    private readonly IHuntService _huntService;

    public HuntsController(IHuntService huntService)
    {
        _huntService = huntService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Hunt>>> GetAllHunts()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _huntService.GetAllHuntsWithIds(idList));
        }
        else
        {
            return Ok(await _huntService.GetAllHuntsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Hunt>> GetHuntById(int id)
    {
        var hunt = await _huntService.GetHuntByIdAsync(id);
        if (hunt == null)
        {
            return NotFound();
        }
        return Ok(hunt);
    }

    [HttpPost]
    public async Task<ActionResult<Hunt>> AddHunt(Hunt hunt)
    {
        var addedHunt = await _huntService.AddHuntAsync(hunt);
        return CreatedAtAction(nameof(GetHuntById), new { id = addedHunt.Id }, addedHunt);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHunt(int id, Hunt hunt)
    {
        if (id != hunt.Id)
        {
            return BadRequest();
        }

        var huntToUpdate = await _huntService.GetHuntByIdAsync(id);
        if (huntToUpdate == null)
        {
            return NotFound();
        }

        huntToUpdate.UserId = hunt.UserId;
        huntToUpdate.ImageKey = hunt.ImageKey;
        huntToUpdate.Status = hunt.Status;
        huntToUpdate.VerifiedAs = hunt.VerifiedAs;
        huntToUpdate.CreatedAt = hunt.CreatedAt;
        huntToUpdate.EarnedXP = hunt.EarnedXP;
        await _huntService.UpdateHuntAsync(huntToUpdate);
        return Ok(huntToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteHunt()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _huntService.DeleteHuntRangeAsync(idList);
        return Ok(idList);
    }


    [HttpPost("adminVerifyHunt")]
    public async Task<IActionResult> AdminVerifyHunt(AdminVerifyHuntRequest req)
    {
        var result = await _huntService.AdminVerifyHunt(req);
        return Ok(result);
    }


    [HttpPost("createHunt")]
    public async Task<IActionResult> CreateHunt(CreateHuntRequest req)
    {
        var user = HttpContext.Items["User"] as User;
        await _huntService.CreateHunt(req,user);
        return Ok();
    }


    [HttpPost("getHuntsForVerification")]
    public async Task<IActionResult> GetHuntsForVerification(GetHuntsForVerificationRequest req)
    {
        var user = HttpContext.Items["User"] as User;
       var result = await _huntService.GetHuntsForVerification(req, user);
        return Ok(result);
    }
}
