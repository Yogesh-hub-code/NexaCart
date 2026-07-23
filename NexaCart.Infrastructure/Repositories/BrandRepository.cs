using Microsoft.EntityFrameworkCore;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;
using NexaCart.Infrastructure.Persistence.Contexts;

namespace NexaCart.Infrastructure.Repositories
{
  public class BrandRepository : IBrandRepository
  {
    private readonly ApplicationDbContext _context;

    public BrandRepository(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<Brand>> GetAllAsync()
    {
      try
      {
        return await _context.Brands.ToListAsync();
      }
      catch
      {
        throw;
      }
    }

    public async Task<Brand?> GetByIdAsync(int id)
    {
      return await _context.Brands
          .FirstOrDefaultAsync(b => b.BrandId == id);
    }

    public async Task<int> CreateAsync(Brand brand)
    {
      _context.Brands.Add(brand);

      await _context.SaveChangesAsync();

      return brand.BrandId;
    }

    public async Task UpdateAsync(Brand brand)
    {
      _context.Brands.Update(brand);

      await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
      var brand = await _context.Brands
          .FirstOrDefaultAsync(b => b.BrandId == id);

      if (brand != null)
      {
        _context.Brands.Remove(brand);

        await _context.SaveChangesAsync();
      }
    }
  }
}
