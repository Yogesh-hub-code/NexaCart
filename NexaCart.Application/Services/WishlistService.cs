using NexaCart.Application.DTOs.Wishlist;
using NexaCart.Application.Interfaces;

namespace NexaCart.Application.Services
{
  public class WishlistService : IWishlistService
  {
    private readonly IWishlistRepository _wishlistRepository;

    public WishlistService(IWishlistRepository wishlistRepository)
    {
      _wishlistRepository = wishlistRepository;
    }

    public async Task<bool> AddToWishlistAsync(AddToWishlistRequest request)
    {
      return await _wishlistRepository.AddToWishlistAsync(request);
    }

    public async Task<List<WishlistResponse>> GetWishlistAsync(int userId)
    {
      return await _wishlistRepository.GetWishlistAsync(userId);
    }

    public async Task<bool> RemoveFromWishlistAsync(int wishlistId)
    {
      return await _wishlistRepository.RemoveFromWishlistAsync(wishlistId);
    }
  }
}
