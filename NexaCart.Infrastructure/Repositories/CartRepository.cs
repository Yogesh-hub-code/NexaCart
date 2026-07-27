using Microsoft.EntityFrameworkCore;
using NexaCart.Application.DTOs.Cart;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;
using NexaCart.Infrastructure.Persistence.Contexts;

namespace NexaCart.Infrastructure.Repositories
{
  public class CartRepository : ICartRepository
  {
    private readonly ApplicationDbContext _context;

    public CartRepository(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<bool> AddToCartAsync(AddToCartRequest request)
    {
      try
      {
        var cart = await _context.Carts
          .FirstOrDefaultAsync(x => x.UserId == request.UserId);

        // Create a cart if it doesn't exist
        if (cart == null)
        {
          cart = new Cart
          {
            UserId = request.UserId,
            CreatedOn = DateTime.UtcNow
          };

          _context.Carts.Add(cart);
          await _context.SaveChangesAsync();
        }

        // Check whether the product already exists in the cart
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(x =>
                x.CartId == cart.CartId &&
                x.ProductId == request.ProductId);

        if (cartItem != null)
        {
          cartItem.Quantity += request.Quantity;
        }
        else
        {
          // Get product price
          var product = await _context.Products
              .FirstOrDefaultAsync(x => x.ProductId == request.ProductId);

          if (product == null)
            return false;

          cartItem = new CartItem
          {
            CartId = cart.CartId,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            UnitPrice = product.Price
          };

          _context.CartItems.Add(cartItem);
        }

        await _context.SaveChangesAsync();

        return true;

      }
      catch (Exception ex)
      {
        throw ex;
      }
      // Check whether the user already has a cart
      
    }

    public async Task<CartResponse?> GetCartAsync(int userId)
    {
      var cart = await _context.Carts
          .Include(c => c.CartItems)
          .FirstOrDefaultAsync(c => c.UserId == userId);

      if (cart == null)
        return null;

      var response = new CartResponse
      {
        CartId = cart.CartId,
        UserId = cart.UserId
      };

      decimal grandTotal = 0;

      foreach (var item in cart.CartItems)
      {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.ProductId == item.ProductId);

        if (product == null)
          continue;

        var total = item.UnitPrice * item.Quantity;

        response.Items.Add(new CartItemDto
        {
          CartItemId = item.CartItemId,
          ProductId = item.ProductId,
          ProductName = product.ProductName,
          UnitPrice = item.UnitPrice,
          Quantity = item.Quantity,
          TotalPrice = total,
          ThumbnailImage = product.ThumbnailImage
        });

        grandTotal += total;
      }

      response.GrandTotal = grandTotal;

      return response;
    }

    public async Task<bool> UpdateQuantityAsync(UpdateCartRequest request)
    {
      var cartItem = await _context.CartItems
          .FirstOrDefaultAsync(x => x.CartItemId == request.CartItemId);

      if (cartItem == null)
        return false;

      cartItem.Quantity = request.Quantity;

      await _context.SaveChangesAsync();

      return true;
    }

    public async Task<bool> RemoveItemAsync(int cartItemId)
    {
      var cartItem = await _context.CartItems
          .FirstOrDefaultAsync(x => x.CartItemId == cartItemId);

      if (cartItem == null)
        return false;

      _context.CartItems.Remove(cartItem);

      await _context.SaveChangesAsync();

      return true;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
      var cart = await _context.Carts
          .Include(x => x.CartItems)
          .FirstOrDefaultAsync(x => x.UserId == userId);

      if (cart == null)
        return false;

      _context.CartItems.RemoveRange(cart.CartItems);

      await _context.SaveChangesAsync();

      return true;
    }
  }
}
