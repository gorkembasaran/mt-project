using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Controllers.Shared;
using SmartWarehouse.Api.Dtos.StockMovements;
using SmartWarehouse.Api.Managers.StockMovements;
using SmartWarehouse.Api.Mappings;

namespace SmartWarehouse.Api.Controllers.StockMovements;

[ApiController]
[Route("api/stock-movements")]
[Route("api/stock-movement")]
public class StockMovementController : ApiControllerBase
{
    private readonly IStockMovementManager _manager;

    public StockMovementController(IStockMovementManager manager)
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
            var movements = await _manager.GetByCompanyAsync(companyId);
            var response = movements
                .Select(ResponseMapper.ToStockMovementDto)
                .ToList();

            return OkResponse(response);
        });
    }

    [HttpPost("inbound")]
    public async Task<IActionResult> Inbound([FromBody] CreateStockMovementDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var movement = await _manager.InboundAsync(dto);
            return OkResponse(ResponseMapper.ToStockMovementDto(movement), "Stock inbound completed successfully");
        });
    }

    [HttpPost("entry")]
    public Task<IActionResult> Entry([FromBody] CreateStockMovementDto dto)
    {
        return Inbound(dto);
    }

    [HttpPost("outbound")]
    public async Task<IActionResult> Outbound([FromBody] CreateStockMovementDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var movement = await _manager.OutboundAsync(dto);
            return OkResponse(ResponseMapper.ToStockMovementDto(movement), "Stock outbound completed successfully");
        });
    }

    [HttpPost("exit")]
    public Task<IActionResult> Exit([FromBody] CreateStockMovementDto dto)
    {
        return Outbound(dto);
    }
}
