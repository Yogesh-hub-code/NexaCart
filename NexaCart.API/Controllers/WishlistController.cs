using Microsoft.AspNetCore.Mvc;
using NexaCart.Application.DTOs.Wishlist;
using NexaCart.Application.Interfaces;

namespace NexaCart.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class WishlistController : ControllerBase
  {
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService)
    {
      _wishlistService = wishlistService;
    }


    // Add product to wishlist
    [HttpPost]
    public async Task<IActionResult> AddToWishlist(AddToWishlistRequest request)
    {
      var result = await _wishlistService.AddToWishlistAsync(request);

      return Ok(new
      {
        success = result,
        message = "Product added to wishlist"
      });
    }


    // Get user wishlist
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetWishlist(int userId)
    {
      var wishlist = await _wishlistService.GetWishlistAsync(userId);

      return Ok(wishlist);
    }


    // Remove from wishlist
    [HttpDelete("{wishlistId}")]
    public async Task<IActionResult> RemoveFromWishlist(int wishlistId)
    {
      var result = await _wishlistService.RemoveFromWishlistAsync(wishlistId);

      if (!result)
        return NotFound(new
        {
          message = "Wishlist item not found"
        });

      return Ok(new
      {
        success = true,
        message = "Removed from wishlist"
      });
    }
  }
}
