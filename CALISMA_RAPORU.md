# CALISMA_RAPORU

## Kısa Özet
- Akıllı Depo Yönetimi backend API'si PDF gereksinimlerine göre gözden geçirildi ve backend tarafında dar kapsamlı iyileştirmeler yapıldı.
- Multi-tenant `CompanyId` güvenliği, soft delete akışı, DTO/projection ile güvenli response üretimi, stock movement validasyonları ve ürün listeleme pagination/search/filter davranışı sıkılaştırıldı.
- Controller → Manager → Repository mimarisi korunarak sadece gerekli backend düzenlemeleri yapıldı.

## Kullanılan Teknolojiler ve Versiyonları
- .NET 9.0 hedef framework
- ASP.NET Core Web API
- Entity Framework Core 9.0.0
- Microsoft SQL Server
- Scalar.AspNetCore 2.16.3

## Yapılan Backend İyileştirmeleri
- Controller, Manager, Repository ve DTO dosyaları feature bazlı alt klasörlere ayrıldı; katmanlı mimari korunurken okunabilirlik artırıldı.
- Tüm response'larda entity yerine DTO/projection kullanıldı.
- `CompanyId` eksikse `400 BadRequest`, entity başka şirkete aitse `403 Forbidden` akışları netleştirildi.
- `Product` ve `WarehouseLocation` detay endpoint'leri artık şirket uyuşmazlığını `404` yerine `403` olarak ayırabiliyor.
- `Product` create/update sırasında bağlı `WarehouseLocation` kaydının varlığı ve aynı `CompanyId` altında olması doğrulanıyor.
- `Product.CurrentStock` alanı artık create/update request body ile değiştirilmiyor; stok seviyesi yalnızca inbound/outbound hareketleriyle yönetiliyor.
- `WarehouseLocation` silme işlemine, içinde aktif ürün varsa işlemi reddeden güvenli validasyon eklendi.
- `StockMovement` inbound/outbound işlemlerinde `Quantity <= 0` engellendi, yetersiz stok kontrolü korundu.
- `StockMovement` kaydı ile `Product.CurrentStock` güncellemesi tek persist akışında tutuldu.
- `Product` listeleme endpoint'inde server-side pagination için `Page` ve `PageSize` normalize edildi, `PageSize` üst limiti `100` yapıldı.
- Search ve category filter tarafında case-insensitive EF Core uyumlu sorgu korundu.
- JSON response isimlendirmesi PascalCase olacak şekilde ayarlandı.
- Minimal ve dağınık olmayan exception handling için controller taban sınıfı eklendi.
- EF Core modelinde string alan uzunlukları, performans indeksleri ve soft delete yaklaşımıyla uyumlu `Restrict` delete behavior tanımlandı.
- Proje hedef framework ve NuGet paketleri PDF ile uyumlu olacak şekilde `.NET 9` / `EF Core 9` seviyesine çekildi.

## Karşılaşılan Sorunlar ve Çözüm Yolları
- Mevcut proje `.NET 10` hedefliyordu. PDF uyumu için `.NET 9` seviyesine çekildi.
- Çalışma ortamında yalnızca `.NET 10` runtime kurulu olduğu için standart `dotnet run` akışı doğrudan uygun değildi.
- `DOTNET_ROLL_FORWARD=Major` ve gerekince `--no-launch-profile` kullanılarak uygulamanın ayağa kalktığı doğrulandı.
- `dotnet build SmartWarehouse.Api/SmartWarehouse.Api.csproj` komutu başarıyla çalıştı ve kaynak kodun derlenebilirliği doğrulandı.

## Mimari Kararlar ve Nedenleri
- Controller → Manager → Repository ayrımı korunarak business rule'lar manager katmanında tutuldu.
- Repository katmanına sadece veri erişimi ile ilgili yardımcı sorgular eklendi.
- Feature bazlı alt klasörleme ile `Product`, `WarehouseLocation` ve `StockMovement` alanları ayrıştırıldı; ancak değerlendirme kriterine uygun şekilde katmanlı yapı dağıtılmadı.
- Global middleware veya büyük çaplı altyapı değişiklikleri yerine, minimal bir base controller ile response ve exception akışı sadeleştirildi.
- Soft delete mantığı korunarak fiziksel silme yapılmadı; geçmiş stock movement verisi bozulmadan bırakıldı.
- Ürün stok doğruluğunu korumak için manuel stok güncelleme yerine hareket bazlı yönetim tercih edildi.

## Yapay Zeka Kullanımı
- Kod inceleme, gereksinim eşleştirme, refactor planı çıkarma ve kontrollü kod değişiklikleri için yapay zeka desteği kullanıldı.
- Yapılan tüm değişiklikler yerel kod tabanı ve PDF gereksinimleri üzerinden kontrol edilerek uygulandı.
