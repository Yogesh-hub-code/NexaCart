using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NexaCart.Application.DTOs.Wishlist
{
  public class AddToWishlistRequest
  {
    public int UserId { get; set; }

    public int ProductId { get; set; }
  }
}
