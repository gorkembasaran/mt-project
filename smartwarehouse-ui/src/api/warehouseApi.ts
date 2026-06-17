import axios from 'axios'
import type { AxiosError } from 'axios'
import { COMPANY_ID, DEFAULT_PAGE_SIZE } from '../constants/options'
import type {
  ApiEnvelope,
  BackendPagedResult,
  PagedResult,
} from '../types/api'
import { ApiError } from '../types/api'
import type {
  Product,
  ProductFilters,
  ProductFormValues,
} from '../types/product'
import type { StockMovement, WarehouseLocation } from '../types/warehouse'
import { getProductStatus, normalizeText } from '../utils/product'

interface BackendProductPayload {
  Id: number
  CompanyId: string
  ProductName: string
  Sku: string
  Category: string
  Unit: string
  UnitPrice: number
  CurrentStock: number
  MinimumStock: number
  WarehouseLocationId: number
  LocationCode?: string
  WarehouseZoneName?: string
  WarehouseLocationCode?: string
  CreatedAt?: string
  UpdatedAt?: string | null
}

interface BackendWarehouseLocationPayload {
  Id: number
  CompanyId: string
  LocationCode: string
  ZoneName: string
  Description: string
}

interface BackendStockMovementPayload {
  Id: number
  CompanyId: string
  ProductId: number
  ProductName: string
  Quantity: number
  MovementType: 'IN' | 'OUT'
  Note?: string
  Description?: string
  CreatedAt: string
}

type StockMovementMode = 'entry' | 'exit'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

function unwrapResponse<T>(payload: ApiEnvelope<T>): T {
  if (!payload.Success) {
    throw new ApiError(payload.Message || 'Beklenmeyen API hatası oluştu.')
  }

  return payload.Data
}

function getErrorMessage(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiEnvelope<unknown>>
    const message =
      typeof axiosError.response?.data?.Message === 'string'
        ? axiosError.response.data.Message
        : axiosError.message

    throw new ApiError(message, axiosError.response?.status)
  }

  if (error instanceof Error) {
    throw new ApiError(error.message)
  }

  throw new ApiError('Beklenmeyen bir hata oluştu.')
}

function mapProduct(payload: BackendProductPayload): Product {
  const warehouseZone = (payload.WarehouseZoneName ?? 'A') as Product['warehouseZone']
  const shelfNo = payload.WarehouseLocationCode ?? payload.LocationCode ?? ''
  const category = payload.Category as Product['category']
  const unit = payload.Unit as Product['unit']
  const status = getProductStatus(payload.CurrentStock, payload.MinimumStock)

  return {
    id: payload.Id,
    companyId: payload.CompanyId,
    productCode: payload.Sku,
    productName: payload.ProductName,
    category,
    unit,
    currentStock: payload.CurrentStock,
    minStock: payload.MinimumStock,
    unitPrice: Number(payload.UnitPrice),
    warehouseZone,
    shelfNo,
    status,
    locationId: payload.WarehouseLocationId,
    createdAt: payload.CreatedAt,
    updatedAt: payload.UpdatedAt,
  }
}

function mapWarehouseLocation(
  payload: BackendWarehouseLocationPayload,
): WarehouseLocation {
  return {
    id: payload.Id,
    companyId: payload.CompanyId,
    zone: payload.ZoneName,
    shelfNo: payload.LocationCode,
    description: payload.Description,
  }
}

function mapStockMovement(
  payload: BackendStockMovementPayload,
): StockMovement {
  return {
    id: payload.Id,
    companyId: payload.CompanyId,
    productId: payload.ProductId,
    productName: payload.ProductName,
    quantity: payload.Quantity,
    movementType: payload.MovementType,
    description: payload.Description ?? payload.Note ?? '',
    createdAt: payload.CreatedAt,
  }
}

async function ensureWarehouseLocation(
  zone: Product['warehouseZone'],
  shelfNo: string,
  knownLocations?: WarehouseLocation[],
): Promise<WarehouseLocation> {
  const locations = knownLocations ?? (await getWarehouseLocations())

  const existingLocation = locations.find(
    (location) =>
      normalizeText(location.zone) === normalizeText(zone) &&
      normalizeText(location.shelfNo) === normalizeText(shelfNo),
  )

  if (existingLocation) {
    return existingLocation
  }

  try {
    const response = await client.post<ApiEnvelope<BackendWarehouseLocationPayload>>(
      '/warehouse-locations/create',
      {
        CompanyId: COMPANY_ID,
        LocationCode: shelfNo.trim(),
        ZoneName: zone,
        Description: `${zone} bölgesi / ${shelfNo.trim()} rafı`,
      },
    )

    return mapWarehouseLocation(unwrapResponse(response.data))
  } catch (error) {
    return getErrorMessage(error)
  }
}

