using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Repositories.StockMovements;

public interface IStockMovementRepository
{
    Task<StockMovement> CreateWithProductUpdateAsync(Product product, StockMovement movement);
    Task<List<StockMovement>> GetByCompanyAsync(string companyId);
}
