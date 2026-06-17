import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  ZONE_OPTIONS,
} from '../../constants/options'
import type { ProductFilters } from '../../types/product'

interface ProductFiltersProps {
  filters: ProductFilters
  searchValue: string
  totalCount: number
  onSearchChange: (value: string) => void
  onFilterChange: (
    key: 'category' | 'zone' | 'status',
    value: ProductFilters['category'] | ProductFilters['zone'] | ProductFilters['status'],
  ) => void
  onRefresh: () => void
}

export function ProductFilters({
  filters,
  searchValue,
  totalCount,
  onSearchChange,
  onFilterChange,
  onRefresh,
}: ProductFiltersProps) {
  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', xl: 'center' }}
      spacing={2}
      sx={{ p: { xs: 2, md: 2.35 } }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        sx={{ width: '100%' }}
      >
        <TextField
          value={searchValue}
          placeholder="Ürün adı veya kod ara..."
          size="small"
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{
            minWidth: { lg: 320 },
            flex: { xs: '1 1 auto', lg: '0 0 320px' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: '#8a97af' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          label="Kategori"
          value={filters.category}
          onChange={(event) =>
            onFilterChange('category', event.target.value as ProductFilters['category'])
          }
          sx={{ minWidth: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TuneRoundedIcon sx={{ color: '#8a97af', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="">Tümü</MenuItem>
          {CATEGORY_OPTIONS.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Bölge"
          value={filters.zone}
          onChange={(event) =>
            onFilterChange('zone', event.target.value as ProductFilters['zone'])
          }
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Tümü</MenuItem>
          {ZONE_OPTIONS.map((zone) => (
            <MenuItem key={zone} value={zone}>
              Bölge {zone}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Stok Durumu"
          value={filters.status}
          onChange={(event) =>
            onFilterChange('status', event.target.value as ProductFilters['status'])
          }
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="">Tümü</MenuItem>
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.25} justifyContent="flex-end">
        <Typography sx={{ color: '#93a0b8', fontWeight: 600 }}>
          {totalCount} kayıt
        </Typography>
        <IconButton
          onClick={onRefresh}
          sx={{
            border: '1px solid #e5ebf4',
            color: '#70829d',
            width: 46,
            height: 46,
          }}
        >
          <RefreshRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}
