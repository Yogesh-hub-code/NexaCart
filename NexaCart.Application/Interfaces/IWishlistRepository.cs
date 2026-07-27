using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using NexaCart.Application.DTOs.Wishlist;

namespace NexaCart.Application.Interfaces
{
  public interface IWishlistRepository
  {
    Task<bool> AddToWishlistAsync(AddToWishlistRequest request);

    Task<List<WishlistResponse>> GetWishlistAsync(int userId);

    Task<bool> RemoveFromWishlistAsync(int wishlistId);
  }
}
