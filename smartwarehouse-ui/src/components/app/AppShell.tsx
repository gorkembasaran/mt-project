import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded'
import { AppBar, Badge, Box, Chip, IconButton, Toolbar, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { COMPANY_ID, DASHBOARD_REFRESH_BADGE } from '../../constants/options'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#141b2d',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: 78,
            px: 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              px: { xs: 2.5, md: 4 },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, md: 2.5 },
                minWidth: 0,
                flex: '1 1 auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.75,
                  pr: { xs: 0, md: 3 },
                  mr: { xs: 0, md: 1.25 },
                  borderRight: { xs: 'none', md: '1px solid rgba(255,255,255,0.08)' },
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    background:
                      'linear-gradient(160deg, rgba(80, 121, 255, 1) 0%, rgba(55, 88, 227, 1) 100%)',
                    boxShadow: '0 16px 34px rgba(38, 77, 214, 0.28)',
                  }}
                >
                  <WarehouseRoundedIcon sx={{ color: '#fff' }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: '#f8fbff',
                      fontWeight: 800,
                      fontSize: '1.85rem',
                      lineHeight: 1,
                      letterSpacing: '-0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    SmartWare
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(225, 232, 245, 0.62)',
                      fontSize: '0.95rem',
                      lineHeight: 1.15,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Akıllı Depo Yönetimi
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={COMPANY_ID}
                sx={{
                  height: 36,
                  px: 0.75,
                  flexShrink: 0,
                  color: '#dce6f8',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontWeight: 700,
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                ml: 'auto',
                pl: 2,
                flexShrink: 0,
              }}
            >
              <IconButton
                sx={{
                  color: '#cfd8ea',
                }}
              >
                <Badge badgeContent={DASHBOARD_REFRESH_BADGE} color="error" overlap="circular">
                  <NotificationsNoneRoundedIcon />
                </Badge>
              </IconButton>
              <IconButton
                sx={{
                  color: '#cfd8ea',
                }}
              >
                <AccountCircleRoundedIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: '100%',
          px: { xs: 2.5, md: 4, xl: 5 },
          py: { xs: 3, md: 4.5 },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
