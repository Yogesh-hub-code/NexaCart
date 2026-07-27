using NexaCart.Application.DTOs.Cart;
using NexaCart.Application.Interfaces;

namespace NexaCart.Application.Services
{
  public class CartService : ICartService
  {
    private readonly ICartRepository _cartRepository;

    public CartService(ICartRepository cartRepository)
    {
      _cartRepository = cartRepository;
    }

    public async Task<bool> AddToCartAsync(AddToCartRequest request)
    {
      return await _cartRepository.AddToCartAsync(request);
    }

    public async Task<CartResponse?> GetCartAsync(int userId)
    {
      return await _cartRepository.GetCartAsync(userId);
    }

    public async Task<bool> UpdateQuantityAsync(UpdateCartRequest request)
    {
      return await _cartRepository.UpdateQuantityAsync(request);
    }

    public async Task<bool> RemoveItemAsync(int cartItemId)
    {
      return await _cartRepository.RemoveItemAsync(cartItemId);
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
      return await _cartRepository.ClearCartAsync(userId);
    }
  }
}
