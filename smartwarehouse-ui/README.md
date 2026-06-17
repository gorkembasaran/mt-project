# SmartWare UI

SmartWare projesinin React tabanlı tek sayfa frontend arayüzü.

## Teknoloji Yığını

- React 18.3.1
- React DOM 18.3.1
- TypeScript 6.0.3
- Vite 8.0.16
- Material UI 7.3.11
- MUI Icons 7.3.11
- Axios 1.18.0

## Amaç

Frontend tek bir dashboard ekranı üzerinden şu akışları sunar:

- özet bilgi kartları
- ürün listeleme
- server-side pagination
- arama ve filtreleme
- ürün ekleme
- ürün düzenleme
- stok giriş
- stok çıkış
- soft delete onayı

## Ön Koşullar

- Node.js 20+
- npm
- çalışan backend API

Backend varsayılan adresi:

- `http://localhost:5057`

## Kurulum

```bash
cd /Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui
npm install
```

## Çalıştırma

```bash
npm run dev
```

Varsayılan Vite adresi:

- `http://localhost:5173`

## Build ve Lint

```bash
npm run build
npm run lint
```

## Backend Bağlantısı

Varsayılan geliştirme akışı Vite proxy üzerinden çalışır.

Dosya:

- [vite.config.ts](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/vite.config.ts)

Varsayılan proxy:

- `/api` -> `http://localhost:5057`

İstersen doğrudan environment variable ile API adresi verebilirsin:

```bash
VITE_API_BASE_URL=http://localhost:5057/api
```

Alternatif proxy hedefi:

```bash
VITE_PROXY_TARGET=http://localhost:5057
```

## Frontend Varsayımları

- aktif test şirketi sabit: `COMP-001`
- backend response'ları PascalCase gelir
- frontend kendi modelinde camelCase kullanır
- request body'ler backend beklentisine göre PascalCase gönderilir

Şirket sabiti:

- [src/constants/options.ts](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/src/constants/options.ts)

## Ekran Özellikleri

### Summary Cards

Dashboard üst kısmında 6 kart vardır:

- Toplam Ürün
- Toplam Giriş
- Toplam Çıkış
- Kritik Stok
- Tükenen Ürün
- Stok Değeri

### Product Table

Tablo özellikleri:

- varsayılan `pageSize = 25`
- seçenekler: `10 / 25 / 50 / 100`
- server-side pagination
- search
- kategori filtresi
- bölge filtresi
- stok durumu filtresi

### Modallar

- ürün ekleme / düzenleme
- stok giriş
- stok çıkış
- silme onayı

## Durum Hesaplama

Frontend ürün durumunu backend'den beklemeden kendi gösterim mantığı ile hesaplar:

- `currentStock = 0` -> `Tükendi`
- `currentStock <= minStock` -> `Kritik`
- `currentStock > minStock` -> `Yeterli`

## Önemli Davranışlar

- ürün oluşturma / güncelleme sırasında uygun raf bilgisi yoksa frontend önce warehouse location oluşturmaya çalışır
- stok değeri kartı `currentStock * unitPrice` üzerinden hesaplanır
- stock entry / exit işlemleri ayrı request olarak backend'e gönderilir
- çıkış butonu `currentStock = 0` ise pasifleşir

## Klasör Yapısı

```text
src
├── api
│   └── warehouseApi.ts
├── components
│   ├── app
│   ├── common
│   ├── dashboard
│   └── products
├── constants
├── hooks
├── pages
├── theme
├── types
└── utils
```

## Önemli Dosyalar

- [src/pages/DashboardPage.tsx](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/src/pages/DashboardPage.tsx)
  sayfa orkestrasyonu
- [src/hooks/useWarehouseDashboard.ts](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/src/hooks/useWarehouseDashboard.ts)
  veri yükleme, filtre, action yönetimi
- [src/api/warehouseApi.ts](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/src/api/warehouseApi.ts)
  API entegrasyonu ve backend/frontend model dönüşümü
- [src/components/dashboard/SummaryCards.tsx](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/src/components/dashboard/SummaryCards.tsx)
  özet kartları
- [src/components/products/ProductTable.tsx](/Users/gorkembasaran/Documents/GitHub/mt-project/smartwarehouse-ui/src/components/products/ProductTable.tsx)
  ürün tablosu

## API Beklentileri

Frontend aşağıdaki endpoint'leri kullanır:

- `GET /api/products/paged`
- `POST /api/products/create`
- `POST /api/products/update`
- `POST /api/products/delete`
- `GET /api/warehouse-locations/by-company/{companyId}`
- `POST /api/warehouse-locations/create`
- `GET /api/stock-movements/by-company/{companyId}`
- `POST /api/stock-movements/entry`
- `POST /api/stock-movements/exit`

Beklenen pagination response örneği:

```json
{
  "Success": true,
  "Message": "",
  "Data": {
    "Items": [],
    "TotalCount": 0,
    "Page": 1,
    "PageSize": 25,
    "TotalPages": 0
  }
}
```

## İlk Veri Oluşturma

Temiz DB ile frontend açıldığında tüm listeler boş gelir. İlk test için:

1. warehouse location oluştur
2. ürün oluştur
3. stok entry yap

Bu akış sonrasında kartlar ve tablo dolmaya başlar.

## Sorun Giderme

### `/api/... 500 Internal Server Error`

Önce backend loguna bak:

```bash
cd /Users/gorkembasaran/Documents/GitHub/mt-project/SmartWarehouse.Api
dotnet run
```

Sonra DB bağlantısını doğrula:

```bash
docker ps
nc -zv localhost 1433
```

### `http proxy error` veya `ECONNREFUSED`

Sebep:

- backend `5057` portunda çalışmıyordur

Kontrol:

```bash
lsof -iTCP:5057 -sTCP:LISTEN -n -P
```

### Sayfa boş ama hata yok

Sebep:

- veritabanı temizdir
- henüz ürün yoktur

Bu beklenen davranıştır.
