using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NexaCart.Application.DTOs.Wishlist
{
  public class WishlistResponse
  {
    public int WishlistId { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal DiscountPrice { get; set; }

    public string? ThumbnailImage { get; set; }
  }
}
