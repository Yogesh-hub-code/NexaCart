using Microsoft.AspNetCore.Mvc;
using NexaCart.Application.DTOs.Products;
using NexaCart.Application.Interfaces;

namespace NexaCart.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ProductController : ControllerBase
  {
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
      _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      return Ok(await _productService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      return Ok(await _productService.GetByIdAsync(id));
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(int categoryId)
    {
      return Ok(await _productService.GetByCategoryAsync(categoryId));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {
      var id = await _productService.CreateAsync(request);

      return Ok(id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateProductRequest request)
    {
      await _productService.UpdateAsync(id, request);

      return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      await _productService.DeleteAsync(id);

      return NoContent();
    }
  }
}
