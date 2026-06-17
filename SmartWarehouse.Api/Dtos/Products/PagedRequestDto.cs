namespace SmartWarehouse.Api.Dtos.Products;

public class PagedRequestDto
{
    public string CompanyId { get; set; } = string.Empty;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;
    public string? Search { get; set; }
    public string? Category { get; set; }
}
