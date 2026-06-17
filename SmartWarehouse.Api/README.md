# SmartWarehouse.Api

SmartWare projesinin backend API uygulaması.

## Amaç

Backend tarafı şu ana iş akışlarını yönetir:

- ürün tanımlama
- ürün güncelleme
- ürün soft delete
- depo lokasyonu oluşturma / güncelleme / soft delete
- stok giriş
- stok çıkış
- ürün listeleme, arama, filtreleme ve server-side pagination

## Teknoloji Yığını

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core 9.0.0
- Microsoft SQL Server
- Scalar.AspNetCore 2.16.3

## Mimari

Katmanlı yapı korunmuştur:

```text
Controller -> Manager -> Repository -> Entity (DbContext)
```

Katman sorumlulukları:

- `Controller`
  HTTP endpoint tanımları, response üretimi, `CompanyId` validation başlangıcı
- `Manager`
  iş kuralları, multi-tenant güvenlik, stok validasyonu, soft delete kuralları
- `Repository`
  yalnızca EF Core veri erişimi
- `Entity / DbContext`
  tablo modelleri, ilişkiler, indeksler, EF konfigürasyonu

## Klasör Yapısı

```text
SmartWarehouse.Api
├── Controllers
│   ├── Products
│   ├── StockMovements
│   ├── WarehouseLocations
│   └── Shared
├── Managers
│   ├── Products
│   ├── StockMovements
│   └── WarehouseLocations
├── Repositories
│   ├── Products
│   ├── StockMovements
│   └── WarehouseLocations
├── Dtos
│   ├── Products
│   ├── StockMovements
│   ├── WarehouseLocations
│   └── Shared
├── Data
├── Entities
├── Mappings
├── Migrations
└── Properties
```

## Entity'ler

### Product

- `Id`
- `CompanyId`
- `ProductName`
- `Sku`
- `Category`
- `Unit`
- `UnitPrice`
- `CurrentStock`
- `MinimumStock`
- `WarehouseLocationId`
- `IsDeleted`
- `CreatedAt`
- `UpdatedAt`

### WarehouseLocation

- `Id`
- `CompanyId`
- `LocationCode`
- `ZoneName`
- `Description`
- `IsDeleted`
- `CreatedAt`
- `UpdatedAt`

### StockMovement

- `Id`
- `CompanyId`
- `ProductId`
- `MovementType`
- `Quantity`
- `Note`
- `IsDeleted`
- `CreatedAt`
- `UpdatedAt`

## Zorunlu İş Kuralları

- `PUT` ve `DELETE` HTTP metodları kullanılmaz
- tüm entity'lerde `CompanyId` vardır
- tüm entity'lerde `IsDeleted` vardır
- `CompanyId` eksikse `400 BadRequest`
- `CompanyId` uyuşmazsa `403 Forbidden`
- silme işlemleri fiziksel değil soft delete'tir
- tüm veritabanı işlemleri EF Core ile yapılır
- update işlemlerinde `EntityState.Modified` korunur
- ürün listeleme server-side pagination destekler
- `PageSize` üst sınırı `100`
- stok çıkışta yetersiz stok kontrolü yapılır
- `Quantity <= 0` engellenir
- `Product` create/update sırasında `WarehouseLocation` şirket eşleşmesi doğrulanır
- aktif ürünü olan lokasyon soft delete ile silinemez

## Ön Koşullar

- .NET 9 SDK
- Docker Desktop
- çalışan SQL Server instance'ı

## .NET 9 Kurulumu

Homebrew:

```bash
brew install --cask dotnet-sdk@9
```

Kullanıcı dizini kurulumu:

```bash
curl -fsSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
chmod +x /tmp/dotnet-install.sh
/tmp/dotnet-install.sh --channel 9.0 --install-dir "$HOME/.dotnet"
```

PATH:

```bash
export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH"
```

Kontrol:

```bash
which dotnet
dotnet --version
```

## SQL Server Kurulumu

Repo içindeki varsayılan connection string:

```text
Server=localhost,1433;Database=SmartWarehouseDb;User Id=sa;Password=StrongPass123!;TrustServerCertificate=True;
```

Docker ile önerilen kurulum:

```bash
docker run --name smartwarehouse-sql \
  --platform linux/amd64 \
  -e ACCEPT_EULA=Y \
  -e MSSQL_SA_PASSWORD='StrongPass123!' \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Port kontrolü:

```bash
nc -zv localhost 1433
```

## Konfigürasyon

Connection string dosyası:

- [appsettings.json](/Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api/appsettings.json)

Geliştirme portları:

- HTTP: `http://localhost:5057`
- HTTPS profile: `https://localhost:7229`

