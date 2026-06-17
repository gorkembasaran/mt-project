import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import type { DashboardSummary } from '../../types/warehouse'
import { formatCompactCurrency, formatCompactNumber } from '../../utils/product'

interface SummaryCardsProps {
  summary: DashboardSummary
  loading: boolean
}

interface SummaryCardConfig {
  key: keyof DashboardSummary
  label: string
  caption: string
  badgeLabel: string
  valueFormatter: (value: number) => string
  icon: typeof Inventory2RoundedIcon
  accent: string
  badgeColor: string
  badgeText: string
  iconBackground: string
}

const summaryCards: SummaryCardConfig[] = [
  {
    key: 'totalProducts',
    label: 'Toplam Ürün',
    caption: 'Aktif kayıtlı ürün',
    badgeLabel: 'Aktif',
    valueFormatter: formatCompactNumber,
    icon: Inventory2RoundedIcon,
    accent: '#4587df',
    badgeColor: '#4587df',
    badgeText: '#ffffff',
    iconBackground: '#edf3ff',
  },
  {
    key: 'totalInbound',
    label: 'Toplam Giriş',
    caption: 'Tüm giriş hareketleri',
    badgeLabel: 'GİRİŞ',
    valueFormatter: formatCompactNumber,
    icon: TrendingUpRoundedIcon,
    accent: '#4e9a57',
    badgeColor: '#4e9a57',
    badgeText: '#ffffff',
    iconBackground: '#eef8ee',
  },
  {
    key: 'totalOutbound',
    label: 'Toplam Çıkış',
    caption: 'Tüm çıkış hareketleri',
    badgeLabel: 'ÇIKIŞ',
    valueFormatter: formatCompactNumber,
    icon: TrendingDownRoundedIcon,
    accent: '#de842d',
    badgeColor: '#de842d',
    badgeText: '#ffffff',
    iconBackground: '#fcf3e7',
  },
  {
    key: 'criticalStock',
    label: 'Kritik Stok',
    caption: 'Min stok altı ürünler',
    badgeLabel: 'Dikkat!',
    valueFormatter: formatCompactNumber,
    icon: WarningAmberRoundedIcon,
    accent: '#de842d',
    badgeColor: '#de842d',
    badgeText: '#ffffff',
    iconBackground: '#fff7e8',
  },
  {
    key: 'depletedProducts',
    label: 'Tükenen Ürün',
    caption: 'Acil sipariş gerekli',
    badgeLabel: 'Yok',
    valueFormatter: formatCompactNumber,
    icon: ErrorOutlineRoundedIcon,
    accent: '#d6475c',
    badgeColor: '#5a994c',
    badgeText: '#ffffff',
    iconBackground: '#fdf0f3',
  },
  {
    key: 'stockValue',
    label: 'Stok Değeri',
    caption: 'Toplam envanter değeri',
    badgeLabel: 'TRY',
    valueFormatter: formatCompactCurrency,
    icon: CurrencyExchangeRoundedIcon,
    accent: '#7a4de2',
    badgeColor: '#f4f5f7',
    badgeText: '#545f71',
    iconBackground: '#f0ecff',
  },
]

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))',
          xl: 'repeat(6, minmax(0, 1fr))',
        },
        gap: 2.25,
      }}
    >
      {summaryCards.map((card) => {
        const Icon = card.icon
        const value = summary[card.key]

        return (
          <Box key={card.key}>
            <Paper
              sx={{
                p: 2.75,
                height: '100%',
                minHeight: 252,
                position: 'relative',
                border: '1px solid #e6ecf5',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack sx={{ height: '100%', width: '100%' }}>
                <Chip
                  label={card.badgeLabel}
                  sx={{
                    position: 'absolute',
                    top: 22,
                    right: 22,
                    height: 32,
                    backgroundColor: card.badgeColor,
                    color: card.badgeText,
                    '& .MuiChip-label': {
                      px: 1.15,
                    },
                  }}
                />

                <Box
                  sx={{
                    width: 62,
                    height: 62,
                    mb: 2.25,
                    borderRadius: '14px',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: card.iconBackground,
                    color: card.accent,
                  }}
                >
                  <Icon sx={{ fontSize: 34 }} />
                </Box>

                <Box sx={{ pt: 0.5 }}>
                  {loading ? (
                    <Skeleton variant="text" width={120} height={46} />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '3rem',
                        lineHeight: 0.98,
                        fontWeight: 800,
                        color: '#1f2a44',
                        letterSpacing: '-0.05em',
                      }}
                    >
                      {card.valueFormatter(value)}
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      mt: 1.2,
                      fontSize: '1rem',
                      color: '#6d7b95',
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {card.label}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.2,
                      color: '#a1aec6',
                      fontSize: '0.95rem',
                      lineHeight: 1.35,
                    }}
                  >
                    {card.caption}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        )
      })}
    </Box>
  )
}
