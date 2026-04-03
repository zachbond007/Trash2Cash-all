namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using Microsoft.EntityFrameworkCore;
using trash2cash_backend.Models.VoucherLocations;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class VoucherLocationsController : ControllerBase
{
    private readonly IVoucherLocationService _voucherLocationService;

    public VoucherLocationsController(IVoucherLocationService voucherLocationService)
    {
        _voucherLocationService = voucherLocationService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<VoucherLocation>>> GetAllVoucherLocations()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _voucherLocationService.GetAllVoucherLocationsWithIds(idList));
        }
        else
        {
            return Ok(await _voucherLocationService.GetAllVoucherLocationsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VoucherLocation>> GetVoucherLocationById(int id)
    {
        var voucherLocation = await _voucherLocationService.GetVoucherLocationByIdAsync(id);
        if (voucherLocation == null)
        {
            return NotFound();
        }
        return Ok(voucherLocation);
    }

    [HttpPost]
    public async Task<ActionResult<VoucherLocation>> AddVoucherLocation(VoucherLocation voucherLocation)
    {
        var addedVoucherLocation = await _voucherLocationService.AddVoucherLocationAsync(voucherLocation);
        return CreatedAtAction(nameof(GetVoucherLocationById), new { id = addedVoucherLocation.Id }, addedVoucherLocation);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVoucherLocation(int id, VoucherLocation voucherLocation)
    {
        if (id != voucherLocation.Id)
        {
            return BadRequest();
        }

        var voucherLocationToUpdate = await _voucherLocationService.GetVoucherLocationByIdAsync(id);
        if (voucherLocationToUpdate == null)
        {
            return NotFound();
        }

        voucherLocationToUpdate.VoucherId = voucherLocation.VoucherId;
        voucherLocationToUpdate.LocationId = voucherLocation.LocationId;
        await _voucherLocationService.UpdateVoucherLocationAsync(voucherLocationToUpdate);
        return Ok(voucherLocationToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteVoucherLocation()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _voucherLocationService.DeleteVoucherLocationRangeAsync(idList);
        return Ok(idList);
    }

    [HttpPost("getNearestLocations")]
    public async Task<IActionResult> GetNearestLocations(GetNearestLocationsRequest req)
    {
        var resp = await _voucherLocationService.GetNearestLocations(req);
        return Ok(resp);
    }
}
