namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Drawing;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class MerchantsController : ControllerBase
{
    private readonly IMerchantService _merchantService;
    private readonly IS3Service _s3Service;

    public MerchantsController(IMerchantService merchantService, IS3Service s3Service)
    {
        _merchantService = merchantService;
        _s3Service = s3Service;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Merchant>>> GetAllMerchants()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _merchantService.GetAllMerchantsWithIds(idList));
        }
        else
        {
            return Ok(await _merchantService.GetAllMerchantsAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Merchant>> GetMerchantById(int id)
    {
        var merchant = await _merchantService.GetMerchantByIdAsync(id);
        if (merchant == null)
        {
            return NotFound();
        }
        return Ok(merchant);
    }


    [HttpPost]
    public async Task<IActionResult> AddMerchant([FromForm] string name,
        [FromForm] string? contactName,
        [FromForm] string? contactEmail,
        [FromForm] string? contactPhone,
        [FromForm] string? color,
        [FromForm] bool isActive,
        [FromForm] IFormFile? imageKey)
    {

        var merchant = new Merchant()
        {
            Name = name,
            ContactEmail = contactEmail,
            ContactName = contactName,
            ContactPhone = contactPhone,
            Color = color,
            ImageKey = "",
            IsActive = isActive
        };

        var addedMerchant = await _merchantService.AddMerchantAsync(merchant);
        if (imageKey == null || imageKey.Length == 0)
        {
            return CreatedAtAction(nameof(GetMerchantById), new { id = addedMerchant.Id }, addedMerchant);
        }

        var _imageKey = $"merchants/{addedMerchant.Id}/{Guid.NewGuid()}{Path.GetExtension(imageKey.FileName)}";
        var result = await _s3Service.UploadFile(imageKey, _imageKey);
        addedMerchant.ImageKey = result;
        await _merchantService.UpdateMerchantAsync(addedMerchant,true);
        return CreatedAtAction(nameof(GetMerchantById), new { id = addedMerchant.Id }, addedMerchant);
    }


    [HttpPost("updateMerchant")]
    public async Task<IActionResult> UpdateMerchant( Merchant merchant)
    {
        await _merchantService.UpdateMerchantAsync(merchant,false);
        return Ok(merchant);
    }

    [HttpPost("edit")]
    public async Task<IActionResult> UpdateMerchantWithPhoto([FromForm] string id, [FromForm] string name,
        [FromForm] string? contactName,
        [FromForm] string? contactEmail,
        [FromForm] string? contactPhone,
        [FromForm] string color,
        [FromForm] IFormFile imageKey)
    {
        var merchantToUpdate = await _merchantService.GetMerchantByIdAsync(Convert.ToInt32(id));
        if (merchantToUpdate == null)
        {
            return NotFound();
        }

        if (imageKey == null || imageKey.Length == 0)
            return BadRequest("Invalid file");

        var _imageKey = $"merchants/{id}/{Guid.NewGuid()}{Path.GetExtension(imageKey.FileName)}";
        var result = await _s3Service.UploadFile(imageKey, _imageKey);
        merchantToUpdate.ImageKey = result;
        merchantToUpdate.Name = name;
        merchantToUpdate.ContactEmail = contactEmail;
        merchantToUpdate.ContactName = contactName;
        merchantToUpdate.ContactPhone = contactPhone;
        merchantToUpdate.Color = color;
        await _merchantService.UpdateMerchantAsync(merchantToUpdate,true);
        return Ok(merchantToUpdate);
    }
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteMerchant()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _merchantService.DeleteMerchantRangeAsync(idList);
        return Ok(idList);
    }

    [AllowAnonymous]
    [HttpGet("getMerchantImageUris")]
    public async Task<IActionResult> GetMerchantImageUris()
    {
        var result = await _merchantService.GetMerchantImageUris();
        return Ok(result);
    }
}