async function createMovementInternal(
  mode: StockMovementMode,
  productId: number,
  quantity: number,
  description: string,
): Promise<void> {
  const endpoint = mode === 'entry' ? '/stock-movements/entry' : '/stock-movements/exit'

  try {
    await client.post(endpoint, {
      CompanyId: COMPANY_ID,
      ProductId: productId,
      Quantity: quantity,
      Description: description.trim(),
    })
  } catch (error) {
    getErrorMessage(error)
  }
}

export async function getProductsPage(
  filters: ProductFilters,
): Promise<PagedResult<Product>> {
  try {
    const response = await client.get<
      ApiEnvelope<BackendPagedResult<BackendProductPayload>>
    >('/products/paged', {
      params: {
        companyId: COMPANY_ID,
        page: filters.page,
        pageSize: filters.pageSize,
        search: filters.search || undefined,
        category: filters.category || undefined,
        zone: filters.zone || undefined,
        status: filters.status || undefined,
      },
    })

    const data = unwrapResponse(response.data)

    return {
      data: data.Items.map(mapProduct),
      totalCount: data.TotalCount,
      page: data.Page,
      pageSize: data.PageSize,
      totalPages: data.TotalPages,
    }
  } catch (error) {
    return getErrorMessage(error)
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const firstPage = await getProductsPage({
    page: 1,
    pageSize: 100,
    search: '',
    category: '',
    zone: '',
    status: '',
  })

  if (firstPage.totalPages <= 1) {
    return firstPage.data
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getProductsPage({
        page: index + 2,
        pageSize: 100,
        search: '',
        category: '',
        zone: '',
        status: '',
      }),
    ),
  )

  return [firstPage, ...remainingPages].flatMap((page) => page.data)
}

export async function getWarehouseLocations(): Promise<WarehouseLocation[]> {
  try {
    const response = await client.get<ApiEnvelope<BackendWarehouseLocationPayload[]>>(
      `/warehouse-locations/by-company/${COMPANY_ID}`,
    )

    return unwrapResponse(response.data).map(mapWarehouseLocation)
  } catch (error) {
    return getErrorMessage(error)
  }
}

export async function getStockMovements(): Promise<StockMovement[]> {
  try {
    const response = await client.get<ApiEnvelope<BackendStockMovementPayload[]>>(
      `/stock-movements/by-company/${COMPANY_ID}`,
    )

    return unwrapResponse(response.data).map(mapStockMovement)
  } catch (error) {
    return getErrorMessage(error)
  }
}

export async function saveProduct(
  values: ProductFormValues,
  existingProduct?: Product,
  knownLocations?: WarehouseLocation[],
): Promise<void> {
  const warehouseLocation = await ensureWarehouseLocation(
    values.warehouseZone,
    values.shelfNo,
    knownLocations,
  )

  const payload = {
    CompanyId: COMPANY_ID,
    ProductName: values.productName.trim(),
    Sku: values.productCode.trim(),
    Category: values.category,
    Unit: values.unit,
    UnitPrice: values.unitPrice,
    MinimumStock: values.minStock,
    WarehouseLocationId: warehouseLocation.id,
  }

  try {
    if (!existingProduct) {
      const createResponse = await client.post<ApiEnvelope<BackendProductPayload>>(
        '/products/create',
        payload,
      )

      const createdProduct = unwrapResponse(createResponse.data)

      if (values.currentStock > 0) {
        await createMovementInternal(
          'entry',
          createdProduct.Id,
          values.currentStock,
          'İlk stok tanımlama',
        )
      }

      return
    }

    await client.post('/products/update', {
      Id: existingProduct.id,
      ...payload,
    })

    const stockDifference = values.currentStock - existingProduct.currentStock

    if (stockDifference > 0) {
      await createMovementInternal(
        'entry',
        existingProduct.id,
        stockDifference,
        'Ürün düzenleme sonrası stok artışı',
      )
    }

    if (stockDifference < 0) {
      await createMovementInternal(
        'exit',
        existingProduct.id,
        Math.abs(stockDifference),
        'Ürün düzenleme sonrası stok azalışı',
      )
    }
  } catch (error) {
    getErrorMessage(error)
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  try {
    await client.post('/products/delete', {
      Id: productId,
      CompanyId: COMPANY_ID,
    })
  } catch (error) {
    getErrorMessage(error)
  }
}

export async function recordStockMovement(
  mode: StockMovementMode,
  productId: number,
  quantity: number,
  description: string,
): Promise<void> {
  await createMovementInternal(mode, productId, quantity, description)
}

export function createDefaultFilters(): ProductFilters {
  return {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    search: '',
    category: '',
    zone: '',
    status: '',
  }
}
