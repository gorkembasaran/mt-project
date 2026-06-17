import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { Product } from '../../types/product'

interface DeleteDialogProps {
  open: boolean
  product?: Product
  submitting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteDialog({
  open,
  product,
  submitting,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Ürünü Sil
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: '#5c6983', mb: 2 }}>
          <strong>{product?.productName}</strong> adlı ürünü pasife almak istediğine emin misin?
        </Typography>
        <Alert
          icon={<WarningAmberRoundedIcon fontSize="inherit" />}
          severity="warning"
          sx={{ borderRadius: '16px' }}
        >
          Bu işlem fiziksel silme yapmaz. Ürün soft delete olarak işaretlenir ve stok hareket
          geçmişi korunur.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Vazgeç
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={submitting}>
          Silmeyi Onayla
        </Button>
      </DialogActions>
    </Dialog>
  )
}
