using System;
namespace trash2cash_backend.Entities
{
    public class Merchant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ContactName { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public string? ImageKey { get; set; }
        public string? Color { get; set; }
        public bool IsActive { get; set; }
    }
}

