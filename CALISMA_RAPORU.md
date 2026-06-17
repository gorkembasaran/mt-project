# CALISMA_RAPORU

## Kısa Özet

- SmartWare projesinin backend ve frontend tarafı PDF gereksinimlerine göre yeniden kontrol edildi.
- Backend tarafında multi-tenant güvenlik, soft delete, pagination, stock movement iş mantığı, .NET 9 ve EF Core 9 uyumu netleştirildi.
- Frontend tarafında React 18 + TypeScript + MUI v7 ile tek sayfa dashboard geliştirildi; summary kartları, server-side pagination'lı tablo ve modal akışları tamamlandı.
- Kurulum ve çalıştırma adımlarını anlaşılır hale getirmek için kök README, backend README, frontend README ve örnek istek dosyaları güncellendi.

## PDF Uyum Kontrolü

PDF tekrar kontrol edildi. Zorunlu maddeler açısından proje durumu:

- Backend `.NET 9` hedefliyor
- Frontend `React 18 + TypeScript + Material UI`
- Veritabanı `MS SQL Server`
- ORM `Entity Framework Core`
- Mimari `Controller -> Manager -> Repository -> Entity (DbContext)`
- Tüm entity'lerde `CompanyId`
- Tüm entity'lerde `IsDeleted`
- Silme akışı soft delete
- En az bir listeleme endpoint'i server-side pagination, arama ve filtreleme destekli
- Frontend tek sayfa yapıda
- Frontend'de summary kartları, tablo, ekleme/düzenleme modalı ve silme onayı mevcut
- `PUT` ve `DELETE` metodları kullanılmıyor
- `EntityState.Modified` update akışında korunuyor
- `CALISMA_RAPORU.md` mevcut ve güncel

## Kullanılan Teknolojiler ve Versiyonlar

### Backend

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core 9.0.0
- Microsoft.EntityFrameworkCore.SqlServer 9.0.0
- Microsoft.EntityFrameworkCore.Tools 9.0.0
- Scalar.AspNetCore 2.16.3

### Frontend

- React 18.3.1
- React DOM 18.3.1
- TypeScript 6.0.3
- Vite 8.0.16
- Material UI 7.3.11
- MUI Icons 7.3.11
- Axios 1.18.0

### Geliştirme Ortamı

- Docker Desktop
- SQL Server 2022 container
- Vite development server

## Yapılan İşler

### Backend

- Feature bazlı klasörleme ile `Products`, `WarehouseLocations`, `StockMovements` alanları ayrıştırıldı.
- DTO/projection kullanımıyla entity'lerin doğrudan response dönmesi engellendi.
- `CompanyId` zorunluluğu ve tenant izolasyonu controller/manager akışında netleştirildi.
- Soft delete kuralı ürün ve lokasyon silme akışlarında korundu.
- `Product` listeleme endpoint'ine server-side pagination, search, category filter, zone filter ve status filter eklendi.
- `PageSize` için üst sınır `100` olarak sabitlendi.
- `Product` create/update sırasında warehouse location tenant kontrolü eklendi.
- `StockMovement` inbound/outbound işlemlerinde yetersiz stok ve `Quantity <= 0` validasyonları korundu.
- Frontend sözleşmesine uyum için `Unit`, `UnitPrice`, `Description`, `entry/exit` route alias'ları eklendi.
- Migration yapısı temiz başlangıç şeması ve ek alan migration'ı olarak ayrıldı.
- `UseAppHost=false` ile macOS üzerindeki apphost/signing build problemleri önlendi.

### Frontend

- Tek sayfa dashboard yapısı kuruldu.
- App shell, üst header, summary kartları ve tablo ekranı MUI ile bileşenlere ayrıldı.
- Ürün ekleme / güncelleme / silme ve stok giriş / çıkış modalları yazıldı.
- API adapter katmanı ile PascalCase backend response'ları frontend modeline dönüştürüldü.
- `COMP-001` sabit tenant akışı tanımlandı.
- Ürün durum hesaplama, stok renkleri ve filtre seçenekleri frontend tarafında tanımlandı.
- Warehouse location yoksa otomatik oluşturma akışı eklendi.

### Dokümantasyon

- Kök `README.md` proje genel kurulum akışına göre yeniden yazıldı.
- `SmartWarehouse.Api/README.md` eklendi.
- `smartwarehouse-ui/README.md` detaylandırıldı.
- `SmartWarehouse.Api.http` örnek istekleri güncel sözleşmeye göre düzeltildi.

## Karşılaşılan Sorunlar ve Çözüm Yolları

### 1. .NET 9 Runtime / SDK Uyuşmazlığı

