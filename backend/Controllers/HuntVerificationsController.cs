namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using Microsoft.EntityFrameworkCore;
using trash2cash_backend.Models.HuntVerifications;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class HuntVerificationsController : ControllerBase
{
    private readonly IHuntVerificationService _huntVerificationService;

    public HuntVerificationsController(IHuntVerificationService huntVerificationService)
    {
        _huntVerificationService = huntVerificationService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<HuntVerification>>> GetAllHuntVerifications()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _huntVerificationService.GetAllHuntVerificationsWithIds(idList));
        }
        else
        {
            return Ok(await _huntVerificationService.GetAllHuntVerificationsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HuntVerification>> GetHuntVerificationById(int id)
    {
        var huntVerification = await _huntVerificationService.GetHuntVerificationByIdAsync(id);
        if (huntVerification == null)
        {
            return NotFound();
        }
        return Ok(huntVerification);
    }

    [HttpPost]
    public async Task<ActionResult<HuntVerification>> AddHuntVerification(HuntVerification huntVerification)
    {
        var addedHuntVerification = await _huntVerificationService.AddHuntVerificationAsync(huntVerification);
        return CreatedAtAction(nameof(GetHuntVerificationById), new { id = addedHuntVerification.Id }, addedHuntVerification);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHuntVerification(int id, HuntVerification huntVerification)
    {
        if (id != huntVerification.Id)
        {
            return BadRequest();
        }

        var huntVerificationToUpdate = await _huntVerificationService.GetHuntVerificationByIdAsync(id);
        if (huntVerificationToUpdate == null)
        {
            return NotFound();
        }

        huntVerificationToUpdate.HuntId = huntVerification.HuntId;
        huntVerificationToUpdate.VerifiedBy = huntVerification.VerifiedBy;
        huntVerificationToUpdate.IsTrashThrown = huntVerification.IsTrashThrown;
        huntVerificationToUpdate.HowMuchTrash = huntVerification.HowMuchTrash;
        await _huntVerificationService.UpdateHuntVerificationAsync(huntVerificationToUpdate);
        return Ok(huntVerificationToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteHuntVerification()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _huntVerificationService.DeleteHuntVerificationRangeAsync(idList);
        return Ok(idList);
    }

    [HttpPost("submitHuntVerification")]
    public async Task<IActionResult> SubmitHuntVerification(SubmitHuntVerificationRequest req)
    {
        var user = HttpContext.Items["User"] as User;
        var res =  await _huntVerificationService.SubmitHuntVerification(req, user);
        return Ok(res);
    }
}
