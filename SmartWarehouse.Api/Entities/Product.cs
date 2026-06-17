namespace SmartWarehouse.Api.Entities;

public class Product : BaseEntity
{
    public string ProductName { get; set; } = string.Empty;

    public string Sku { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Unit { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }

    public int CurrentStock { get; set; }

    public int MinimumStock { get; set; }

    public int WarehouseLocationId { get; set; }

    public WarehouseLocation? WarehouseLocation { get; set; }

    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}
