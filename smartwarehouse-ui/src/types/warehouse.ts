export interface WarehouseLocation {
  id: number
  companyId: string
  zone: string
  shelfNo: string
  description: string
}

export interface StockMovement {
  id: number
  companyId: string
  productId: number
  productName: string
  quantity: number
  movementType: 'IN' | 'OUT'
  description: string
  createdAt: string
}

export interface DashboardSummary {
  totalProducts: number
  totalInbound: number
  totalOutbound: number
  criticalStock: number
  depletedProducts: number
  stockValue: number
}
