using System;
using trash2cash_backend.Entities;

namespace trash2cash_backend.Models.OnlineVouchers
{
    public class SubmitImportCouponRequest
    {
        public string? lmd_id { get; set; }
        public string? offer_text { get; set; }
        public string? offer_value { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public string? code { get; set; }
        public string? store { get; set; }
        public string? url { get; set; }
        public string? smartLink { get; set; }
        public string? categories { get; set; }
        public int level { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public bool selected { get; set; }
        public List<string>? selected_categories { get; set; }
    }
}
