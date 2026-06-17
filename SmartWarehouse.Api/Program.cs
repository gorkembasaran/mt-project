using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SmartWarehouse.Api.Data;
using SmartWarehouse.Api.Managers.Products;
using SmartWarehouse.Api.Managers.StockMovements;
using SmartWarehouse.Api.Managers.WarehouseLocations;
using SmartWarehouse.Api.Repositories.Products;
using SmartWarehouse.Api.Repositories.StockMovements;
using SmartWarehouse.Api.Repositories.WarehouseLocations;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.DictionaryKeyPolicy = null;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IWarehouseLocationRepository, WarehouseLocationRepository>();

builder.Services.AddScoped<IProductManager, ProductManager>();
builder.Services.AddScoped<IWarehouseLocationManager, WarehouseLocationManager>();

builder.Services.AddScoped<IStockMovementRepository, StockMovementRepository>();
builder.Services.AddScoped<IStockMovementManager, StockMovementManager>();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
