using System;
namespace trash2cash_backend.Entities
{
    public class OnlineVoucher
    {
        public int Id { get; set; }
        public int Level { get; set; }
        public int MerchantId { get; set; }
        public string? LmdId { get; set; }
        public string? Store { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Code { get; set; }
        public string? Link { get; set; }
        public string? SmartLink { get; set; }
        public string? Categories { get; set; }
        public string? Offer{ get; set; }
        public string? OfferValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}

