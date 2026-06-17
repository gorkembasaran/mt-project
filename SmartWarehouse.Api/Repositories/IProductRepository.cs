using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id);
    Task<Product?> GetByIdAsync(int id, string companyId);
    Task<PagedResponseDto<ProductListDto>> GetPagedAsync(PagedRequestDto request);
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(Product product);
}