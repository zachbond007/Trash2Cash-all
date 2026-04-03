namespace trash2cash_backend.Services;

using System.Data;
using trash2cash_backend.Entities;
using trash2cash_backend.Helpers;
using trash2cash_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using trash2cash_backend.Models.OnlineVouchers;

public interface IOnlineVoucherService
{
    Task<ListResponse<OnlineVoucher>> GetAllOnlineVouchersAsync(IQueryCollection query);
    Task<List<OnlineVoucher>> GetAllOnlineVouchersWithIds(List<int> idList);
    Task<OnlineVoucher> GetOnlineVoucherByIdAsync(int id);
    Task<OnlineVoucher> AddOnlineVoucherAsync(OnlineVoucher onlineVoucher);
    Task UpdateOnlineVoucherAsync(OnlineVoucher onlineVoucher);
    Task DeleteOnlineVoucherAsync(int id);
    Task DeleteOnlineVoucherRangeAsync(List<int> id);
    Task<List<GetOnlineVouchersResponse>> GetOnlineVouchersByLevel(int level);
    Task<List<GetOnlineVouchersResponse>> GetOnlineVouchersForMarketPlace(GetOnlineVouchersForMarketPlaceRequest req);
    Task SubmitImportCouponsAsync(List<SubmitImportCouponRequest> req);
    Task<string> GetOnlineOffers();
}

public class OnlineVoucherService : IOnlineVoucherService
{
    private readonly ApplicationDbContext _dbContext;
    private List<string> fullCategoryList = new List<string>() {
                "Fashion",
                "Womens Apparels",
                "Mens Apparels",
                "Ethnic Wear",
                "Lingerie",
                "Eyewear",
                "Footwear",
                "Handbags and Wallets",
                "Jewellery",
                "Fashion Accessories",
                "Sportswear",
                "Kids Fashion",
                "Travel",
                "Travel Gear",
                "Electronics and Gadgets",
                "Cameras",
                "Gaming Consoles",
                "Computers and Laptops",
                "Computer Accessories",
                "Mobiles and Tablets",
                "Mobile Accessories",
                "Home Appliances",
                "Smart Devices",
                "Food and Beverage",
                "Snacks and Drinks",
                "Grocery",
                "Nutrition",
                "Body Care",
                "Makeup Products",
                "Health and Beauty",
                "Kitchenware",
                "Personal Care Appliances",
                "Fitness",
                "Sports Gear",
                "Cycles and Electric Bikes",
                "Sports and Outdoors",
                "Board Games and Toys",
                "CDs Books and Magazine",
                "Car and Bike Accessories",
                "Entertainment",
                "Gift Items",
                "Gift Cards"
    };

    public OnlineVoucherService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ListResponse<OnlineVoucher>> GetAllOnlineVouchersAsync(IQueryCollection query)
    {
        int page = Convert.ToInt32(query["pagination[page]"]);
        int perPage = Convert.ToInt32(query["pagination[perPage]"]);
        string sortField = query["sort[field]"]!;
        string sortOrder = query["sort[order]"]!;
        var length = await _dbContext.OnlineVouchers.CountAsync();
        var onlineVouchers = await _dbContext.OnlineVouchers.OrderBy(sortField, sortOrder == "DESC").Skip((page - 1) * perPage).Take(perPage).ToListAsync();
        var resp = new ListResponse<OnlineVoucher>
        {
            data = onlineVouchers,
            length = length
        };
        return resp;
    }

    public async Task<List<OnlineVoucher>> GetAllOnlineVouchersWithIds(List<int> idList)
    {
        return await _dbContext.OnlineVouchers.Where(x => idList.Contains(x.Id)).ToListAsync();
    }

    public async Task<OnlineVoucher> GetOnlineVoucherByIdAsync(int id)
    {
        return await _dbContext.OnlineVouchers.FindAsync(id);
    }

    public async Task<OnlineVoucher> AddOnlineVoucherAsync(OnlineVoucher onlineVoucher)
    {
        _dbContext.OnlineVouchers.Add(onlineVoucher);
        await _dbContext.SaveChangesAsync();
        return onlineVoucher;
    }

