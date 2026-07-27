using Microsoft.AspNetCore.Mvc;
using NexaCart.Application.DTOs.Cart;
using NexaCart.Application.Interfaces;

namespace NexaCart.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class CartController : ControllerBase
  {
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
      _cartService = cartService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(AddToCartRequest request)
    {
      try
      {
        var result = await _cartService.AddToCartAsync(request);

        if (!result)
        {
          return BadRequest(new
          {
            success = false,
            message = "Unable to add product to cart."
          });
        }

        return Ok(new
        {
          success = true,
          message = "Product added to cart successfully."
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new
        {
          success = false,
          message = ex.Message
        });
      }
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
      var cart = await _cartService.GetCartAsync(userId);

      if (cart == null)
        return NotFound("Cart not found.");

      return Ok(cart);
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateQuantity(UpdateCartRequest request)
    {
      var result = await _cartService.UpdateQuantityAsync(request);

      if (!result)
        return BadRequest("Unable to update quantity.");

      return Ok("Quantity updated successfully.");
    }

    [HttpDelete("remove/{cartItemId}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
      var result = await _cartService.RemoveItemAsync(cartItemId);

      if (!result)
        return BadRequest("Unable to remove item.");

      return Ok("Item removed successfully.");
    }

    [HttpDelete("clear/{userId}")]
    public async Task<IActionResult> ClearCart(int userId)
    {
      var result = await _cartService.ClearCartAsync(userId);

      if (!result)
        return BadRequest("Unable to clear cart.");

      return Ok("Cart cleared successfully.");
    }
  }
}
