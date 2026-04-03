namespace trash2cash_backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using trash2cash_backend.Authorization;
using trash2cash_backend.Models;
using trash2cash_backend.Services;
using trash2cash_backend.Entities;
using Microsoft.EntityFrameworkCore;
using trash2cash_backend.Models.OnlineVouchers;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class OnlineVouchersController : ControllerBase
{
    private readonly IOnlineVoucherService _onlineVoucherService;
    private readonly ILevelService _levelService;

    public OnlineVouchersController(IOnlineVoucherService onlineVoucherService, ILevelService levelService)
    {
        _levelService = levelService;
        _onlineVoucherService = onlineVoucherService;
    }

    [HttpGet]
    public async Task<ActionResult<ListResponse<OnlineVoucher>>> GetAllOnlineVouchers()
    {
        var idParams = HttpContext.Request.Query["id"].ToString();
        if (idParams != "")
        {
            List<int> idList = idParams.Split(',').Select(int.Parse).ToList();
            return Ok(await _onlineVoucherService.GetAllOnlineVouchersWithIds(idList));
        }
        else
        {
            return Ok(await _onlineVoucherService.GetAllOnlineVouchersAsync(HttpContext.Request.Query));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OnlineVoucher>> GetOnlineVoucherById(int id)
    {
        var onlineVoucher = await _onlineVoucherService.GetOnlineVoucherByIdAsync(id);
        if (onlineVoucher == null)
        {
            return NotFound();
        }
        return Ok(onlineVoucher);
    }

    [HttpPost]
    public async Task<ActionResult<OnlineVoucher>> AddOnlineVoucher(OnlineVoucher onlineVoucher)
    {
        var addedOnlineVoucher = await _onlineVoucherService.AddOnlineVoucherAsync(onlineVoucher);
        return CreatedAtAction(nameof(GetOnlineVoucherById), new { id = addedOnlineVoucher.Id }, addedOnlineVoucher);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOnlineVoucher(int id, OnlineVoucher onlineVoucher)
    {
        if (id != onlineVoucher.Id)
        {
            return BadRequest();
        }

        var onlineVoucherToUpdate = await _onlineVoucherService.GetOnlineVoucherByIdAsync(id);
        if (onlineVoucherToUpdate == null)
        {
            return NotFound();
        }

        onlineVoucherToUpdate.Title = onlineVoucher.Title;
        onlineVoucherToUpdate.EndDate = onlineVoucher.EndDate;
        onlineVoucherToUpdate.Link = onlineVoucher.Link;
        onlineVoucherToUpdate.LmdId = onlineVoucher.LmdId;
        onlineVoucherToUpdate.Offer = onlineVoucher.Offer;
        onlineVoucherToUpdate.OfferValue = onlineVoucher.OfferValue;
        onlineVoucherToUpdate.SmartLink = onlineVoucher.SmartLink;
        onlineVoucherToUpdate.StartDate = onlineVoucher.StartDate;
        onlineVoucherToUpdate.Store = onlineVoucher.Store;
        onlineVoucherToUpdate.MerchantId = onlineVoucher.MerchantId;
        onlineVoucherToUpdate.Description = onlineVoucher.Description;
        onlineVoucherToUpdate.Code = onlineVoucher.Code;
        onlineVoucherToUpdate.Level = onlineVoucher.Level;
        onlineVoucherToUpdate.IsActive = onlineVoucher.IsActive;
        onlineVoucherToUpdate.Categories = onlineVoucher.Categories;
        await _onlineVoucherService.UpdateOnlineVoucherAsync(onlineVoucherToUpdate);
        return Ok(onlineVoucherToUpdate);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteOnlineVoucher()
    {
        List<int> idList = HttpContext.Request.Query["id"].ToString().Split(',').Select(int.Parse).ToList();
        await _onlineVoucherService.DeleteOnlineVoucherRangeAsync(idList);
        return Ok(idList);
    }

    [AllowAnonymous]
    [HttpGet("getOnlineVouchersByLevel/{level}")]
    public async Task<ActionResult> GetOnlineVouchersByLevel(int level)
    {
        var nextLevelRequiredXp = await _levelService.GetNextLevelRequiredXp(level);
        var onlineVouchers = await _onlineVoucherService.GetOnlineVouchersByLevel(level);
        return Ok(new {
            onlineVouchers= onlineVouchers,
            nextLevelRequiredXp = nextLevelRequiredXp
        });
    }

    [HttpPost("getOnlineVouchersForMarketPlace")]
    public async Task<ActionResult<List<GetOnlineVouchersResponse>>> GetOnlineVouchersForMarketPlace(GetOnlineVouchersForMarketPlaceRequest req)
    {
        var onlineVouchers = await _onlineVoucherService.GetOnlineVouchersForMarketPlace(req);
        return Ok(onlineVouchers);
    }

    [HttpPost("submitImportCoupon")]
    public async Task<IActionResult> submitImportCoupons(List<SubmitImportCouponRequest> req)
    {
        var addedOnlineVoucher =  _onlineVoucherService.SubmitImportCouponsAsync(req);
        return Ok(true);
    }

    [HttpGet("getOnlineOffers")]
    public async Task<IActionResult> getOnlineOffers()
    {
        var data = await _onlineVoucherService.GetOnlineOffers();
        return Ok(data);
    }
}
