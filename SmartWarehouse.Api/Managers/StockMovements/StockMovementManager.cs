using SmartWarehouse.Api.Dtos.StockMovements;
using SmartWarehouse.Api.Entities;
using SmartWarehouse.Api.Repositories.Products;
using SmartWarehouse.Api.Repositories.StockMovements;

namespace SmartWarehouse.Api.Managers.StockMovements;

public class StockMovementManager : IStockMovementManager
{
    private readonly IStockMovementRepository _movementRepository;
    private readonly IProductRepository _productRepository;

    public StockMovementManager(
        IStockMovementRepository movementRepository,
        IProductRepository productRepository)
    {
        _movementRepository = movementRepository;
        _productRepository = productRepository;
    }

    public async Task<StockMovement> InboundAsync(CreateStockMovementDto dto)
    {
        Validate(dto);
        var movementNote = ResolveDescription(dto);

        var product = await _productRepository.GetByIdAsync(dto.ProductId);

        if (product == null)
            throw new KeyNotFoundException("Product not found");

        if (product.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        product.CurrentStock += dto.Quantity;
        product.UpdatedAt = DateTime.UtcNow;

        var movement = new StockMovement
        {
            CompanyId = dto.CompanyId,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            MovementType = "IN",
            Note = movementNote
        };

        var createdMovement = await _movementRepository.CreateWithProductUpdateAsync(product, movement);
        createdMovement.Product = product;

        return createdMovement;
    }

    public async Task<StockMovement> OutboundAsync(CreateStockMovementDto dto)
    {
        Validate(dto);
        var movementNote = ResolveDescription(dto);

        var product = await _productRepository.GetByIdAsync(dto.ProductId);

        if (product == null)
            throw new KeyNotFoundException("Product not found");

        if (product.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        if (product.CurrentStock < dto.Quantity)
            throw new InvalidOperationException("Insufficient stock");

        product.CurrentStock -= dto.Quantity;
        product.UpdatedAt = DateTime.UtcNow;

        var movement = new StockMovement
        {
            CompanyId = dto.CompanyId,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            MovementType = "OUT",
            Note = movementNote
        };

        var createdMovement = await _movementRepository.CreateWithProductUpdateAsync(product, movement);
        createdMovement.Product = product;

        return createdMovement;
    }

    public async Task<List<StockMovement>> GetByCompanyAsync(string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new ArgumentException("CompanyId is required");

        return await _movementRepository.GetByCompanyAsync(companyId);
    }

    private static void Validate(CreateStockMovementDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            throw new ArgumentException("CompanyId is required");

        if (dto.ProductId <= 0)
            throw new ArgumentException("ProductId is required");

        if (dto.Quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero");

        if (string.IsNullOrWhiteSpace(dto.Description) && string.IsNullOrWhiteSpace(dto.Note))
            throw new ArgumentException("Description is required");
    }

    private static string ResolveDescription(CreateStockMovementDto dto)
    {
        return string.IsNullOrWhiteSpace(dto.Description)
            ? dto.Note.Trim()
            : dto.Description.Trim();
    }
}
