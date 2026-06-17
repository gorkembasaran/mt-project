# Smart Warehouse Backend

Akıllı Depo Yönetimi backend API projesi.

## Teknoloji
- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

## Mimari
- `Controller -> Manager -> Repository -> Entity (DbContext)`
- Multi-tenant yapı için tüm entity'lerde `CompanyId`
- Soft delete için tüm entity'lerde `IsDeleted`

## Klasör Yapısı
- `SmartWarehouse.Api/Controllers`
  Feature bazlı controller klasörleri ve ortak `ApiControllerBase`
- `SmartWarehouse.Api/Managers`
  İş kuralları ve validasyonlar
- `SmartWarehouse.Api/Repositories`
  Sadece EF Core veri erişimi
- `SmartWarehouse.Api/Dtos`
  Feature bazlı request/response DTO'ları
- `SmartWarehouse.Api/Data`
  `AppDbContext` ve EF model konfigürasyonu
- `SmartWarehouse.Api/Entities`
  Veritabanı entity'leri
- `SmartWarehouse.Api/Migrations`
  EF Core migration dosyaları

## İş Kuralları
- `PUT` ve `DELETE` kullanılmaz, update/delete işlemleri `POST` endpointleriyle yapılır.
- `CompanyId` eksikse `400 BadRequest` döner.
- Veri başka şirkete aitse `403 Forbidden` döner.
- `Product.CurrentStock` yalnızca inbound/outbound stock movement ile değişir.
- `WarehouseLocation` aktif ürün içeriyorsa soft delete engellenir.

## Önemli Endpointler
- `GET /api/products/paged`
- `GET /api/products/{id}?companyId=...`
- `POST /api/products/create`
- `POST /api/products/update`
- `POST /api/products/delete`
- `GET /api/warehouse-locations/by-company/{companyId}`
- `POST /api/warehouse-locations/create`
- `POST /api/warehouse-locations/update`
- `POST /api/warehouse-locations/delete`
- `GET /api/stock-movements/by-company/{companyId}`
- `POST /api/stock-movements/inbound`
- `POST /api/stock-movements/outbound`

## Geliştirme Notları
- Örnek istekler için `SmartWarehouse.Api/SmartWarehouse.Api.http` kullanılabilir.
- Çalışma raporu için `CALISMA_RAPORU.md` dosyasına bakılabilir.

## Build
```bash
dotnet build SmartWarehouse.Api/SmartWarehouse.Api.csproj
```

## Run
Makinede .NET 9 runtime kuruluysa:

```bash
dotnet run --project SmartWarehouse.Api/SmartWarehouse.Api.csproj
```

Eğer yalnızca .NET 10 runtime varsa:

```bash
DOTNET_ROLL_FORWARD=Major dotnet run --project SmartWarehouse.Api/SmartWarehouse.Api.csproj
```
