using NexaCart.Application.DTOs.Brands;
using NexaCart.Application.Interfaces;
using NexaCart.Domain.Entities;

namespace NexaCart.Application.Services
{
  public class BrandService : IBrandService
  {
    private readonly IBrandRepository _brandRepository;


    public BrandService(IBrandRepository brandRepository)
    {
      _brandRepository = brandRepository;
    }


    public async Task<IEnumerable<BrandDto>> GetAllAsync()
    {
      var brands = await _brandRepository.GetAllAsync();

      return brands.Select(MapToDto);
    }


    public async Task<BrandDto?> GetByIdAsync(int id)
    {
      var brand = await _brandRepository.GetByIdAsync(id);

      if (brand == null)
        return null;

      return MapToDto(brand);
    }


    public async Task<int> CreateAsync(CreateBrandRequest request)
    {
      var brand = new Brand
      {
        BrandName = request.BrandName,
        Description = request.Description,
        BrandLogo = request.BrandLogo,
        IsActive = request.IsActive,
        CreatedOn = DateTime.Now
      };


      return await _brandRepository.CreateAsync(brand);
    }


    public async Task UpdateAsync(int id, CreateBrandRequest request)
    {
      var brand = await _brandRepository.GetByIdAsync(id);

      if (brand == null)
        throw new Exception("Brand not found");


      brand.BrandName = request.BrandName;
      brand.Description = request.Description;
      brand.BrandLogo = request.BrandLogo;
      brand.IsActive = request.IsActive;
      brand.ModifiedOn = DateTime.Now;


      await _brandRepository.UpdateAsync(brand);
    }


    public async Task DeleteAsync(int id)
    {
      await _brandRepository.DeleteAsync(id);
    }



    private static BrandDto MapToDto(Brand brand)
    {
      return new BrandDto
      {
        BrandId = brand.BrandId,
        BrandName = brand.BrandName,
        Description = brand.Description,
        BrandLogo = brand.BrandLogo,
        IsActive = brand.IsActive
      };
    }
  }
}
