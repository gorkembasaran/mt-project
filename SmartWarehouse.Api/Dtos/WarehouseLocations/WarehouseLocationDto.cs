namespace SmartWarehouse.Api.Dtos.WarehouseLocations;

public class WarehouseLocationDto
{
    public int Id { get; set; }

    public string CompanyId { get; set; } = string.Empty;

    public string LocationCode { get; set; } = string.Empty;

    public string ZoneName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
