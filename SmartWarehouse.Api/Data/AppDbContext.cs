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

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.CompanyId).HasMaxLength(64);
            entity.Property(p => p.ProductName).HasMaxLength(200);
            entity.Property(p => p.Sku).HasMaxLength(100);
            entity.Property(p => p.Category).HasMaxLength(100);
            entity.Property(p => p.Unit).HasMaxLength(50);
            entity.Property(p => p.UnitPrice).HasPrecision(18, 2);

            entity.HasIndex(p => new { p.CompanyId, p.IsDeleted, p.CreatedAt });
            entity.HasIndex(p => new { p.CompanyId, p.IsDeleted, p.Category });
            entity.HasIndex(p => new { p.CompanyId, p.WarehouseLocationId, p.IsDeleted });
            entity.HasIndex(p => new { p.CompanyId, p.Sku })
                .IsUnique()
                .HasFilter("[IsDeleted] = 0");
        });

        modelBuilder.Entity<WarehouseLocation>(entity =>
        {
            entity.Property(w => w.CompanyId).HasMaxLength(64);
            entity.Property(w => w.LocationCode).HasMaxLength(50);
            entity.Property(w => w.ZoneName).HasMaxLength(100);
            entity.Property(w => w.Description).HasMaxLength(500);

            entity.HasIndex(w => new { w.CompanyId, w.IsDeleted, w.LocationCode });
        });

        modelBuilder.Entity<StockMovement>(entity =>
        {
            entity.Property(s => s.CompanyId).HasMaxLength(64);
            entity.Property(s => s.MovementType).HasMaxLength(10);
            entity.Property(s => s.Note).HasMaxLength(500);

            entity.HasIndex(s => new { s.CompanyId, s.IsDeleted, s.CreatedAt });
            entity.HasIndex(s => new { s.ProductId, s.CreatedAt });
        });

        modelBuilder.Entity<Product>()
            .HasOne(p => p.WarehouseLocation)
            .WithMany(w => w.Products)
            .HasForeignKey(p => p.WarehouseLocationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StockMovement>()
            .HasOne(s => s.Product)
            .WithMany(p => p.StockMovements)
            .HasForeignKey(s => s.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
