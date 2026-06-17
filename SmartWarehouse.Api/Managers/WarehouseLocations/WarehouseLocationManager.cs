using SmartWarehouse.Api.Dtos.WarehouseLocations;
using SmartWarehouse.Api.Entities;
using SmartWarehouse.Api.Repositories.Products;
using SmartWarehouse.Api.Repositories.WarehouseLocations;

namespace SmartWarehouse.Api.Managers.WarehouseLocations;

public class WarehouseLocationManager : IWarehouseLocationManager
{
    private readonly IWarehouseLocationRepository _repository;
    private readonly IProductRepository _productRepository;

    public WarehouseLocationManager(
        IWarehouseLocationRepository repository,
        IProductRepository productRepository)
    {
        _repository = repository;
        _productRepository = productRepository;
    }

    public async Task<List<WarehouseLocation>> GetByCompanyAsync(string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new ArgumentException("CompanyId is required");

        return await _repository.GetByCompanyAsync(companyId);
    }

    public async Task<WarehouseLocation?> GetByIdAsync(int id, string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new ArgumentException("CompanyId is required");

        var location = await _repository.GetByIdAsync(id);

        if (location == null)
            return null;

        if (location.CompanyId != companyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        return location;
    }

    public async Task<WarehouseLocation> CreateAsync(CreateWarehouseLocationDto dto)
    {
        Validate(dto.CompanyId, dto.LocationCode, dto.ZoneName);

        var location = new WarehouseLocation
        {
            CompanyId = dto.CompanyId,
            LocationCode = dto.LocationCode,
            ZoneName = dto.ZoneName,
            Description = dto.Description
        };

        return await _repository.CreateAsync(location);
    }

    public async Task UpdateAsync(UpdateWarehouseLocationDto dto)
    {
        Validate(dto.CompanyId, dto.LocationCode, dto.ZoneName);

        var existing = await _repository.GetByIdAsync(dto.Id);

        if (existing == null)
            throw new KeyNotFoundException("Warehouse location not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        existing.LocationCode = dto.LocationCode;
        existing.ZoneName = dto.ZoneName;
        existing.Description = dto.Description;
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(DeleteWarehouseLocationDto dto)
    {
        var existing = await _repository.GetByIdAsync(dto.Id);

        if (existing == null)
            throw new KeyNotFoundException("Warehouse location not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException("CompanyId mismatch");

        var hasActiveProducts = await _productRepository.HasActiveProductsInLocationAsync(existing.Id, dto.CompanyId);

        if (hasActiveProducts)
            throw new InvalidOperationException("Warehouse location cannot be deleted while active products exist");

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);
    }

    private static void Validate(string companyId, string locationCode, string zoneName)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new ArgumentException("CompanyId is required");

        if (string.IsNullOrWhiteSpace(locationCode))
            throw new ArgumentException("LocationCode is required");

        if (string.IsNullOrWhiteSpace(zoneName))
            throw new ArgumentException("ZoneName is required");
    }
}
