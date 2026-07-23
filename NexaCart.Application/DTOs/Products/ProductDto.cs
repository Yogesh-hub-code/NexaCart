using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NexaCart.Application.DTOs.Products
{
  public class ProductDto
  {
    public int ProductId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public decimal DiscountPrice { get; set; }

    public int StockQuantity { get; set; }

    public string? SKU { get; set; }

    public string? ImageUrl { get; set; }

    public int CategoryId { get; set; }

    public int BrandId { get; set; }

    public bool IsActive { get; set; }
  }
}
