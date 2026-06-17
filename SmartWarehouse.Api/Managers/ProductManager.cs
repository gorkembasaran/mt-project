using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Entities;
using SmartWarehouse.Api.Repositories;

namespace SmartWarehouse.Api.Managers;

public class ProductManager : IProductManager
{
    private readonly IProductRepository _productRepository;

    public ProductManager(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Product> CreateAsync(CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            throw new Exception("CompanyId is required");

        var product = new Product
        {
            CompanyId = dto.CompanyId,
            ProductName = dto.ProductName,
            Sku = dto.Sku,
            Category = dto.Category,
            CurrentStock = dto.CurrentStock,
            MinimumStock = dto.MinimumStock,
            WarehouseLocationId = dto.WarehouseLocationId
        };

        return await _productRepository.CreateAsync(product);
    }

    public async Task UpdateAsync(UpdateProductDto dto)
    {
        var existing = await _productRepository.GetByIdAsync(dto.Id);

        if (existing == null)
            throw new Exception("Product not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException();

        existing.ProductName = dto.ProductName;
        existing.Sku = dto.Sku;
        existing.Category = dto.Category;
        existing.CurrentStock = dto.CurrentStock;
        existing.MinimumStock = dto.MinimumStock;
        existing.WarehouseLocationId = dto.WarehouseLocationId;
        existing.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(DeleteProductDto dto)
    {
        var existing = await _productRepository.GetByIdAsync(dto.Id);

        if (existing == null)
            throw new Exception("Product not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException();

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(existing);
    }

    public async Task<Product?> GetByIdAsync(int id, string companyId)
    {
        return await _productRepository.GetByIdAsync(id, companyId);
    }

    public async Task<PagedResponseDto<ProductListDto>> GetPagedAsync(PagedRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.CompanyId))
            throw new Exception("CompanyId is required");

        return await _productRepository.GetPagedAsync(request);
    }
}