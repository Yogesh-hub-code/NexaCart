using NexaCart.Domain.Entities;

namespace NexaCart.Application.Interfaces
{
  public interface IProductRepository
  {
    Task<IEnumerable<Product>> GetAllAsync();

    Task<Product?> GetByIdAsync(int id);

    Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);

    Task<int> CreateAsync(Product product);

    Task UpdateAsync(Product product);

    Task DeleteAsync(Product product);
  }
}
