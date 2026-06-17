using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories;

public interface IStockMovementRepository
{
    Task<StockMovement> CreateAsync(StockMovement movement);
    Task<List<StockMovement>> GetByCompanyAsync(string companyId);
}