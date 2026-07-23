using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Entities;

namespace NexaCart.Application.Interfaces
{
  public interface ICategoryRepository
  {
    Task<IEnumerable<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(int id);

    Task<Category> AddAsync(Category category);

    Task<Category> UpdateAsync(Category category);

    Task<bool> DeleteAsync(int id);
  }
}
