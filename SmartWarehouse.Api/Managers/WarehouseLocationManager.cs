using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Entities;
using SmartWarehouse.Api.Repositories;

namespace SmartWarehouse.Api.Managers;

public class WarehouseLocationManager : IWarehouseLocationManager
{
    private readonly IWarehouseLocationRepository _repository;

    public WarehouseLocationManager(IWarehouseLocationRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<WarehouseLocation>> GetByCompanyAsync(string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new Exception("CompanyId is required");

        return await _repository.GetByCompanyAsync(companyId);
    }

    public async Task<WarehouseLocation?> GetByIdAsync(int id, string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new Exception("CompanyId is required");

        return await _repository.GetByIdAsync(id, companyId);
    }

    public async Task<WarehouseLocation> CreateAsync(CreateWarehouseLocationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            throw new Exception("CompanyId is required");

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
        var existing = await _repository.GetByIdAsync(dto.Id);

        if (existing == null)
            throw new Exception("Warehouse location not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException();

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
            throw new Exception("Warehouse location not found");

        if (existing.CompanyId != dto.CompanyId)
            throw new UnauthorizedAccessException();

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);
    }
}