using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Managers;

public interface IProductManager
{
    Task<Product> CreateAsync(CreateProductDto dto);
    Task UpdateAsync(UpdateProductDto dto);
    Task DeleteAsync(DeleteProductDto dto);
    Task<Product?> GetByIdAsync(int id, string companyId);
    Task<PagedResponseDto<ProductListDto>> GetPagedAsync(PagedRequestDto request);
}