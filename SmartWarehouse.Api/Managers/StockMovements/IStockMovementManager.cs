using SmartWarehouse.Api.Dtos.StockMovements;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Managers.StockMovements;

public interface IStockMovementManager
{
    Task<StockMovement> InboundAsync(CreateStockMovementDto dto);
    Task<StockMovement> OutboundAsync(CreateStockMovementDto dto);
    Task<List<StockMovement>> GetByCompanyAsync(string companyId);
}
