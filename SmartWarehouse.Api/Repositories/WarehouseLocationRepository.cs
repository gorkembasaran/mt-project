using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Api.Data;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories;

public class WarehouseLocationRepository : IWarehouseLocationRepository
{
    private readonly AppDbContext _context;

    public WarehouseLocationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<WarehouseLocation>> GetByCompanyAsync(string companyId)
    {
        return await _context.WarehouseLocations
            .Where(x => x.CompanyId == companyId && !x.IsDeleted)
            .OrderBy(x => x.LocationCode)
            .ToListAsync();
    }

    public async Task<WarehouseLocation?> GetByIdAsync(int id)
    {
        return await _context.WarehouseLocations
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<WarehouseLocation?> GetByIdAsync(int id, string companyId)
    {
        return await _context.WarehouseLocations
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.CompanyId == companyId &&
                !x.IsDeleted);
    }

    public async Task<WarehouseLocation> CreateAsync(WarehouseLocation location)
    {
        _context.WarehouseLocations.Add(location);
        await _context.SaveChangesAsync();

        return location;
    }

    public async Task UpdateAsync(WarehouseLocation location)
    {
        _context.Entry(location).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
}