Sorun:

- Makinede yalnızca `.NET 10` yüklüydü
- proje `net9.0` hedeflediği için `dotnet run` açılmıyordu

Çözüm:

- kullanıcı dizinine `.NET 9` kuruldu
- `DOTNET_ROOT` ve `PATH` ayarları yapıldı
- gerektiğinde `$HOME/.dotnet/dotnet` ile komut çalıştırıldı

### 2. SQL Server Erişim Hatası

Sorun:

- API `localhost:1433` üzerindeki SQL Server'a bağlanamıyordu

Çözüm:

- Docker üzerinden SQL Server 2022 container kuruldu
- port erişimi `nc -zv localhost 1433` ile doğrulandı

### 3. Eski Veritabanı Şeması ile Yeni Modelin Uyuşmaması

Sorun:

- mevcut DB'de `Unit` ve `UnitPrice` kolonları yoktu
- bazı string kolonlar `nvarchar(max)` olarak kalmıştı
- bu durum `500 Internal Server Error` ve index hatalarına yol açtı

Çözüm:

- migration yapısı yeniden düzenlendi
- string kolon uzunlukları migration ile düzeltildi
- temiz SQL container ve temiz DB üzerinde migration'lar yeniden uygulandı

### 4. macOS AppHost / Signing Sorunları

Sorun:

- .NET 9 build sırasında `NETSDK1177` ve `apphost` imza hataları görüldü

Çözüm:

- `.csproj` içinde `UseAppHost=false` tanımlandı

### 5. Çalışan Process'in Build Dosyalarını Kilitlemesi

Sorun:

- eski backend process'i `deps.json` ve benzeri çıktıları kilitledi

Çözüm:

- çalışan instance kapatıldı
- `bin/obj` temizlenerek yeniden build alındı

## Mimari Kararlar ve Nedenleri

### 1. Katmanlı Yapının Korunması

- PDF'teki temel değerlendirme ölçütü doğrudan bu mimari olduğu için `Controller -> Manager -> Repository -> Entity` yapısı korunmuştur.
- Service, CQRS, MediatR, auth sistemi gibi ekstra soyutlamalar özellikle eklenmemiştir.

### 2. Feature Bazlı Klasörleme

- `Product`, `WarehouseLocation` ve `StockMovement` dosyaları kendi feature klasörlerine ayrıldı.
- Bu sayede katmanlı yapı bozulmadan okunabilirlik arttı.

### 3. Response DTO Kullanımı

- Entity'leri doğrudan döndürmek yerine DTO/projection tercih edildi.
- Gerekçe:
  - serialization güvenliği
  - circular reference riskini azaltma
  - frontend sözleşmesini sabitleme

### 4. Stock Yönetiminin Hareket Bazlı Kurulması

- `CurrentStock` alanı ürün update body ile keyfi değiştirilmek yerine stock movement üzerinden yönetildi.
- Gerekçe:
  - hareket geçmişini korumak
  - iş mantığını tek noktada toplamak
  - giriş/çıkış tutarlılığı sağlamak

### 5. Frontend'de API Adapter Katmanı

- Backend PascalCase response döndüğü için frontend içinde ayrı mapping katmanı yazıldı.
- Gerekçe:
  - UI katmanını backend response yapısından izole etmek
  - TypeScript tiplerini sade tutmak

### 6. Temiz Kurulum Dokümantasyonu

- Proje lokal ortamda yalnızca kod değil, kurulum adımlarıyla birlikte değerlendirileceği için readme dosyaları detaylandırıldı.

## Yapay Zeka Kullanımı

Yapay zeka desteği şu aşamalarda kullanıldı:

- PDF gereksinimlerinin tekrar okunması ve madde madde eşleştirilmesi
- backend review ve requirement gap analizi
- controller / manager / repository refactor desteği
- frontend component ayrıştırma ve ekran yapısı planlama
- README ve çalışma raporu içeriklerinin düzenlenmesi
- SQL Server, .NET 9 ve migration sorunlarının teşhis edilmesi

Yapay zeka çıktıları doğrudan kör uygulanmamış; yerel proje dosyaları, build çıktıları, endpoint cevapları ve veritabanı davranışı üzerinden ayrıca doğrulanmıştır.

## Son Durum

- Backend build alıyor
- SQL Server container ile çalışıyor
- migration'lar temiz DB üzerinde uygulandı
- backend ana endpoint'leri `200 OK` dönüyor
- frontend backend ile aynı sözleşme üzerinden çalışıyor
- kurulum ve çalıştırma adımları README dosyalarında güncel durumda
