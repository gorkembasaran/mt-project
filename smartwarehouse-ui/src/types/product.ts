import type {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
  ZONE_OPTIONS,
} from '../constants/options'

export type ProductCategory = (typeof CATEGORY_OPTIONS)[number]
export type ProductUnit = (typeof UNIT_OPTIONS)[number]
export type WarehouseZone = (typeof ZONE_OPTIONS)[number]
export type ProductStatus = (typeof STATUS_OPTIONS)[number]

export interface Product {
  id: number
  companyId: string
  productCode: string
  productName: string
  category: ProductCategory
  unit: ProductUnit
  currentStock: number
  minStock: number
  unitPrice: number
  warehouseZone: WarehouseZone
  shelfNo: string
  status: ProductStatus
  locationId: number
  createdAt?: string
  updatedAt?: string | null
}

export interface ProductFilters {
  page: number
  pageSize: number
  search: string
  category: ProductCategory | ''
  zone: WarehouseZone | ''
  status: ProductStatus | ''
}

export interface ProductFormValues {
  productCode: string
  productName: string
  category: ProductCategory
  unit: ProductUnit
  currentStock: number
  minStock: number
  unitPrice: number
  warehouseZone: WarehouseZone
  shelfNo: string
}
