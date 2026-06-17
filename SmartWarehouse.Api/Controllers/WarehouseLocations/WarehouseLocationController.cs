using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Controllers.Shared;
using SmartWarehouse.Api.Dtos.WarehouseLocations;
using SmartWarehouse.Api.Managers.WarehouseLocations;
using SmartWarehouse.Api.Mappings;

namespace SmartWarehouse.Api.Controllers.WarehouseLocations;

[ApiController]
[Route("api/warehouse-locations")]
public class WarehouseLocationController : ApiControllerBase
{
    private readonly IWarehouseLocationManager _manager;

    public WarehouseLocationController(IWarehouseLocationManager manager)
    {
        _manager = manager;
    }

    [HttpGet("by-company/{companyId}")]
    public async Task<IActionResult> GetByCompany(string companyId)
    {
        var validationResult = ValidateCompanyId(companyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var locations = await _manager.GetByCompanyAsync(companyId);
            var response = locations
                .Select(ResponseMapper.ToWarehouseLocationDto)
                .ToList();

            return OkResponse(response);
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, [FromQuery] string companyId)
    {
        var validationResult = ValidateCompanyId(companyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var location = await _manager.GetByIdAsync(id, companyId);

            if (location == null)
                return NotFoundResponse("Warehouse location not found");

            return OkResponse(ResponseMapper.ToWarehouseLocationDto(location));
        });
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateWarehouseLocationDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var location = await _manager.CreateAsync(dto);
            return OkResponse(ResponseMapper.ToWarehouseLocationDto(location), "Warehouse location created successfully");
        });
    }

    [HttpPost("update")]
    public async Task<IActionResult> Update([FromBody] UpdateWarehouseLocationDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            await _manager.UpdateAsync(dto);
            return OkMessage("Warehouse location updated successfully");
        });
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Delete([FromBody] DeleteWarehouseLocationDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            await _manager.DeleteAsync(dto);
            return OkMessage("Warehouse location deleted successfully");
        });
    }
}
