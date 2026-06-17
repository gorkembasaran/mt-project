import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'
import SouthEastRoundedIcon from '@mui/icons-material/SouthEastRounded'
import {
  alpha,
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { PAGE_SIZE_OPTIONS } from '../../constants/options'
import type { PagedResult } from '../../types/api'
import type { Product, ProductFilters } from '../../types/product'
import {
  formatCurrency,
  getCategoryTextColor,
  getCategoryTone,
  getProductAvatarLabel,
  getStockColor,
} from '../../utils/product'
import { ProductFilters as ProductFiltersBar } from './ProductFilters'

interface ProductTableProps {
  page: PagedResult<Product>
  filters: ProductFilters
  searchValue: string
  loading: boolean
  onSearchChange: (value: string) => void
  onFilterChange: (
    key: 'category' | 'zone' | 'status',
    value: ProductFilters['category'] | ProductFilters['zone'] | ProductFilters['status'],
  ) => void
  onRefresh: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onCreateEntry: (product: Product) => void
  onCreateExit: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function getStatusStyles(status: Product['status']) {
  if (status === 'Tükendi') {
    return {
      color: '#ffffff',
      backgroundColor: '#d6475c',
    }
  }

  if (status === 'Kritik') {
    return {
      color: '#ffffff',
      backgroundColor: '#de842d',
    }
  }

  return {
    color: '#ffffff',
    backgroundColor: '#4e9a57',
  }
}

export function ProductTable({
  page,
  filters,
  searchValue,
  loading,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onPageChange,
  onPageSizeChange,
  onCreateEntry,
  onCreateExit,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Paper
      sx={{
        mt: 3.2,
        overflow: 'hidden',
        borderRadius: '22px',
        border: '1px solid #e6ecf5',
      }}
    >
      <ProductFiltersBar
        filters={filters}
        searchValue={searchValue}
        totalCount={page.totalCount}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        onRefresh={onRefresh}
      />

      <TableContainer>
        <Table sx={{ minWidth: 1180 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ürün Kodu</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Bölge/Raf</TableCell>
              <TableCell align="center">Stok</TableCell>
              <TableCell align="center">Min Stok</TableCell>
              <TableCell align="right">Birim Fiyat</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: 8 }, (_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: 9 }, (_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton height={38} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}

            {!loading && page.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Stack spacing={1.2} sx={{ py: 7, alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#2d3b58' }}>
                      Henüz ürün bulunamadı
                    </Typography>
                    <Typography sx={{ color: '#8391a9' }}>
                      Filtreleri temizleyebilir veya yeni ürün ekleyebilirsin.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : null}

            {!loading
              ? page.data.map((product) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha('#3d63f2', 0.025),
                      },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontWeight: 800, color: '#4f5e78' }}>
                        {product.productCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: '#f1f4fa',
                            color: '#5f6e87',
                            width: 38,
                            height: 38,
                            fontWeight: 800,
                          }}
                        >
                          {getProductAvatarLabel(product)}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: '#24314c',
                            }}
                          >
                            {product.productName}
                          </Typography>
                          <Typography sx={{ color: '#94a2ba' }}>
                            {product.unit}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.category}
                        sx={{
                          backgroundColor: getCategoryTone(product.category),
                          color: getCategoryTextColor(product.category),
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Chip
                          label={`Bölge ${product.warehouseZone}`}
                          sx={{
                            backgroundColor: '#eaf1ff',
                            color: '#5674dd',
                          }}
                        />
                        <Typography sx={{ color: '#8f9bb2' }}>
                          {product.shelfNo}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: getStockColor(product.status),
                          fontSize: '1.7rem',
                          lineHeight: 1,
                        }}
                      >
                        {product.currentStock}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ color: '#92a0b9', fontWeight: 600 }}>
                        {product.minStock}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 800, color: '#40506d' }}>
                        {formatCurrency(product.unitPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.status} sx={getStatusStyles(product.status)} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.4}
                        flexWrap="nowrap"
                      >
                        <Tooltip title="Stok Giriş">
                          <span>
                            <IconButton
                              onClick={() => onCreateEntry(product)}
                              sx={{ color: '#4e9a57' }}
                            >
                              <NorthEastRoundedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Stok Çıkış">
                          <span>
                            <IconButton
                              onClick={() => onCreateExit(product)}
                              disabled={product.currentStock === 0}
                              sx={{ color: '#de842d' }}
                            >
                              <SouthEastRoundedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Düzenle">
                          <IconButton
                            onClick={() => onEdit(product)}
                            sx={{ color: '#3d63f2' }}
                          >
                            <EditRoundedIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Sil">
                          <IconButton
                            onClick={() => onDelete(product)}
                            sx={{ color: '#d6475c' }}
                          >
                            <DeleteOutlineRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={page.totalCount}
        page={Math.max(page.page - 1, 0)}
        onPageChange={(_, nextPage) => onPageChange(nextPage + 1)}
        rowsPerPage={page.pageSize}
        onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS as unknown as number[]}
        labelRowsPerPage="Sayfa Boyutu"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        sx={{
          borderTop: '1px solid #e8eef8',
        }}
      />
    </Paper>
  )
}