    public async Task UpdateOnlineVoucherAsync(OnlineVoucher onlineVoucher)
    {
        _dbContext.OnlineVouchers.Update(onlineVoucher);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteOnlineVoucherAsync(int id)
    {
        var onlineVoucher = await _dbContext.OnlineVouchers.FindAsync(id);
        _dbContext.OnlineVouchers.Remove(onlineVoucher);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteOnlineVoucherRangeAsync(List<int> idList)
    {
        var list = await _dbContext.OnlineVouchers.Where(x => idList.Contains(x.Id)).ToListAsync();
        _dbContext.OnlineVouchers.RemoveRange(list);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<GetOnlineVouchersResponse>> GetOnlineVouchersByLevel(int level)
    {

        var tempResult = await _dbContext.OnlineVouchers.Join(_dbContext.Merchants,
                           onlineVoucher => onlineVoucher.MerchantId,
                           merchant => merchant.Id,
                           (onlineVoucher, merchant) => new { Merchant = merchant, OnlineVoucher = onlineVoucher }).
            Where(x => x.OnlineVoucher.Level == level && x.OnlineVoucher.IsActive && x.Merchant.IsActive).
            Select(x => new GetOnlineVouchersResponse
            {
                voucher = x.OnlineVoucher,
                merchant = x.Merchant
            }).
            ToListAsync();
        var timeUtc = DateTime.UtcNow;
        TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById("America/New_York");
        DateTime easternTime = TimeZoneInfo.ConvertTimeFromUtc(timeUtc, easternZone);

        var finalResult = new List<GetOnlineVouchersResponse>();
        foreach (var item in tempResult)
        {
            if (item.voucher.EndDate <= easternTime.Date)
            {
                var onlineVoucher = await _dbContext.OnlineVouchers.FindAsync(item.voucher.Id);
                onlineVoucher.IsActive = false;
                _dbContext.OnlineVouchers.Update(onlineVoucher);
            }
            else
            {
                finalResult.Add(item);
            }
        }
        _dbContext.SaveChanges();
        return finalResult;
    }
    public async Task<List<GetOnlineVouchersResponse>> GetOnlineVouchersForMarketPlace(GetOnlineVouchersForMarketPlaceRequest req)
    {
        var mappedCategories = new List<string>();
        switch (req.Category)
        {
            case "apparel":
                mappedCategories.Add("Fashion");
                mappedCategories.Add("Womens Apparels");
                mappedCategories.Add("Mens Apparels");
                mappedCategories.Add("Ethnic Wear");
                mappedCategories.Add("Lingerie");
                mappedCategories.Add("Eyewear");
                mappedCategories.Add("Footwear");
                mappedCategories.Add("Handbags and Wallets");
                mappedCategories.Add("Jewellery");
                mappedCategories.Add("Fashion Accessories");
                mappedCategories.Add("Sportswear");
                mappedCategories.Add("Kids Fashion");
                break;
            case "travel":
                mappedCategories.Add("Travel");
                mappedCategories.Add("Travel Gear");

                break;
            case "electronics":
                mappedCategories.Add("Electronics and Gadgets");
                mappedCategories.Add("Cameras");
                mappedCategories.Add("Gaming Consoles");
                mappedCategories.Add("Computers and Laptops");
                mappedCategories.Add("Computer Accessories");
                mappedCategories.Add("Mobiles and Tablets");
                mappedCategories.Add("Mobile Accessories");
                mappedCategories.Add("Home Appliances");
                mappedCategories.Add("Smart Devices");
                break;
            case "groceries":
                mappedCategories.Add("Food and Beverage");
                mappedCategories.Add("Snacks and Drinks");
                mappedCategories.Add("Grocery");
                mappedCategories.Add("Nutrition");

                break;
            case "health":
                mappedCategories.Add("Body Care");
                mappedCategories.Add("Makeup Products");
                mappedCategories.Add("Health and Beauty");
                mappedCategories.Add("Kitchenware");
                mappedCategories.Add("Personal Care Appliances");
                mappedCategories.Add("Fitness");

                break;
            case "fun":
                mappedCategories.Add("Sports Gear");
                mappedCategories.Add("Cycles and Electric Bikes");
                mappedCategories.Add("Sports and Outdoors");
                mappedCategories.Add("Board Games and Toys");
                mappedCategories.Add("CDs Books and Magazine");
                mappedCategories.Add("Car and Bike Accessories");
                mappedCategories.Add("Entertainment");
                mappedCategories.Add("Gift Items");
                mappedCategories.Add("Gift Cards");
                break;
            default:
                break;
        }
        mappedCategories = mappedCategories.Select(category => category.ToLower()).ToList();


        var data = await _dbContext.OnlineVouchers.Join(_dbContext.Merchants,
        onlineVoucher => onlineVoucher.MerchantId,
        merchant => merchant.Id,
        (onlineVoucher, merchant) => new { Merchant = merchant, OnlineVoucher = onlineVoucher }).
        Where(x => x.Merchant.IsActive && x.OnlineVoucher.IsActive).
            //Where(x=>
            //req.Category == "other" ?
            // (x.OnlineVoucher.Categories == null || !(SplitCategories(x.OnlineVoucher.Categories.ToLower()).Intersect(fullCategoryList).Any()))
            //  :
            //x.OnlineVoucher.Categories != null && SplitCategories(x.OnlineVoucher.Categories.ToLower()).Intersect(mappedCategories).Any()
            //).
            Select(x => new GetOnlineVouchersResponse
            {
                voucher = x.OnlineVoucher,
                merchant = x.Merchant
            }).
            OrderBy(x => x.voucher.Level).
            ToListAsync();

        var tempResult =
            data.Where(x =>
            req.Category == "other" ?
             (x.voucher.Categories == null || !(SplitCategories(x.voucher.Categories).Intersect(fullCategoryList).Any()))
              :
            x.voucher.Categories != null && SplitCategories(x.voucher.Categories.ToLower()).Intersect(mappedCategories).Any()
            ).ToList();

        var timeUtc = DateTime.UtcNow;
        TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById("America/New_York");
        DateTime easternTime = TimeZoneInfo.ConvertTimeFromUtc(timeUtc, easternZone);

        var finalResult = new List<GetOnlineVouchersResponse>();
        foreach (var item in tempResult)
        {
            if (item.voucher.EndDate <= easternTime.Date)
            {
                var onlineVoucher = await _dbContext.OnlineVouchers.FindAsync(item.voucher.Id);
                onlineVoucher.IsActive = false;
                _dbContext.OnlineVouchers.Update(onlineVoucher);
            }
            else
            {
                finalResult.Add(item);
            }
        }
        _dbContext.SaveChanges();
        return finalResult;
    }

    // Custom method to split categories
    private IEnumerable<string> SplitCategories(string categoryField)
    {
        return categoryField.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                            .Select(category => category.Trim());
    }

    public async Task SubmitImportCouponsAsync(List<SubmitImportCouponRequest> req)
    {
        var merchants = _dbContext.Merchants.ToList();
        for (int i = 0; i < req.Count; i++)
        {
            var coupon = req[i];
            var merchant = merchants.FirstOrDefault(x => x.Name == coupon.store);
            var newCoupon = new OnlineVoucher()
            {
                Categories = string.Join(",", coupon.selected_categories),
                Code = coupon.code,
                Description = coupon.description,
                EndDate = coupon.end_date,
                IsActive = true,
                Level = coupon.level,
                Link = coupon.url,
                LmdId = coupon.lmd_id,
                Offer = coupon.offer_text,
                OfferValue = coupon.offer_value,
                SmartLink = coupon.smartLink,
                StartDate = coupon.start_date,
                Store = coupon.store,
                Title = coupon.title,
                MerchantId = merchant != null ? merchant.Id : 999999999
            };

            _dbContext.OnlineVouchers.Add(newCoupon);
        }

        var configToUpdate = _dbContext.Configs.FirstOrDefault(x => x.Key == "last-import-time");
        configToUpdate.Value = new DateTimeOffset(DateTime.Now).ToUnixTimeMilliseconds().ToString();
        _dbContext.Configs.Update(configToUpdate);
        _dbContext.SaveChanges();
    }

    public async Task<string> GetOnlineOffers()
    {
        using var httpClient = new HttpClient();
        var lastImportTime = _dbContext.Configs.First(x => x.Key == "last-import-time").Value;
        string url = "https://feed.linkmydeals.com/getOffers/?API_KEY=3cd7b4b952900c28083b690ad2889e34&format=json&incremental=1&last_extract=" + lastImportTime;
        try
        {
            // Send the GET request
            HttpResponseMessage response = await httpClient.GetAsync(url);
            // Check if the response is successful
            if (response.IsSuccessStatusCode)
            {
                // Read the response content as a string
                string responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Response:");
                Console.WriteLine(responseBody);
                return responseBody;
            }
            else
            {
                Console.WriteLine($"HTTP request failed with status code: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
        return "";
    }

}
