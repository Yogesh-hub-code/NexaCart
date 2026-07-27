using NexaCart.Application.DTOs.Cart;

namespace NexaCart.Application.Interfaces
{
  public interface ICartService
  {
    Task<bool> AddToCartAsync(AddToCartRequest request);

    Task<CartResponse?> GetCartAsync(int userId);

    Task<bool> UpdateQuantityAsync(UpdateCartRequest request);

    Task<bool> RemoveItemAsync(int cartItemId);

    Task<bool> ClearCartAsync(int userId);
  }
}
