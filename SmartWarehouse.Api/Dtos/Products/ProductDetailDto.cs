namespace SmartWarehouse.Api.Dtos.Products;

public class ProductDetailDto
{
    public int Id { get; set; }

    public string CompanyId { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public string Sku { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int CurrentStock { get; set; }

    public int MinimumStock { get; set; }

    public int WarehouseLocationId { get; set; }

    public string WarehouseLocationCode { get; set; } = string.Empty;

    public string WarehouseZoneName { get; set; } = string.Empty;

    public bool IsLowStock => CurrentStock <= MinimumStock;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
