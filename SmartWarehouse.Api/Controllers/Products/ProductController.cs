using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Controllers.Shared;
using SmartWarehouse.Api.Dtos.Products;
using SmartWarehouse.Api.Managers.Products;
using SmartWarehouse.Api.Mappings;

namespace SmartWarehouse.Api.Controllers.Products;

[ApiController]
[Route("api/products")]
public class ProductController : ApiControllerBase
{
    private readonly IProductManager _productManager;

    public ProductController(IProductManager productManager)
    {
        _productManager = productManager;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, [FromQuery] string companyId)
    {
        var validationResult = ValidateCompanyId(companyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var product = await _productManager.GetByIdAsync(id, companyId);

            if (product == null)
                return NotFoundResponse("Product not found");

            return OkResponse(ResponseMapper.ToProductDetailDto(product));
        });
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] PagedRequestDto request)
    {
        var validationResult = ValidateCompanyId(request.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var result = await _productManager.GetPagedAsync(request);
            return OkResponse(result);
        });
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            var product = await _productManager.CreateAsync(dto);
            return OkResponse(ResponseMapper.ToProductDetailDto(product), "Product created successfully");
        });
    }

    [HttpPost("update")]
    public async Task<IActionResult> Update([FromBody] UpdateProductDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            await _productManager.UpdateAsync(dto);
            return OkMessage("Product updated successfully");
        });
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Delete([FromBody] DeleteProductDto dto)
    {
        var validationResult = ValidateCompanyId(dto.CompanyId);
        if (validationResult is not null)
            return validationResult;

        return await ExecuteAsync(async () =>
        {
            await _productManager.DeleteAsync(dto);
            return OkMessage("Product deleted successfully");
        });
    }
}
