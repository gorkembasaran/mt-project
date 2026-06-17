import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { Product } from '../../types/product'

interface StockMovementDialogProps {
  open: boolean
  mode: 'entry' | 'exit'
  product?: Product
  submitting: boolean
  onClose: () => void
  onSubmit: (quantity: number, description: string) => Promise<void>
}

export function StockMovementDialog({
  open,
  mode,
  product,
  submitting,
  onClose,
  onSubmit,
}: StockMovementDialogProps) {
  const [quantity, setQuantity] = useState(0)
  const [description, setDescription] = useState('')
  const [quantityError, setQuantityError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  const currentStock = product?.currentStock ?? 0
  const projectedStock =
    mode === 'entry' ? currentStock + quantity : Math.max(currentStock - quantity, 0)

  function validate() {
    let isValid = true

    if (quantity <= 0) {
      setQuantityError('Miktar 0’dan büyük olmalıdır.')
      isValid = false
    } else if (mode === 'exit' && quantity > currentStock) {
      setQuantityError('Çıkış miktarı mevcut stoktan büyük olamaz.')
      isValid = false
    } else {
      setQuantityError('')
    }

    if (!description.trim()) {
      setDescriptionError('Açıklama zorunludur.')
      isValid = false
    } else {
      setDescriptionError('')
    }

    return isValid
  }

  async function handleSubmit() {
    if (!validate()) {
      return
    }

    await onSubmit(quantity, description.trim())
  }

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {mode === 'entry' ? 'Stok Giriş İşlemi' : 'Stok Çıkış İşlemi'}
        </Typography>
        <Typography sx={{ mt: 0.8, color: '#7f8ca5' }}>
          {product?.productName} • {product?.productCode}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            <Paper
              variant="outlined"
              sx={{ p: 2.2, borderRadius: '18px', borderColor: '#e2e9f5' }}
            >
              <Typography sx={{ color: '#8391a7', fontWeight: 600 }}>
                Mevcut stok
              </Typography>
              <Typography sx={{ mt: 0.8, fontSize: '2rem', fontWeight: 800 }}>
                {currentStock}
              </Typography>
            </Paper>

            <Paper
              variant="outlined"
              sx={{ p: 2.2, borderRadius: '18px', borderColor: '#e2e9f5' }}
            >
              <Typography sx={{ color: '#8391a7', fontWeight: 600 }}>
                İşlem sonrası tahmini stok
              </Typography>
              <Typography
                sx={{
                  mt: 0.8,
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: mode === 'entry' ? '#4e9a57' : '#de842d',
                }}
              >
                {projectedStock}
              </Typography>
            </Paper>
          </Box>

          <TextField
            label="Miktar"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            error={Boolean(quantityError)}
            helperText={quantityError}
            inputProps={{
              min: 0,
              max: mode === 'exit' ? currentStock : undefined,
            }}
          />

          <TextField
            label="Açıklama"
            multiline
            minRows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            error={Boolean(descriptionError)}
            helperText={descriptionError}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Vazgeç
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={mode === 'entry' ? 'success' : 'warning'}
          disabled={submitting}
        >
          {mode === 'entry' ? 'Giriş Kaydet' : 'Çıkış Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
