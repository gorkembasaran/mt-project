using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories;

public interface IWarehouseLocationRepository
{
    Task<List<WarehouseLocation>> GetByCompanyAsync(string companyId);
    Task<WarehouseLocation?> GetByIdAsync(int id);
    Task<WarehouseLocation?> GetByIdAsync(int id, string companyId);
    Task<WarehouseLocation> CreateAsync(WarehouseLocation location);
    Task UpdateAsync(WarehouseLocation location);
}