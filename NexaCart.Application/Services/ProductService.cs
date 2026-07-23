  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Text;
  using System.Threading.Tasks;
  using NexaCart.Application.DTOs.Products;
  using NexaCart.Application.Interfaces;
  using NexaCart.Domain.Entities;

  namespace NexaCart.Application.Services
  {
    public class ProductService : IProductService
    {

      private readonly IProductRepository _productRepository;

      public ProductService(IProductRepository productRepository)
      {
        _productRepository = productRepository;
      }

      public async Task<IEnumerable<ProductDto>> GetByCategoryAsync(int categoryId)
      {
        var products = await _productRepository.GetByCategoryAsync(categoryId);

        return products.Select(p => new ProductDto
        {
          ProductId = p.ProductId,
          Name = p.ProductName,
          Description = p.ProductDescription,
          Price = p.Price,
          DiscountPrice = p.DiscountPrice,
          StockQuantity = p.StockQuantity,
          SKU = p.SKU,
          ImageUrl = p.ThumbnailImage,
          CategoryId = p.CategoryId,
          BrandId = p.BrandId,
          IsActive = p.IsActive
        });
      }

    public async Task<int> CreateAsync(CreateProductRequest request)
    {
      var product = new Product
      {
        ProductName = request.Name,
        ProductDescription = request.ProductDescription,
        Price = request.Price,
        DiscountPrice = request.DiscountPrice,
        StockQuantity = request.StockQuantity,
        SKU = request.SKU,
        ThumbnailImage = request.ThumbnailImage,
        CategoryId = request.CategoryId,
        BrandId = request.BrandId,
        IsActive = request.IsActive
      };

      return await _productRepository.CreateAsync(product);
    }

    public async Task UpdateAsync(int id, CreateProductRequest request)
    {
      var product = await _productRepository.GetByIdAsync(id);

      if (product == null)
        throw new Exception("Product not found");


      product.ProductName = request.Name;
      product.ProductDescription = request.ProductDescription;
      product.Price = request.Price;
      product.DiscountPrice = request.DiscountPrice;
      product.StockQuantity = request.StockQuantity;
      product.SKU = request.SKU;
      product.ThumbnailImage = request.ThumbnailImage;
      product.CategoryId = request.CategoryId;
      product.BrandId = request.BrandId;
      product.IsActive = request.IsActive;


      await _productRepository.UpdateAsync(product);
    }

    public async Task DeleteAsync(int id)
    {
      var product = await _productRepository.GetByIdAsync(id);

      if (product == null)
        throw new Exception("Product not found.");

      await _productRepository.DeleteAsync(product);
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
      var products = await _productRepository.GetAllAsync();

      return products.Select(p => new ProductDto
      {
        ProductId = p.ProductId,
        Name = p.ProductName,
        Description = p.ProductDescription,
        Price = p.Price,
        DiscountPrice = p.DiscountPrice,
        StockQuantity = p.StockQuantity,
        SKU = p.SKU,
        ImageUrl = p.ThumbnailImage,
        CategoryId = p.CategoryId,
        BrandId = p.BrandId,
        IsActive = p.IsActive
      });
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
      var product = await _productRepository.GetByIdAsync(id);

      if (product == null)
        return null;

      return new ProductDto
      {
        ProductId = product.ProductId,
        Name = product.ProductName,
        Description = product.ProductDescription,
        Price = product.Price,
        DiscountPrice = product.DiscountPrice,
        StockQuantity = product.StockQuantity,
        SKU = product.SKU,
        ImageUrl = product.ThumbnailImage,
        CategoryId = product.CategoryId,
        BrandId = product.BrandId,
        IsActive = product.IsActive
      };
    }
  }
  }
