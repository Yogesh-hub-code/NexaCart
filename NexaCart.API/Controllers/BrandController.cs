using Microsoft.AspNetCore.Mvc;
using NexaCart.Application.DTOs.Brands;
using NexaCart.Application.Interfaces;

namespace NexaCart.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BrandController : ControllerBase
  {
    private readonly IBrandService _brandService;

    public BrandController(IBrandService brandService)
    {
      _brandService = brandService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var brands = await _brandService.GetAllAsync();
      return Ok(brands);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var brand = await _brandService.GetByIdAsync(id);

      if (brand == null)
        return NotFound();

      return Ok(brand);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBrandRequest request)
    {
      var id = await _brandService.CreateAsync(request);

      return Ok(id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateBrandRequest request)
    {
      await _brandService.UpdateAsync(id, request);

      return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      await _brandService.DeleteAsync(id);

      return NoContent();
    }
  }
}
