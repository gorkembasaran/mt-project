using SmartWarehouse.Api.Dtos.WarehouseLocations;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Managers.WarehouseLocations;

public interface IWarehouseLocationManager
{
    Task<List<WarehouseLocation>> GetByCompanyAsync(string companyId);
    Task<WarehouseLocation?> GetByIdAsync(int id, string companyId);
    Task<WarehouseLocation> CreateAsync(CreateWarehouseLocationDto dto);
    Task UpdateAsync(UpdateWarehouseLocationDto dto);
    Task DeleteAsync(DeleteWarehouseLocationDto dto);
}
