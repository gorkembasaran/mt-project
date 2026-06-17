using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Entities;
using SmartWarehouse.Api.Repositories;

namespace SmartWarehouse.Api.Managers;

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

        var product = await _productRepository.GetByIdAsync(dto.ProductId);

        if (product == null)
            throw new Exception("Product not found");

        if (product.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException();

        product.CurrentStock += dto.Quantity;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);

        var movement = new StockMovement
        {
            CompanyId = dto.CompanyId,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            MovementType = "IN",
            Note = dto.Note
        };

        return await _movementRepository.CreateAsync(movement);
    }

    public async Task<StockMovement> OutboundAsync(CreateStockMovementDto dto)
    {
        Validate(dto);

        var product = await _productRepository.GetByIdAsync(dto.ProductId);

        if (product == null)
            throw new Exception("Product not found");

        if (product.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException();

        if (product.CurrentStock < dto.Quantity)
            throw new InvalidOperationException("Insufficient stock");

        product.CurrentStock -= dto.Quantity;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);

        var movement = new StockMovement
        {
            CompanyId = dto.CompanyId,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            MovementType = "OUT",
            Note = dto.Note
        };

        return await _movementRepository.CreateAsync(movement);
    }

    public async Task<List<StockMovement>> GetByCompanyAsync(string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new Exception("CompanyId is required");

        return await _movementRepository.GetByCompanyAsync(companyId);
    }

    private static void Validate(CreateStockMovementDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            throw new Exception("CompanyId is required");

        if (dto.ProductId <= 0)
            throw new Exception("ProductId is required");

        if (dto.Quantity <= 0)
            throw new Exception("Quantity must be greater than zero");
    }
}