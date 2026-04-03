namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using Microsoft.EntityFrameworkCore;
using trash2cash_backend.Models.Vouchers;
using System.Reflection.Emit;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class VouchersController : ControllerBase
{
    private readonly IVoucherService _voucherService;
    private readonly ILevelService _levelService;

    public VouchersController(IVoucherService voucherService, ILevelService levelService)
    {
        _levelService = levelService;
        _voucherService = voucherService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<Voucher>>> GetAllVouchers()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _voucherService.GetAllVouchersWithIds(idList));
        }
        else
        {
            return Ok(await _voucherService.GetAllVouchersAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Voucher>> GetVoucherById(int id)
    {
        var voucher = await _voucherService.GetVoucherByIdAsync(id);
        if (voucher == null)
        {
            return NotFound();
        }
        return Ok(voucher);
    }

    [HttpPost]
    public async Task<ActionResult<Voucher>> AddVoucher(Voucher voucher)
    {
        var addedVoucher = await _voucherService.AddVoucherAsync(voucher);
        return CreatedAtAction(nameof(GetVoucherById), new { id = addedVoucher.Id }, addedVoucher);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVoucher(int id, Voucher voucher)
    {
        if (id != voucher.Id)
        {
            return BadRequest();
        }

        var voucherToUpdate = await _voucherService.GetVoucherByIdAsync(id);
        if (voucherToUpdate == null)
        {
            return NotFound();
        }

        voucherToUpdate.MerchantId = voucher.MerchantId;
        voucherToUpdate.Title = voucher.Title;
        voucherToUpdate.Description = voucher.Description;
        voucherToUpdate.Code = voucher.Code;
        voucherToUpdate.Type = voucher.Type;
        voucherToUpdate.Level = voucher.Level;
        voucherToUpdate.IsActive = voucher.IsActive;
        await _voucherService.UpdateVoucherAsync(voucherToUpdate);
        return Ok(voucherToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteVoucher()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _voucherService.DeleteVoucherRangeAsync(idList);
        return Ok(idList);
    }

    // NEED TO REMOVE THIS ENDPOINT LATER
    [AllowAnonymous]
    [HttpGet("getVouchersByLevel/{level}")]
    public async Task<ActionResult> GetVouchersByLevel(int level)
    {
        var nextLevelRequiredXp = await _levelService.GetNextLevelRequiredXp(level);
        var vouchers = await _voucherService.GetVouchersByLevel(level);
        return Ok(new {
            vouchers= vouchers,
            nextLevelRequiredXp = nextLevelRequiredXp
        });
    }

    [AllowAnonymous]
    [HttpPost("getVouchersByLevel")]
    public async Task<ActionResult> GetVouchersByLevelNew(GetVouchersByLevelNewRequest req)
    {
        var nextLevelRequiredXp = await _levelService.GetNextLevelRequiredXp(req.level);
        var vouchers = await _voucherService.GetVouchersByLevelNew(req);

        return Ok(new
        {
            vouchers = vouchers,
            nextLevelRequiredXp = nextLevelRequiredXp
        });
    }


    // OLD METHOD AFTER SWITICHING ONLINE. REMOVE IN THE FUTURE
    [HttpGet("getVouchersForMarketPlace")]
    public async Task<ActionResult<List<GetVouchersResponse>>> GetVouchersForMarketPlace()
    {
        var vouchers = await _voucherService.GetVouchersForMarketPlace();
        return Ok(vouchers);
    }

    [HttpPost("getVouchersForMarketPlace")]
    public async Task<ActionResult<List<GetVouchersResponse>>> GetVouchersForMarketPlace(GetVouchersForMarketPlaceRequest req)
    {
        var vouchers = await _voucherService.GetVouchersForMarketPlace(req);
        return Ok(vouchers);
    }
    
}
