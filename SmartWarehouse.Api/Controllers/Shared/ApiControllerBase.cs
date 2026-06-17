using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Dtos.Shared;

namespace SmartWarehouse.Api.Controllers.Shared;

public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult OkResponse<T>(T data, string message = "")
    {
        return Ok(ApiResponseDto<T>.CreateSuccess(data, message));
    }

    protected IActionResult OkMessage(string message)
    {
        return Ok(ApiResponseDto<object?>.CreateSuccess(null, message));
    }

    protected IActionResult BadRequestResponse(string message)
    {
        return BadRequest(ApiResponseDto<object?>.CreateFailure(message));
    }

    protected IActionResult NotFoundResponse(string message)
    {
        return NotFound(ApiResponseDto<object?>.CreateFailure(message));
    }

    protected IActionResult ForbiddenResponse(string message)
    {
        return StatusCode(StatusCodes.Status403Forbidden, ApiResponseDto<object?>.CreateFailure(message));
    }

    protected IActionResult? ValidateCompanyId(string? companyId)
    {
        return string.IsNullOrWhiteSpace(companyId)
            ? BadRequestResponse("CompanyId is required")
            : null;
    }

    protected async Task<IActionResult> ExecuteAsync(Func<Task<IActionResult>> action)
    {
        try
        {
            return await action();
        }
        catch (UnauthorizedAccessException ex)
        {
            return ForbiddenResponse(string.IsNullOrWhiteSpace(ex.Message) ? "CompanyId mismatch" : ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequestResponse(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequestResponse(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFoundResponse(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                ApiResponseDto<object?>.CreateFailure("Unexpected server error"));
        }
    }
}
