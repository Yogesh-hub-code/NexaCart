using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Application.DTOs.Category;

namespace NexaCart.Application.Interfaces
{
  public interface ICategoryService
  {
    Task<IEnumerable<CategoryDto>> GetAllAsync();

    Task<CategoryDto?> GetByIdAsync(int id);

    Task<CategoryDto> CreateAsync(CreateCategoryRequest request);

    Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryRequest request);

    Task<bool> DeleteAsync(int id);
  }
}
