using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;
using NexaCart.Infrastructure.Persistence.Contexts;

public class ProductRepository : IProductRepository
{
  private readonly ApplicationDbContext _context;

  public ProductRepository(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<IEnumerable<Product>> GetAllAsync()
  {
    return await _context.Products.ToListAsync();
  }

  public async Task<Product?> GetByIdAsync(int id)
  {
    return await _context.Products.FindAsync(id);
  }

  public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
  {
    return await _context.Products
        .Where(x => x.CategoryId == categoryId)
        .ToListAsync();
  }

  public async Task<int> CreateAsync(Product product)
  {
    try
    {
      _context.Products.Add(product);

      await _context.SaveChangesAsync();

      return product.ProductId;
    }
    catch (Exception ex)
    {
      Console.WriteLine(ex.Message);
      throw;
    }
  }

  public async Task UpdateAsync(Product product)
  {
    _context.Products.Update(product);
    await _context.SaveChangesAsync();
  }

  public async Task DeleteAsync(Product product)
  {
    _context.Products.Remove(product);
    await _context.SaveChangesAsync();
  }
}
