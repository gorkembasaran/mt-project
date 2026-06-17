using SmartWarehouse.Api.Dtos.Products;
using SmartWarehouse.Api.Dtos.Shared;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Managers.Products;

public interface IProductManager
{
    Task<Product> CreateAsync(CreateProductDto dto);
    Task UpdateAsync(UpdateProductDto dto);
    Task DeleteAsync(DeleteProductDto dto);
    Task<Product?> GetByIdAsync(int id, string companyId);
    Task<PagedResponseDto<ProductListDto>> GetPagedAsync(PagedRequestDto request);
}
