namespace SmartWarehouse.Api.Dtos;

public class CreateWarehouseLocationDto
{
    public string CompanyId { get; set; } = string.Empty;
    public string LocationCode { get; set; } = string.Empty;
    public string ZoneName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}