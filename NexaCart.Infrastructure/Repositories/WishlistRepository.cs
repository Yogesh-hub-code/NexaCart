using Microsoft.EntityFrameworkCore;
using NexaCart.Application.DTOs.Wishlist;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;
using NexaCart.Infrastructure.Persistence.Contexts;

namespace NexaCart.Infrastructure.Repositories
{
  public class WishlistRepository : IWishlistRepository
  {
    private readonly ApplicationDbContext _context;

    public WishlistRepository(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<bool> AddToWishlistAsync(AddToWishlistRequest request)
    {
      // Check if already exists
      var exists = await _context.Wishlists
          .AnyAsync(x =>
              x.UserId == request.UserId &&
              x.ProductId == request.ProductId);

      if (exists)
        return true;

      var wishlist = new Wishlist
      {
        UserId = request.UserId,
        ProductId = request.ProductId,
        CreatedOn = DateTime.UtcNow
      };

      _context.Wishlists.Add(wishlist);

      await _context.SaveChangesAsync();

      return true;
    }

    public async Task<List<WishlistResponse>> GetWishlistAsync(int userId)
    {
      return await _context.Wishlists
          .Where(x => x.UserId == userId)
          .Join(_context.Products,
              w => w.ProductId,
              p => p.ProductId,
              (w, p) => new WishlistResponse
              {
                WishlistId = w.WishlistId,
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                ThumbnailImage = p.ThumbnailImage
              })
          .ToListAsync();
    }

    public async Task<bool> RemoveFromWishlistAsync(int wishlistId)
    {
      var wishlist = await _context.Wishlists
          .FirstOrDefaultAsync(x => x.WishlistId == wishlistId);

      if (wishlist == null)
        return false;

      _context.Wishlists.Remove(wishlist);

      await _context.SaveChangesAsync();

      return true;
    }
  }
}
