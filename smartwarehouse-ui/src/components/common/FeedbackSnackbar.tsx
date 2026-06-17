import { Alert, Snackbar } from '@mui/material'

interface FeedbackSnackbarProps {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info'
  onClose: () => void
}

export function FeedbackSnackbar({
  open,
  message,
  severity,
  onClose,
}: FeedbackSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4200}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ minWidth: 320, alignItems: 'center' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
