using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NexaCart.Domain.Entities;

namespace NexaCart.Application.Interfaces
{
  public interface IBrandRepository
  {
    Task<IEnumerable<Brand>> GetAllAsync();

    Task<Brand?> GetByIdAsync(int id);

    Task<int> CreateAsync(Brand brand);

    Task UpdateAsync(Brand brand);

    Task DeleteAsync(int id);
  }
}
