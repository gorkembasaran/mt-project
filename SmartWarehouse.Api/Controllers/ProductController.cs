using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Api.Managers;

namespace SmartWarehouse.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly IProductManager _productManager;

    public ProductController(IProductManager productManager)
    {
        _productManager = productManager;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, [FromQuery] string companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        var product = await _productManager.GetByIdAsync(id, companyId);

        if (product == null)
            return NotFound(new { Success = false, Message = "Product not found" });

        if (product.CompanyId != companyId)
            return Forbid();

        return Ok(new { Success = true, Data = product });
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] PagedRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        var result = await _productManager.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        var product = await _productManager.CreateAsync(dto);

        return Ok(new
        {
            Success = true,
            Message = "Product created successfully",
            Data = product
        });
    }

    [HttpPost("update")]
    public async Task<IActionResult> Update([FromBody] UpdateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        try
        {
            await _productManager.UpdateAsync(dto);
            return Ok(new { Success = true, Message = "Product updated successfully" });
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
    public async Task<IActionResult> Delete([FromBody] DeleteProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId))
            return BadRequest(new { Success = false, Message = "CompanyId is required" });

        try
        {
            await _productManager.DeleteAsync(dto);
            return Ok(new { Success = true, Message = "Product deleted successfully" });
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