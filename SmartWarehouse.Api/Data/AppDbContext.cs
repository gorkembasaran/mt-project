using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Api.Entities;

namespace SmartWarehouse.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    public DbSet<WarehouseLocation> WarehouseLocations => Set<WarehouseLocation>();

    public DbSet<StockMovement> StockMovements => Set<StockMovement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.WarehouseLocation)
            .WithMany(w => w.Products)
            .HasForeignKey(p => p.WarehouseLocationId);

        modelBuilder.Entity<StockMovement>()
            .HasOne(s => s.Product)
            .WithMany(p => p.StockMovements)
            .HasForeignKey(s => s.ProductId);
    }
}