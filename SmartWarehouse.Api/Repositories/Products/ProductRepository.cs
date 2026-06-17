using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Api.Data;
using SmartWarehouse.Api.Dtos.Products;
using SmartWarehouse.Api.Dtos.Shared;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories.Products;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(x => x.WarehouseLocation)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<PagedResponseDto<ProductListDto>> GetPagedAsync(PagedRequestDto request)
    {
        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0
            ? 25
            : Math.Min(request.PageSize, 100);

        var query = _context.Products
            .AsNoTracking()
            .Where(x => x.CompanyId == request.CompanyId && !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();

            query = query.Where(x =>
                x.ProductName.ToLower().Contains(search) ||
                x.Sku.ToLower().Contains(search) ||
                x.Category.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var category = request.Category.Trim().ToLower();
            query = query.Where(x => x.Category.ToLower() == category);
        }

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ProductListDto
            {
                Id = x.Id,
                CompanyId = x.CompanyId,
                ProductName = x.ProductName,
                Sku = x.Sku,
                Category = x.Category,
                CurrentStock = x.CurrentStock,
                MinimumStock = x.MinimumStock,
                WarehouseLocationId = x.WarehouseLocationId,
                LocationCode = x.WarehouseLocation != null ? x.WarehouseLocation.LocationCode : ""
            })
            .ToListAsync();

        return new PagedResponseDto<ProductListDto>
        {
            Items = data,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<Product> CreateAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return product;
    }

    public async Task<bool> HasActiveProductsInLocationAsync(int warehouseLocationId, string companyId)
    {
        return await _context.Products.AnyAsync(x =>
            x.WarehouseLocationId == warehouseLocationId &&
            x.CompanyId == companyId &&
            !x.IsDeleted);
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Entry(product).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
}
