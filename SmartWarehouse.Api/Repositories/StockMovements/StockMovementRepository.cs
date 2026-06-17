using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Api.Data;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories.StockMovements;

public class StockMovementRepository : IStockMovementRepository
{
    private readonly AppDbContext _context;

    public StockMovementRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<StockMovement> CreateWithProductUpdateAsync(Product product, StockMovement movement)
    {
        _context.Entry(product).State = EntityState.Modified;
        _context.StockMovements.Add(movement);
        await _context.SaveChangesAsync();

        return movement;
    }

    public async Task<List<StockMovement>> GetByCompanyAsync(string companyId)
    {
        return await _context.StockMovements
            .AsNoTracking()
            .Include(x => x.Product)
            .Where(x => x.CompanyId == companyId && !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}
