using System.ComponentModel.DataAnnotations;
using NexaCart.Domain.Common;

namespace NexaCart.Application.DTOs.Products
{
  public class CreateProductRequest : BaseEntity
  {
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? ProductDescription { get; set; }

    [Required]
    public decimal Price { get; set; }

    public decimal DiscountPrice { get; set; }

    [Required]
    public int StockQuantity { get; set; }

    public string? SKU { get; set; }

    public string? ThumbnailImage { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int BrandId { get; set; }
  }
}
