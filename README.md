# SmartWare

Akıllı Depo Yönetimi modülü için geliştirilen tam yığın proje.

Bu repo iki ana parçadan oluşur:

- `SmartWarehouse.Api` : .NET 9 + ASP.NET Core Web API backend
- `smartwarehouse-ui` : React 18 + TypeScript + MUI v7 frontend

Proje, PDF gereksinimindeki katmanlı mimariye ve kurallara göre hazırlanmıştır:

- Backend mimarisi: `Controller -> Manager -> Repository -> Entity (DbContext)`
- Veritabanı: MS SQL Server
- ORM: Entity Framework Core
- Frontend: Single Page Application
- Multi-tenant güvenlik: `CompanyId`
- Soft delete: `IsDeleted`

## Repo Yapısı

```text
mt-project
├── SmartWarehouse.Api
├── smartwarehouse-ui
├── CALISMA_RAPORU.md
└── README.md
```

## Gereksinimler

- .NET 9 SDK
- Node.js 20+
- npm
- Docker Desktop

## Hızlı Başlangıç

### 1. .NET 9 Kur

Makinede `dotnet --version` çıktısı `9.x` değilse iki seçenek var.

Homebrew ile:

```bash
brew install --cask dotnet-sdk@9
```

Yetki istemeyen kullanıcı-dizini kurulumu:

```bash
curl -fsSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
chmod +x /tmp/dotnet-install.sh
/tmp/dotnet-install.sh --channel 9.0 --install-dir "$HOME/.dotnet"
```

Kalıcı PATH ayarı:

```bash
echo 'export DOTNET_ROOT="$HOME/.dotnet"' >> ~/.zshrc
echo 'export PATH="$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH"' >> ~/.zshrc
echo 'export DOTNET_ROOT="$HOME/.dotnet"' >> ~/.zprofile
echo 'export PATH="$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH"' >> ~/.zprofile
source ~/.zshrc
```

Kontrol:

```bash
which dotnet
dotnet --version
dotnet --list-runtimes
```

Beklenen örnek:

- `which dotnet` -> `/Users/<kullanici>/.dotnet/dotnet`
- `dotnet --version` -> `9.0.x`

### 2. SQL Server Container'ını Başlat

Docker Desktop açık olmalı.

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

Konteyneri durdur / başlat:

```bash
docker stop smartwarehouse-sql
docker start smartwarehouse-sql
```

Tam temiz reset:

```bash
docker rm -f smartwarehouse-sql
```

### 3. Backend'i Çalıştır

```bash
cd /Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api
dotnet ef database update
dotnet run
```

Eğer shell hâlâ eski `dotnet` binary'sini kullanıyorsa:

```bash
$HOME/.dotnet/dotnet ef database update
$HOME/.dotnet/dotnet run
```

Backend varsayılan adresi:

- `http://localhost:5057`

### 4. Frontend'i Çalıştır

Yeni terminalde:

```bash
cd /Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui
npm install
npm run dev
```

Frontend varsayılan adresi:

- `http://localhost:5173`

Vite proxy varsayılan olarak `/api` çağrılarını `http://localhost:5057` adresine yönlendirir.

## İlk Açılışta Beklenen Durum

- Temiz veritabanında ürün, lokasyon ve stok hareketi listeleri boş gelir
- Frontend boş state gösterir
- İlk ürün oluşturulana kadar dashboard kartları `0` değerleriyle açılır

## Detay Dokümanlar

- Backend kurulumu ve endpoint detayları: [SmartWarehouse.Api/README.md](/Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api/README.md)
- Frontend kurulumu ve ekran yapısı: [smartwarehouse-ui/README.md](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/README.md)
- Çalışma raporu: [CALISMA_RAPORU.md](/Users/gorkembasaran/Documents/GitHub/mt-project/CALISMA_RAPORU.md)

## Sık Karşılaşılan Sorunlar

### `You must install or update .NET`

Sebep:

- Proje `net9.0`
- Makinede sadece `.NET 10` runtime olabilir

Çözüm:

- `.NET 9 SDK` kur
- Gerekirse `dotnet` yerine `$HOME/.dotnet/dotnet` kullan

### Frontend'de `/api/... 500 Internal Server Error`

Genellikle şu sebeplerden biri olur:

- SQL Server container kapalıdır
- Migration uygulanmamıştır
- Backend ayağa kalkmamıştır

Kontrol:

```bash
docker ps
nc -zv localhost 1433
curl -i http://localhost:5057/api/warehouse-locations/by-company/COMP-001
```

### Frontend'de `http proxy error` veya `ECONNREFUSED`

Sebep:

- Backend `5057` portunda çalışmıyordur

Kontrol:

```bash
lsof -iTCP:5057 -sTCP:LISTEN -n -P
```

## Notlar

- Varsayılan test şirketi `COMP-001`
- Frontend backend'e PascalCase request body gönderir
- Backend response'ları PascalCase döner
- `PUT` ve `DELETE` bilinçli olarak kullanılmaz; update/delete işlemleri `POST` ile yapılır
