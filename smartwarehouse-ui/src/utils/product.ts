import type { DashboardSummary, StockMovement } from '../types/warehouse'
import type { Product, ProductStatus } from '../types/product'

export function getProductStatus(
  currentStock: number,
  minStock: number,
): ProductStatus {
  if (currentStock === 0) {
    return 'Tükendi'
  }

  if (currentStock <= minStock) {
    return 'Kritik'
  }

  return 'Yeterli'
}

export function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value)
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `₺${(value / 1_000_000).toFixed(1).replace('.', ',')}M`
  }

  if (value >= 1_000) {
    return `₺${Math.round(value / 1_000)}K`
  }

  return `₺${Math.round(value)}`
}

export function getStockColor(status: ProductStatus): string {
  if (status === 'Tükendi') {
    return '#d6475c'
  }

  if (status === 'Kritik') {
    return '#d9862c'
  }

  return '#49a55b'
}

export function getCategoryTone(category: Product['category']): string {
  switch (category) {
    case 'Elektronik':
      return '#eef3ff'
    case 'Gıda':
      return '#edf8ef'
    case 'Kimyasal':
      return '#f9f0e4'
    case 'Tekstil':
      return '#f7effd'
    case 'Makine':
      return '#edf1f7'
    default:
      return '#eef3ff'
  }
}

export function getCategoryTextColor(category: Product['category']): string {
  switch (category) {
    case 'Elektronik':
      return '#5b6d8f'
    case 'Gıda':
      return '#5b8762'
    case 'Kimyasal':
      return '#8c6b46'
    case 'Tekstil':
      return '#7f6b93'
    case 'Makine':
      return '#697789'
    default:
      return '#5b6d8f'
  }
}

export function buildDashboardSummary(
  products: Product[],
  movements: StockMovement[],
): DashboardSummary {
  const totalInbound = movements
    .filter((movement) => movement.movementType === 'IN')
    .reduce((sum, movement) => sum + movement.quantity, 0)

  const totalOutbound = movements
    .filter((movement) => movement.movementType === 'OUT')
    .reduce((sum, movement) => sum + movement.quantity, 0)

  const criticalStock = products.filter(
    (product) => product.currentStock > 0 && product.currentStock <= product.minStock,
  ).length

  const depletedProducts = products.filter(
    (product) => product.currentStock === 0,
  ).length

  const stockValue = products.reduce(
    (sum, product) => sum + product.currentStock * product.unitPrice,
    0,
  )

  return {
    totalProducts: products.length,
    totalInbound,
    totalOutbound,
    criticalStock,
    depletedProducts,
    stockValue,
  }
}

export function getProductAvatarLabel(product: Product): string {
  const candidate = product.productName.trim().charAt(0) || product.productCode.charAt(0)
  return candidate.toLocaleUpperCase('tr-TR')
}
