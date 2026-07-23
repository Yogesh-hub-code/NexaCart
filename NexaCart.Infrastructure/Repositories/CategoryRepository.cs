using Microsoft.EntityFrameworkCore;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;
using NexaCart.Infrastructure.Persistence.Contexts;

namespace NexaCart.Infrastructure.Repositories
{
  public class CategoryRepository : ICategoryRepository
  {
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context)
    {
      _context = context;
    }


    public async Task<IEnumerable<Category>> GetAllAsync()
    {
      return await _context.Categories
          .ToListAsync();
    }


    public async Task<Category?> GetByIdAsync(int id)
    {
      return await _context.Categories
          .FirstOrDefaultAsync(x => x.CategoryId == id);
    }


    public async Task<Category> AddAsync(Category category)
    {
      await _context.Categories.AddAsync(category);

      await _context.SaveChangesAsync();

      return category;
    }


    public async Task<Category> UpdateAsync(Category category)
    {
      _context.Categories.Update(category);

      await _context.SaveChangesAsync();

      return category;
    }


    public async Task<bool> DeleteAsync(int id)
    {
      var category = await _context.Categories
          .FirstOrDefaultAsync(x => x.CategoryId == id);

      if (category == null)
      {
        return false;
      }

      _context.Categories.Remove(category);

      await _context.SaveChangesAsync();

      return true;
    }
  }
}
