using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Common;

namespace NexaCart.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public decimal DiscountPrice { get; set; }

        public int StockQuantity { get; set; }

        public string? SKU { get; set; }

        public string? ImageUrl { get; set; }

        public int CategoryId { get; set; }

        public Category? Category { get; set; }

        public int BrandId { get; set; }

        public Brand? Brand { get; set; }
    }
}
