namespace SmartWarehouse.Api.Dtos.Products;

public class CreateProductDto
{
    public string CompanyId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int MinimumStock { get; set; }
    public int WarehouseLocationId { get; set; }
}
