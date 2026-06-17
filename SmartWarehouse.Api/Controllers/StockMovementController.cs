using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Managers;

namespace SmartWarehouse.Api.Controllers;

[ApiController]
[Route("api/stock-movements")]
public class StockMovementController : ControllerBase
{
    private readonly IStockMovementManager _manager;

    public StockMovementController(IStockMovementManager manager)
    {
        _manager = manager;
    }

    [HttpGet("by-company/{companyId}")]
    public async Task<IActionResult> GetByCompany(string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        var movements = await _manager.GetByCompanyAsync(companyId);

        return Ok(new
        {
            Success = true,
            Data = movements.Select(x => new
            {
                x.Id,
                x.CompanyId,
                x.ProductId,
                ProductName = x.Product != null ? x.Product.ProductName : "",
                x.Quantity,
                x.MovementType,
                x.Note,
                x.CreatedAt
            })
        });
    }

    [HttpPost("inbound")]
    public async Task<IActionResult> Inbound([FromBody] CreateStockMovementDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        try
        {
            var movement = await _manager.InboundAsync(dto);

            return Ok(new
            {
                Success = true,
                Message = "Stock inbound completed successfully",
                Data = new
                {
                    movement.Id,
                    movement.CompanyId,
                    movement.ProductId,
                    movement.Quantity,
                    movement.MovementType,
                    movement.Note,
                    movement.CreatedAt
                }
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { Success = false, Message = ex.Message });
        }
    }

    [HttpPost("outbound")]
    public async Task<IActionResult> Outbound([FromBody] CreateStockMovementDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        try
        {
            var movement = await _manager.OutboundAsync(dto);

            return Ok(new
            {
                Success = true,
                Message = "Stock outbound completed successfully",
                Data = new
                {
                    movement.Id,
                    movement.CompanyId,
                    movement.ProductId,
                    movement.Quantity,
                    movement.MovementType,
                    movement.Note,
                    movement.CreatedAt
                }
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Success = false, Message = ex.Message });
        }
    }
}