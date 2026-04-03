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
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationsController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Location>>> GetAllLocations()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _locationService.GetAllLocationsWithIds(idList));
        }
        else
        {
            return Ok(await _locationService.GetAllLocationsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Location>> GetLocationById(int id)
    {
        var location = await _locationService.GetLocationByIdAsync(id);
        if (location == null)
        {
            return NotFound();
        }
        return Ok(location);
    }

    [HttpPost]
    public async Task<ActionResult<Location>> AddLocation(Location location)
    {
        var addedLocation = await _locationService.AddLocationAsync(location);
        return CreatedAtAction(nameof(GetLocationById), new { id = addedLocation.Id }, addedLocation);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLocation(int id, Location location)
    {
        if (id != location.Id)
        {
            return BadRequest();
        }

        var locationToUpdate = await _locationService.GetLocationByIdAsync(id);
        if (locationToUpdate == null)
        {
            return NotFound();
        }

        locationToUpdate.MerchantId = location.MerchantId;
        locationToUpdate.Name = location.Name;
        locationToUpdate.Address = location.Address;
        locationToUpdate.Lat = location.Lat;
        locationToUpdate.Lng = location.Lng;
        await _locationService.UpdateLocationAsync(locationToUpdate);
        return Ok(locationToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteLocation()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _locationService.DeleteLocationRangeAsync(idList);
        return Ok(idList);
    }
}
