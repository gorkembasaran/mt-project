using SmartWarehouse.Api.Dtos.Products;
using SmartWarehouse.Api.Dtos.Shared;
using SmartWarehouse.Api.Entities;
using SmartWarehouse.Api.Repositories.Products;
using SmartWarehouse.Api.Repositories.WarehouseLocations;

namespace SmartWarehouse.Api.Managers.Products;

public class ProductManager : IProductManager
{
    private readonly IProductRepository _productRepository;
    private readonly IWarehouseLocationRepository _warehouseLocationRepository;

    public ProductManager(
        IProductRepository productRepository,
        IWarehouseLocationRepository warehouseLocationRepository)
    {
        _productRepository = productRepository;
        _warehouseLocationRepository = warehouseLocationRepository;
    }

    public async Task<Product> CreateAsync(CreateProductDto dto)
    {
        Validate(dto.CompanyId, dto.ProductName, dto.Sku, dto.WarehouseLocationId, dto.MinimumStock);

        var warehouseLocation = await GetValidatedWarehouseLocationAsync(dto.WarehouseLocationId, dto.CompanyId);

        var product = new Product
        {
            CompanyId = dto.CompanyId,
            ProductName = dto.ProductName,
            Sku = dto.Sku,
            Category = dto.Category,
            CurrentStock = 0,
            MinimumStock = dto.MinimumStock,
            WarehouseLocationId = dto.WarehouseLocationId
        };

        var createdProduct = await _productRepository.CreateAsync(product);
        createdProduct.WarehouseLocation = warehouseLocation;

        return createdProduct;
    }

    public async Task UpdateAsync(UpdateProductDto dto)
    {
        Validate(dto.CompanyId, dto.ProductName, dto.Sku, dto.WarehouseLocationId, dto.MinimumStock);

        var existing = await _productRepository.GetByIdAsync(dto.Id);

        if (existing == null)
            throw new KeyNotFoundException("Product not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        await GetValidatedWarehouseLocationAsync(dto.WarehouseLocationId, dto.CompanyId);

        existing.ProductName = dto.ProductName;
        existing.Sku = dto.Sku;
        existing.Category = dto.Category;
        existing.MinimumStock = dto.MinimumStock;
        existing.WarehouseLocationId = dto.WarehouseLocationId;
        existing.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(DeleteProductDto dto)
    {
        var existing = await _productRepository.GetByIdAsync(dto.Id);

        if (existing == null)
            throw new KeyNotFoundException("Product not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(existing);
    }

    public async Task<Product?> GetByIdAsync(int id, string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new ArgumentException("CompanyId is required");

        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return null;

        if (product.CompanyId != companyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        return product;
    }

    public async Task<PagedResponseDto<ProductListDto>> GetPagedAsync(PagedRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.CompanyId))
            throw new ArgumentException("CompanyId is required");

        return await _productRepository.GetPagedAsync(request);
    }

    private static void Validate(
        string companyId,
        string productName,
        string sku,
        int warehouseLocationId,
        int minimumStock)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new ArgumentException("CompanyId is required");

        if (string.IsNullOrWhiteSpace(productName))
            throw new ArgumentException("ProductName is required");

        if (string.IsNullOrWhiteSpace(sku))
            throw new ArgumentException("Sku is required");

        if (warehouseLocationId <= 0)
            throw new ArgumentException("WarehouseLocationId is required");

        if (minimumStock < 0)
            throw new ArgumentException("MinimumStock cannot be negative");
    }

    private async Task<WarehouseLocation> GetValidatedWarehouseLocationAsync(int warehouseLocationId, string companyId)
    {
        var warehouseLocation = await _warehouseLocationRepository.GetByIdAsync(warehouseLocationId);

        if (warehouseLocation == null)
            throw new KeyNotFoundException("Warehouse location not found");

        if (warehouseLocation.CompanyId != companyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        return warehouseLocation;
    }
}
