namespace SmartWarehouse.Api.Entities;

public class StockMovement : BaseEntity
{
    public int ProductId { get; set; }

    public Product? Product { get; set; }

    public int Quantity { get; set; }

    public string MovementType { get; set; } = string.Empty; // IN / OUT

    public string Note { get; set; } = string.Empty;
}