Launch settings:

- [Properties/launchSettings.json](/Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api/Properties/launchSettings.json)

## Veritabanı Hazırlığı

Migration'ları uygula:

```bash
cd /Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api
dotnet ef database update
```

Eğer terminal eski `dotnet` binary'sini kullanıyorsa:

```bash
$HOME/.dotnet/dotnet ef database update
```

Temiz DB reset:

```bash
docker rm -f smartwarehouse-sql
```

Ardından container'ı yeniden oluşturup migration'ı tekrar uygula.

## Uygulamayı Çalıştırma

```bash
cd /Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api
dotnet run
```

Alternatif:

```bash
$HOME/.dotnet/dotnet run
```

## Build

```bash
dotnet build SmartWarehouse.Api.csproj
```

## Örnek Endpoint'ler

### Products

- `GET /api/products/paged`
- `GET /api/products/{id}?companyId=COMP-001`
- `POST /api/products/create`
- `POST /api/products/update`
- `POST /api/products/delete`

Uyumluluk için alias route da var:

- `/api/product/...`

### Warehouse Locations

- `GET /api/warehouse-locations/by-company/{companyId}`
- `GET /api/warehouse-locations/{id}?companyId=COMP-001`
- `POST /api/warehouse-locations/create`
- `POST /api/warehouse-locations/update`
- `POST /api/warehouse-locations/delete`

### Stock Movements

- `GET /api/stock-movements/by-company/{companyId}`
- `POST /api/stock-movements/inbound`
- `POST /api/stock-movements/outbound`

Frontend uyumluluğu için alias route'lar da var:

- `POST /api/stock-movements/entry`
- `POST /api/stock-movements/exit`
- `/api/stock-movement/...`

## Örnek Request Body'leri

### Warehouse Location Create

```json
{
  "CompanyId": "COMP-001",
  "LocationCode": "A5-2",
  "ZoneName": "A",
  "Description": "A bölgesi / A5-2 rafı"
}
```

### Product Create

```json
{
  "CompanyId": "COMP-001",
  "ProductName": "Laptop Bilgisayar",
  "Sku": "PRD-0001",
  "Category": "Elektronik",
  "Unit": "Adet",
  "UnitPrice": 3764.42,
  "MinimumStock": 48,
  "WarehouseLocationId": 1
}
```

### Product Update

```json
{
  "Id": 1,
  "CompanyId": "COMP-001",
  "ProductName": "Laptop Bilgisayar Pro",
  "Sku": "PRD-0001",
  "Category": "Elektronik",
  "Unit": "Adet",
  "UnitPrice": 4120.00,
  "MinimumStock": 55,
  "WarehouseLocationId": 1
}
```

### Product Delete

```json
{
  "Id": 1,
  "CompanyId": "COMP-001"
}
```

### Stock Entry

```json
{
  "CompanyId": "COMP-001",
  "ProductId": 1,
  "Quantity": 50,
  "Description": "Tedarikçi teslimatı"
}
```

### Stock Exit

```json
{
  "CompanyId": "COMP-001",
  "ProductId": 1,
  "Quantity": 20,
  "Description": "Müşteri siparişi"
}
```

## HTTP Test Dosyası

Repo içinde örnek istek dosyası vardır:

- [SmartWarehouse.Api.http](/Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api/SmartWarehouse.Api.http)

## Geliştirme Notları

- response'lar PascalCase döner
- frontend request body'leri PascalCase gönderir
- ürün stok değeri frontend'de `currentStock * unitPrice` ile hesaplanır
- `CurrentStock` doğrudan product update ile değil, stock movement ile değişir

## Sorun Giderme

### `You must install or update .NET`

Sebep:

- `net9.0` proje çalıştırılıyor ama aktif runtime `10.x`

Çözüm:

```bash
export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH"
hash -r
which dotnet
dotnet --version
```

### `localhost:1433 connection refused`

Sebep:

- SQL Server container ayakta değil

Çözüm:

```bash
docker start smartwarehouse-sql
nc -zv localhost 1433
```

### `500 Internal Server Error`

Önce bunları kontrol et:

```bash
docker ps
dotnet ef database update
curl -i http://localhost:5057/api/products/paged?companyId=COMP-001&page=1&pageSize=25
```
