using Microsoft.AspNetCore.Mvc;
using NexaCart.Application.DTOs.Category;
using NexaCart.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace NexaCart.API.Controllers
{
  [Authorize(Roles = "Admin")]
  [Route("api/[controller]")]
  [ApiController]
  public class CategoryController : ControllerBase
  {
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
      _categoryService = categoryService;
    }


    // GET: api/category
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var result = await _categoryService.GetAllAsync();

      return Ok(result);
    }


    // GET: api/category/1
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _categoryService.GetByIdAsync(id);

      if (result == null)
        return NotFound();

      return Ok(result);
    }


    // POST: api/category
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateCategoryRequest request)
    {
      var result = await _categoryService.CreateAsync(request);

      return Ok(result);
    }


    // PUT: api/category/1
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateCategoryRequest request)
    {
      var result = await _categoryService.UpdateAsync(id, request);

      if (result == null)
        return NotFound();

      return Ok(result);
    }


    // DELETE: api/category/1
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _categoryService.DeleteAsync(id);

      if (!result)
        return NotFound();

      return Ok(new
      {
        message = "Category deleted successfully"
      });
    }
  }
}
