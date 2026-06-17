using SmartWarehouse.Api.Dtos.Products;
using SmartWarehouse.Api.Dtos.Shared;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories.Products;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id);
    Task<bool> HasActiveProductsInLocationAsync(int warehouseLocationId, string companyId);
    Task<bool> SkuExistsAsync(string companyId, string sku, int? excludedProductId = null);
    Task<PagedResponseDto<ProductListDto>> GetPagedAsync(PagedRequestDto request);
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(Product product);
}
