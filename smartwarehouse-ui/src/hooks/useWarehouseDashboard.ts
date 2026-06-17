import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import {
  createDefaultFilters,
  deleteProduct,
  getAllProducts,
  getProductsPage,
  getStockMovements,
  getWarehouseLocations,
  recordStockMovement,
  saveProduct,
} from '../api/warehouseApi'
import type { PagedResult } from '../types/api'
import type { Product, ProductFilters, ProductFormValues } from '../types/product'
import type { DashboardSummary, StockMovement, WarehouseLocation } from '../types/warehouse'
import { buildDashboardSummary } from '../utils/product'

export function useWarehouseDashboard() {
  const [filters, setFilters] = useState<ProductFilters>(createDefaultFilters())
  const [searchInput, setSearchInput] = useState('')
  const deferredSearch = useDeferredValue(searchInput)

  const [productPage, setProductPage] = useState<PagedResult<Product>>({
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: filters.pageSize,
    totalPages: 0,
  })
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [locations, setLocations] = useState<WarehouseLocation[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [isMetaLoading, setIsMetaLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    startTransition(() => {
      setFilters((currentFilters) => {
        if (currentFilters.search === deferredSearch) {
          return currentFilters
        }

        return {
          ...currentFilters,
          search: deferredSearch,
          page: 1,
        }
      })
    })
  }, [deferredSearch])

  useEffect(() => {
    let ignore = false

    async function loadProductPage() {
      setIsTableLoading(true)

      try {
        const nextPage = await getProductsPage(filters)

        if (!ignore) {
          setProductPage(nextPage)
        }
      } catch (error) {
        if (!ignore && error instanceof Error) {
          setErrorMessage(error.message)
        }
      } finally {
        if (!ignore) {
          setIsTableLoading(false)
        }
      }
    }

    void loadProductPage()

    return () => {
      ignore = true
    }
  }, [filters, refreshKey])

  useEffect(() => {
    let ignore = false

    async function loadDashboardMeta() {
      setIsMetaLoading(true)

      try {
        const [products, nextMovements, nextLocations] = await Promise.all([
          getAllProducts(),
          getStockMovements(),
          getWarehouseLocations(),
        ])

        if (!ignore) {
          setAllProducts(products)
          setMovements(nextMovements)
          setLocations(nextLocations)
        }
      } catch (error) {
        if (!ignore && error instanceof Error) {
          setErrorMessage(error.message)
        }
      } finally {
        if (!ignore) {
          setIsMetaLoading(false)
        }
      }
    }

    void loadDashboardMeta()

    return () => {
      ignore = true
    }
  }, [refreshKey])

  async function handleSaveProduct(
    values: ProductFormValues,
    existingProduct?: Product,
  ) {
    setIsActionLoading(true)
    setErrorMessage('')

    try {
      await saveProduct(values, existingProduct, locations)
      setRefreshKey((currentKey) => currentKey + 1)
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleDeleteProduct(productId: number) {
    setIsActionLoading(true)
    setErrorMessage('')

    try {
      await deleteProduct(productId)
      setRefreshKey((currentKey) => currentKey + 1)
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleRecordMovement(
    mode: 'entry' | 'exit',
    productId: number,
    quantity: number,
    description: string,
  ) {
    setIsActionLoading(true)
    setErrorMessage('')

    try {
      await recordStockMovement(mode, productId, quantity, description)
      setRefreshKey((currentKey) => currentKey + 1)
    } finally {
      setIsActionLoading(false)
    }
  }

  function handleSearchChange(value: string) {
    startTransition(() => {
      setSearchInput(value)
    })
  }

  function handleFilterChange<Key extends keyof Pick<ProductFilters, 'category' | 'zone' | 'status'>>(
    key: Key,
    value: ProductFilters[Key],
  ) {
    startTransition(() => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        [key]: value,
        page: 1,
      }))
    })
  }

  function handlePageChange(page: number) {
    startTransition(() => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        page,
      }))
    })
  }

  function handlePageSizeChange(pageSize: number) {
    startTransition(() => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        pageSize,
        page: 1,
      }))
    })
  }

  function refreshDashboard() {
    setRefreshKey((currentKey) => currentKey + 1)
  }

  function clearErrorMessage() {
    setErrorMessage('')
  }

  const summary: DashboardSummary = buildDashboardSummary(allProducts, movements)

  return {
    filters,
    searchInput,
    productPage,
    locations,
    movements,
    summary,
    isTableLoading,
    isMetaLoading,
    isActionLoading,
    errorMessage,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSaveProduct,
    handleDeleteProduct,
    handleRecordMovement,
    refreshDashboard,
    clearErrorMessage,
  }
}
