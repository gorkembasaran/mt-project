import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import {
  CATEGORY_OPTIONS,
  UNIT_OPTIONS,
  ZONE_OPTIONS,
} from '../../constants/options'
import type { Product, ProductFormValues } from '../../types/product'

interface ProductDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  product?: Product
  submitting: boolean
  onClose: () => void
  onSubmit: (values: ProductFormValues) => Promise<void>
}

type FormErrors = Partial<Record<keyof ProductFormValues, string>>

const emptyFormValues: ProductFormValues = {
  productCode: '',
  productName: '',
  category: 'Elektronik',
  unit: 'Adet',
  currentStock: 0,
  minStock: 0,
  unitPrice: 0,
  warehouseZone: 'A',
  shelfNo: '',
}

export function ProductDialog({
  open,
  mode,
  product,
  submitting,
  onClose,
  onSubmit,
}: ProductDialogProps) {
  const [values, setValues] = useState<ProductFormValues>(() => {
    if (!product) {
      return emptyFormValues
    }

    return {
      productCode: product.productCode,
      productName: product.productName,
      category: product.category,
      unit: product.unit,
      currentStock: product.currentStock,
      minStock: product.minStock,
      unitPrice: product.unitPrice,
      warehouseZone: product.warehouseZone,
      shelfNo: product.shelfNo,
    }
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): boolean {
    const nextErrors: FormErrors = {}

    if (!values.productCode.trim()) {
      nextErrors.productCode = 'Ürün kodu zorunludur.'
    }

    if (!values.productName.trim()) {
      nextErrors.productName = 'Ürün adı zorunludur.'
    }

    if (values.currentStock < 0) {
      nextErrors.currentStock = 'Stok 0 veya daha büyük olmalıdır.'
    }

    if (values.minStock < 0) {
      nextErrors.minStock = 'Min stok 0 veya daha büyük olmalıdır.'
    }

    if (values.unitPrice <= 0) {
      nextErrors.unitPrice = 'Birim fiyat 0’dan büyük olmalıdır.'
    }

    if (!values.shelfNo.trim()) {
      nextErrors.shelfNo = 'Raf bilgisi zorunludur.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function updateField<Key extends keyof ProductFormValues>(
    key: Key,
    value: ProductFormValues[Key],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }))

    if (errors[key]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [key]: undefined,
      }))
    }
  }

  async function handleSubmit() {
    if (!validate()) {
      return
    }

    await onSubmit({
      ...values,
      productCode: values.productCode.trim(),
      productName: values.productName.trim(),
      shelfNo: values.shelfNo.trim(),
    })
  }

  const stockDifference = product ? values.currentStock - product.currentStock : values.currentStock

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {mode === 'create' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
        </Typography>
        <Typography sx={{ mt: 0.8, color: '#7f8ca5' }}>
          Ürün meta bilgilerini gir. Stok seviyesi kaydedilirken hareket geçmişi otomatik korunur.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2.5}>
          <Alert
            icon={<InfoOutlinedIcon fontSize="inherit" />}
            severity="info"
            sx={{ borderRadius: '16px' }}
          >
            {mode === 'create'
              ? 'İlk stok miktarı varsa ürün oluşturulduktan sonra otomatik giriş hareketi oluşturulur.'
              : 'Stok miktarını değiştirirsen gerekli giriş/çıkış hareketi otomatik oluşturulur.'}
          </Alert>

          {mode === 'edit' && stockDifference !== 0 ? (
            <Alert
              severity={stockDifference > 0 ? 'success' : 'warning'}
              sx={{ borderRadius: '16px' }}
            >
              Kaydetme sonrası{' '}
              <strong>
                {Math.abs(stockDifference)} adet {stockDifference > 0 ? 'stok girişi' : 'stok çıkışı'}
              </strong>{' '}
              oluşturulacak.
            </Alert>
          ) : null}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            <TextField
              label="Ürün Kodu"
              value={values.productCode}
              onChange={(event) => updateField('productCode', event.target.value)}
              error={Boolean(errors.productCode)}
              helperText={errors.productCode}
            />
            <TextField
              label="Ürün Adı"
              value={values.productName}
              onChange={(event) => updateField('productName', event.target.value)}
              error={Boolean(errors.productName)}
              helperText={errors.productName}
            />
            <TextField
              select
              label="Kategori"
              value={values.category}
              onChange={(event) =>
                updateField('category', event.target.value as ProductFormValues['category'])
              }
            >
              {CATEGORY_OPTIONS.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Birim"
              value={values.unit}
              onChange={(event) =>
                updateField('unit', event.target.value as ProductFormValues['unit'])
              }
            >
              {UNIT_OPTIONS.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Mevcut Stok"
              type="number"
              value={values.currentStock}
              onChange={(event) => updateField('currentStock', Number(event.target.value))}
              error={Boolean(errors.currentStock)}
              helperText={errors.currentStock}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Min Stok"
              type="number"
              value={values.minStock}
              onChange={(event) => updateField('minStock', Number(event.target.value))}
              error={Boolean(errors.minStock)}
              helperText={errors.minStock}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Birim Fiyat"
              type="number"
              value={values.unitPrice}
              onChange={(event) => updateField('unitPrice', Number(event.target.value))}
              error={Boolean(errors.unitPrice)}
              helperText={errors.unitPrice}
              inputProps={{ min: 0, step: '0.01' }}
            />
            <TextField
              select
              label="Depo Bölgesi"
              value={values.warehouseZone}
              onChange={(event) =>
                updateField(
                  'warehouseZone',
                  event.target.value as ProductFormValues['warehouseZone'],
                )
              }
            >
              {ZONE_OPTIONS.map((zone) => (
                <MenuItem key={zone} value={zone}>
                  Bölge {zone}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Raf No"
              value={values.shelfNo}
              onChange={(event) => updateField('shelfNo', event.target.value)}
              error={Boolean(errors.shelfNo)}
              helperText={errors.shelfNo || 'Örnek: A5-2'}
              sx={{ gridColumn: { md: 'span 2' } }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Vazgeç
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {mode === 'create' ? 'Ürünü Kaydet' : 'Değişiklikleri Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
