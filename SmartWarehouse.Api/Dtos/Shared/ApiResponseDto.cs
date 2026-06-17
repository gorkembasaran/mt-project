namespace SmartWarehouse.Api.Dtos.Shared;

public class ApiResponseDto<T>
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public T? Data { get; set; }

    public static ApiResponseDto<T> CreateSuccess(T? data, string message = "")
    {
        return new ApiResponseDto<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponseDto<T> CreateFailure(string message)
    {
        return new ApiResponseDto<T>
        {
            Success = false,
            Message = message
        };
    }
}
