using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories.WarehouseLocations;

public interface IWarehouseLocationRepository
{
    Task<List<WarehouseLocation>> GetByCompanyAsync(string companyId);
    Task<WarehouseLocation?> GetByIdAsync(int id);
    Task<WarehouseLocation> CreateAsync(WarehouseLocation location);
    Task UpdateAsync(WarehouseLocation location);
}
