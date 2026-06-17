using SmartWarehouse.Api.Dtos.Products;
using SmartWarehouse.Api.Dtos.StockMovements;
using SmartWarehouse.Api.Dtos.WarehouseLocations;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Mappings;

public static class ResponseMapper
{
    public static ProductDetailDto ToProductDetailDto(Product product)
    {
        return new ProductDetailDto
        {
            Id = product.Id,
            CompanyId = product.CompanyId,
            ProductName = product.ProductName,
            Sku = product.Sku,
            Category = product.Category,
            Unit = product.Unit,
            UnitPrice = product.UnitPrice,
            CurrentStock = product.CurrentStock,
            MinimumStock = product.MinimumStock,
            WarehouseLocationId = product.WarehouseLocationId,
            WarehouseLocationCode = product.WarehouseLocation?.LocationCode ?? string.Empty,
            WarehouseZoneName = product.WarehouseLocation?.ZoneName ?? string.Empty,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }

    public static WarehouseLocationDto ToWarehouseLocationDto(WarehouseLocation location)
    {
        return new WarehouseLocationDto
        {
            Id = location.Id,
            CompanyId = location.CompanyId,
            LocationCode = location.LocationCode,
            ZoneName = location.ZoneName,
            Description = location.Description,
            CreatedAt = location.CreatedAt,
            UpdatedAt = location.UpdatedAt
        };
    }

    public static StockMovementDto ToStockMovementDto(StockMovement movement)
    {
        return new StockMovementDto
        {
            Id = movement.Id,
            CompanyId = movement.CompanyId,
            ProductId = movement.ProductId,
            ProductName = movement.Product?.ProductName ?? string.Empty,
            Quantity = movement.Quantity,
            MovementType = movement.MovementType,
            Note = movement.Note,
            Description = movement.Note,
            CreatedAt = movement.CreatedAt
        };
    }
}
