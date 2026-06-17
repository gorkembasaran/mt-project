namespace SmartWarehouse.Api.Entities;

public class WarehouseLocation : BaseEntity
{
    public string LocationCode { get; set; } = string.Empty;

    public string ZoneName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}