using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Managers;

public interface IStockMovementManager
{
    Task<StockMovement> InboundAsync(CreateStockMovementDto dto);
    Task<StockMovement> OutboundAsync(CreateStockMovementDto dto);
    Task<List<StockMovement>> GetByCompanyAsync(string companyId);
}