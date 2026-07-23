using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Application.DTOs.Products;
using NexaCart.Domain.Entities;

namespace NexaCart.Application.Interfaces
{
  public interface IProductService
  {
    Task<IEnumerable<ProductDto>> GetAllAsync();

    Task<ProductDto?> GetByIdAsync(int id);

    Task<IEnumerable<ProductDto>> GetByCategoryAsync(int categoryId);

    Task<int> CreateAsync(CreateProductRequest request);

    Task UpdateAsync(int id, CreateProductRequest request);


    Task DeleteAsync(int id);

  }
}
