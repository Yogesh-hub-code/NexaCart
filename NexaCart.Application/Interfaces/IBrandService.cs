using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Application.DTOs.Brands;

namespace NexaCart.Application.Interfaces
{
  public interface IBrandService
  {
    Task<IEnumerable<BrandDto>> GetAllAsync();

    Task<BrandDto?> GetByIdAsync(int id);

    Task<int> CreateAsync(CreateBrandRequest request);

    Task UpdateAsync(int id, CreateBrandRequest request);

    Task DeleteAsync(int id);
  }
}
