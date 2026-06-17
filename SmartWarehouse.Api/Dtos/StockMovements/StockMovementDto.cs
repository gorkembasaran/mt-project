namespace SmartWarehouse.Api.Dtos.StockMovements;

public class StockMovementDto
{
    public int Id { get; set; }

    public string CompanyId { get; set; } = string.Empty;

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public string MovementType { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
