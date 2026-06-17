using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Managers;

namespace SmartWarehouse.Api.Controllers;

[ApiController]
[Route("api/warehouse-locations")]
public class WarehouseLocationController : ControllerBase
{
    private readonly IWarehouseLocationManager _manager;

    public WarehouseLocationController(IWarehouseLocationManager manager)
    {
        _manager = manager;
    }

    [HttpGet("by-company/{companyId}")]
    public async Task<IActionResult> GetByCompany(string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        var locations = await _manager.GetByCompanyAsync(companyId);

        return Ok(new
        {
            Success = true,
            Data = locations
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, [FromQuery] string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        var location = await _manager.GetByIdAsync(id, companyId);

        if (location == null)
            return NotFound(new { Success = false, Message = "Warehouse location not found" });

        if (location.CompanyId != companyId)
            return Forbid();

        return Ok(new
        {
            Success = true,
            Data = location
        });
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateWarehouseLocationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        var location = await _manager.CreateAsync(dto);

        return Ok(new
        {
            Success = true,
            Message = "Warehouse location created successfully",
            Data = location
        });
    }

    [HttpPost("update")]
    public async Task<IActionResult> Update([FromBody] UpdateWarehouseLocationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        try
        {
            await _manager.UpdateAsync(dto);

            return Ok(new
            {
                Success = true,
                Message = "Warehouse location updated successfully"
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return NotFound(new { Success = false, Message = ex.Message });
        }
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Delete([FromBody] DeleteWarehouseLocationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        try
        {
            await _manager.DeleteAsync(dto);

            return Ok(new
            {
                Success = true,
                Message = "Warehouse location deleted successfully"
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return NotFound(new { Success = false, Message = ex.Message });
        }
    }
}