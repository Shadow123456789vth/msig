import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Chip, Avatar, Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import WorkIcon from '@mui/icons-material/Work';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useClaim } from '../../context/ClaimContext';
import bloomLogo from '../../assets/Bloom_logo.jpg';

export const DRAWER_WIDTH = 240;
export const COLLAPSED_WIDTH = 64;

const NAV_ITEMS = [
  { label: 'Dashboard',         icon: <DashboardIcon fontSize="small" />,        page: 'dashboard' },
  { label: 'File New Claim',    icon: <AddCircleOutlineIcon fontSize="small" />, page: 'new-claim', highlight: true },
  { label: 'My Claims',         icon: <FolderOpenIcon fontSize="small" />,       page: 'claims-list' },
  { label: 'Officer Workbench', icon: <WorkIcon fontSize="small" />,             page: 'workbench' },
  { label: 'Analytics',         icon: <BarChartIcon fontSize="small" />,         page: 'analytics' },
  { label: 'Administration',    icon: <SettingsIcon fontSize="small" />,         page: 'admin' },
];

const BLUE = 'rgb(27, 117, 187)';

export default function Sidebar({ open, onClose, variant = 'permanent', collapsed = false, onToggle }) {
  const { currentPage, navigateTo, auth, claims } = useClaim();

  const pendingCount = claims.filter(c =>
    ['Submitted', 'Registered', 'Under Assessment', 'Pending Review'].includes(c.status)
  ).length;

  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1A252F', overflow: 'hidden' }}>

      {/* ── Brand ── */}
      <Box sx={{
        px: 2, py: 1.8,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 1.5, minHeight: 64,
      }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 0.7, display: 'flex', flexShrink: 0 }}>
          <img src={bloomLogo} alt="Bloom" style={{ height: 36, objectFit: 'contain' }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.92rem', lineHeight: 1.2 }}>
              MSIG
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>
              Travel Claims Portal
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* ── User card ── */}
      {collapsed ? (
        <Tooltip title={`${auth.user?.name || 'Policyholder'} · ${auth.policy?.policyNumber || ''}`} placement="right">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
            <Avatar sx={{ bgcolor: BLUE, width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
              {auth.user?.name?.[0] || 'P'}
            </Avatar>
          </Box>
        </Tooltip>
      ) : (
        <Box sx={{ mx: 1.5, my: 1.5, p: 1.5, bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar sx={{ bgcolor: BLUE, width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700 }}>
              {auth.user?.name?.[0] || 'P'}
            </Avatar>
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Typography noWrap sx={{ color: 'white', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3 }}>
                {auth.user?.name || 'Policyholder'}
              </Typography>
              <Typography noWrap sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem' }}>
                {auth.policy?.policyNumber}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />

      {/* ── Nav items ── */}
      <List sx={{ flex: 1, px: collapsed ? 0.75 : 1.5, py: 0 }}>
        {NAV_ITEMS.map(item => {
          const active = currentPage === item.page;
          const btn = (
            <ListItemButton
              onClick={() => { navigateTo(item.page); if (onClose) onClose(); }}
              sx={{
                borderRadius: 2,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 0 : 1.5,
                py: 1.1,
                bgcolor: active ? BLUE : item.highlight ? 'rgba(27,117,187,0.18)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.75)',
                '&:hover': {
                  bgcolor: active ? BLUE : 'rgba(255,255,255,0.08)',
                  color: 'white',
                },
              }}
            >
              <ListItemIcon sx={{
                color: active ? 'white' : item.highlight ? BLUE : 'rgba(255,255,255,0.5)',
                minWidth: collapsed ? 0 : 32,
                justifyContent: 'center',
              }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.83rem', fontWeight: active ? 700 : 500 }}
                  />
                  {item.page === 'claims-list' && pendingCount > 0 && (
                    <Chip label={pendingCount} size="small" sx={{
                      height: 18, fontSize: '0.65rem', fontWeight: 700,
                      bgcolor: active ? 'rgba(255,255,255,0.25)' : '#F39C12',
                      color: 'white',
                    }} />
                  )}
                </>
              )}
              {/* dot indicator when collapsed */}
              {collapsed && item.page === 'claims-list' && pendingCount > 0 && (
                <Box sx={{
                  position: 'absolute', top: 5, right: 5,
                  width: 7, height: 7, borderRadius: '50%', bgcolor: '#F39C12',
                }} />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.page} disablePadding sx={{ mb: 0.5, position: 'relative' }}>
              {collapsed
                ? <Tooltip title={item.label} placement="right" arrow>{btn}</Tooltip>
                : btn
              }
            </ListItem>
          );
        })}
      </List>

      {/* ── Collapse / Expand toggle ── */}
      {variant === 'permanent' && onToggle && (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          {collapsed ? (
            <Tooltip title="Expand sidebar" placement="right" arrow>
              <Box
                onClick={onToggle}
                sx={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  py: 1.4, cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: 'white' },
                }}
              >
                <KeyboardDoubleArrowRightIcon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>
          ) : (
            <Box
              onClick={onToggle}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.2,
                px: 2, py: 1.4, cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)' },
              }}
            >
              <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, userSelect: 'none' }}>
                Collapse sidebar
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* ── Footer ── */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      {collapsed ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.4 }}>
          <FlightTakeoffIcon sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 15 }} />
        </Box>
      ) : (
        <Box sx={{ px: 2, py: 1.4, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoffIcon sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 15 }} />
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.63rem' }}>
              DXC Technology · v1.0
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.58rem' }}>
              ServiceNow FSO + React UI
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer open={open} onClose={onClose}
        PaperProps={{ sx: { width: DRAWER_WIDTH, border: 'none' } }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '4px 0 20px rgba(0,0,0,0.12)',
          transition: 'width 0.22s cubic-bezier(0.4, 0, 0.6, 1)',
          overflowX: 'hidden',
        },
      }}
      sx={{ width, flexShrink: 0, transition: 'width 0.22s cubic-bezier(0.4, 0, 0.6, 1)' }}
    >
      {content}
    </Drawer>
  );
}
