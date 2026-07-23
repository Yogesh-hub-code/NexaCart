using NexaCart.Application.DTOs.Category;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;

namespace NexaCart.Application.Services
{
  public class CategoryService : ICategoryService
  {
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
      _categoryRepository = categoryRepository;
    }


    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
      var categories = await _categoryRepository.GetAllAsync();

      return categories.Select(x => new CategoryDto
      {
        CategoryId = x.CategoryId,
        Name = x.Name,
        Description = x.Description,
        IsActive = x.IsActive
      });
    }


    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
      var category = await _categoryRepository.GetByIdAsync(id);

      if (category == null)
        return null;

      return new CategoryDto
      {
        CategoryId = category.CategoryId,
        Name = category.Name,
        Description = category.Description,
        IsActive = category.IsActive
      };
    }


    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
    {
      var category = new Category
      {
        Name = request.Name,
        Description = request.Description,
        IsActive = true,
        CreatedOn = DateTime.UtcNow
      };

      var result = await _categoryRepository.AddAsync(category);

      return new CategoryDto
      {
        CategoryId = result.CategoryId,
        Name = result.Name,
        Description = result.Description,
        IsActive = result.IsActive
      };
    }


    public async Task<CategoryDto?> UpdateAsync(
        int id,
        UpdateCategoryRequest request)
    {
      var category = await _categoryRepository.GetByIdAsync(id);

      if (category == null)
        return null;


      category.Name = request.Name;
      category.Description = request.Description;
      category.IsActive = request.IsActive;


      var result = await _categoryRepository.UpdateAsync(category);


      return new CategoryDto
      {
        CategoryId = result.CategoryId,
        Name = result.Name,
        Description = result.Description,
        IsActive = result.IsActive
      };
    }


    public async Task<bool> DeleteAsync(int id)
    {
      return await _categoryRepository.DeleteAsync(id);
    }
  }
}
