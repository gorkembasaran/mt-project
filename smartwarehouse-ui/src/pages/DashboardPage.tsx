import AddRoundedIcon from '@mui/icons-material/AddRounded'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import { Box, Button, Fab, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { AppShell } from '../components/app/AppShell'
import { FeedbackSnackbar } from '../components/common/FeedbackSnackbar'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { DeleteDialog } from '../components/products/DeleteDialog'
import { ProductDialog } from '../components/products/ProductDialog'
import { ProductTable } from '../components/products/ProductTable'
import { StockMovementDialog } from '../components/products/StockMovementDialog'
import { useWarehouseDashboard } from '../hooks/useWarehouseDashboard'
import type { Product, ProductFormValues } from '../types/product'

type SnackbarState = {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info'
}

const initialSnackbarState: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
}

export function DashboardPage() {
  const {
    filters,
    searchInput,
    productPage,
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
  } = useWarehouseDashboard()

  const [snackbar, setSnackbar] = useState<SnackbarState>(initialSnackbarState)
  const [productDialogMode, setProductDialogMode] = useState<'create' | 'edit'>('create')
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [movementDialogState, setMovementDialogState] = useState<{
    open: boolean
    mode: 'entry' | 'exit'
    product?: Product
  }>({
    open: false,
    mode: 'entry',
  })

  function openCreateProductDialog() {
    setProductDialogMode('create')
    setSelectedProduct(undefined)
    setProductDialogOpen(true)
  }

  function openEditProductDialog(product: Product) {
    setProductDialogMode('edit')
    setSelectedProduct(product)
    setProductDialogOpen(true)
  }

  function closeProductDialog() {
    if (isActionLoading) {
      return
    }

    setProductDialogOpen(false)
    setSelectedProduct(undefined)
  }

  function closeDeleteDialog() {
    if (isActionLoading) {
      return
    }

    setDeleteDialogOpen(false)
    setSelectedProduct(undefined)
  }

  function closeMovementDialog() {
    if (isActionLoading) {
      return
    }

    setMovementDialogState((currentState) => ({
      ...currentState,
      open: false,
      product: undefined,
    }))
  }

  async function submitProduct(values: ProductFormValues) {
    try {
      await handleSaveProduct(values, productDialogMode === 'edit' ? selectedProduct : undefined)

      setSnackbar({
        open: true,
        message:
          productDialogMode === 'create'
            ? 'Ürün başarıyla oluşturuldu.'
            : 'Ürün başarıyla güncellendi.',
        severity: 'success',
      })
      closeProductDialog()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Ürün kaydedilemedi.',
        severity: 'error',
      })
    }
  }

  async function confirmDeleteProduct() {
    if (!selectedProduct) {
      return
    }

    try {
      await handleDeleteProduct(selectedProduct.id)
      setSnackbar({
        open: true,
        message: 'Ürün soft delete olarak pasife alındı.',
        severity: 'success',
      })
      closeDeleteDialog()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Ürün silinemedi.',
        severity: 'error',
      })
    }
  }

  async function submitMovement(quantity: number, description: string) {
    const targetProduct = movementDialogState.product

    if (!targetProduct) {
      return
    }

    try {
      await handleRecordMovement(
        movementDialogState.mode,
        targetProduct.id,
        quantity,
        description,
      )

      setSnackbar({
        open: true,
        message:
          movementDialogState.mode === 'entry'
            ? 'Stok giriş işlemi kaydedildi.'
            : 'Stok çıkış işlemi kaydedildi.',
        severity: 'success',
      })
      closeMovementDialog()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Stok hareketi kaydedilemedi.',
        severity: 'error',
      })
    }
  }

  return (
    <AppShell>
      <Stack spacing={3}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            alignItems: 'center',
            columnGap: 3,
            rowGap: 2,
          }}
        >
          <Box
            sx={{
              minHeight: { md: 68 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.6rem' },
                lineHeight: { xs: 1.1, md: 1.06 },
                letterSpacing: '-0.045em',
                color: '#18243c',
              }}
            >
              Depo Yönetimi
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.35,
                color: '#7e8ca5',
              }}
            >
              Ürün tanımlama, stok giriş/çıkış ve envanter takibi
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              ml: { md: 'auto' },
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={openCreateProductDialog}
              sx={{
                px: 3,
                py: 1.1,
                minWidth: 214,
                fontSize: '1.05rem',
                borderRadius: '14px',
                boxShadow: '0 18px 30px rgba(61, 99, 242, 0.28)',
              }}
            >
              Yeni Ürün Ekle
            </Button>
          </Box>
        </Box>

        <SummaryCards summary={summary} loading={isMetaLoading} />

        <ProductTable
          page={productPage}
          filters={filters}
          searchValue={searchInput}
          loading={isTableLoading}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onRefresh={refreshDashboard}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onCreateEntry={(product) =>
            setMovementDialogState({ open: true, mode: 'entry', product })
          }
          onCreateExit={(product) =>
            setMovementDialogState({ open: true, mode: 'exit', product })
          }
          onEdit={openEditProductDialog}
          onDelete={(product) => {
            setSelectedProduct(product)
            setDeleteDialogOpen(true)
          }}
        />
      </Stack>

      <ProductDialog
        key={`${productDialogMode}-${selectedProduct?.id ?? 'new'}-${productDialogOpen ? 'open' : 'closed'}`}
        open={productDialogOpen}
        mode={productDialogMode}
        product={selectedProduct}
        submitting={isActionLoading}
        onClose={closeProductDialog}
        onSubmit={submitProduct}
      />

      <StockMovementDialog
        key={`${movementDialogState.mode}-${movementDialogState.product?.id ?? 'none'}-${movementDialogState.open ? 'open' : 'closed'}`}
        open={movementDialogState.open}
        mode={movementDialogState.mode}
        product={movementDialogState.product}
        submitting={isActionLoading}
        onClose={closeMovementDialog}
        onSubmit={submitMovement}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        product={selectedProduct}
        submitting={isActionLoading}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteProduct}
      />

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((currentState) => ({ ...currentState, open: false }))}
      />

      <FeedbackSnackbar
        open={Boolean(errorMessage)}
        message={errorMessage}
        severity="error"
        onClose={clearErrorMessage}
      />

      <Fab
        color="default"
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          backgroundColor: '#1d1f26',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2a2d35',
          },
        }}
      >
        <HelpRoundedIcon />
      </Fab>
    </AppShell>
  )
}
