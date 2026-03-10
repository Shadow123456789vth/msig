import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, IconButton, Badge, Popover,
  List, ListItem, ListItemText, Button, Chip, Divider, Avatar, Tooltip,
  Breadcrumbs, Link
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useClaim } from '../../context/ClaimContext';
import { DRAWER_WIDTH } from './Sidebar';

const BLUE = 'rgb(27, 117, 187)';

const TYPE_ICON = {
  success: <CheckCircleIcon sx={{ color: '#27AE60', fontSize: 16 }} />,
  info:    <InfoIcon sx={{ color: BLUE, fontSize: 16 }} />,
  warning: <WarningAmberIcon sx={{ color: '#F39C12', fontSize: 16 }} />,
};

const PAGE_LABELS = {
  dashboard:    { label: 'Dashboard', parent: null },
  'new-claim':  { label: 'File New Claim', parent: 'dashboard' },
  'claims-list':{ label: 'My Claims', parent: 'dashboard' },
  'claim-detail':{ label: 'Claim Details', parent: 'claims-list' },
  workbench:    { label: 'Officer Workbench', parent: 'dashboard' },
  analytics:    { label: 'Analytics & Reports', parent: 'dashboard' },
  admin:        { label: 'Administration', parent: 'dashboard' },
};

export default function Header({ onMenuClick, sidebarWidth }) {
  const drawerW = sidebarWidth ?? DRAWER_WIDTH;
  const { auth, logout, notifications, markNotificationRead, markAllRead, unreadCount, navigateTo, currentPage } = useClaim();
  const [anchorEl, setAnchorEl] = useState(null);

  const page = PAGE_LABELS[currentPage] || PAGE_LABELS.dashboard;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #E8EDF2',
        zIndex: 1200,
        width: { xs: '100%', md: `calc(100% - ${drawerW}px)` },
        ml: { xs: 0, md: `${drawerW}px` },
        transition: 'width 0.22s cubic-bezier(0.4,0,0.6,1), margin 0.22s cubic-bezier(0.4,0,0.6,1)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, minHeight: 60 }}>
        {/* Left: breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: 'none' }, color: '#607D8B', mr: 0.5 }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {page.parent && (
                <Link
                  underline="hover"
                  sx={{ fontSize: '0.75rem', color: '#90A4AE', cursor: 'pointer', '&:hover': { color: BLUE } }}
                  onClick={() => navigateTo(page.parent)}
                >
                  {PAGE_LABELS[page.parent]?.label}
                </Link>
              )}
              <Typography sx={{ fontSize: '0.75rem', color: '#607D8B', fontWeight: 600 }}>
                {page.label}
              </Typography>
            </Breadcrumbs>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A252F', lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}>
              {page.label}
            </Typography>
          </Box>
        </Box>

        {/* Right */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={auth.policy?.planType}
            size="small"
            sx={{
              bgcolor: `${BLUE}12`, color: BLUE, fontWeight: 600,
              fontSize: '0.72rem', display: { xs: 'none', md: 'flex' },
              border: `1px solid ${BLUE}20`,
            }}
          />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={e => setAnchorEl(e.currentTarget)}
              size="small"
              sx={{ bgcolor: unreadCount > 0 ? `${BLUE}10` : 'transparent' }}
            >
              <Badge badgeContent={unreadCount} color="error" max={9}>
                <NotificationsIcon sx={{ color: unreadCount > 0 ? BLUE : '#90A4AE', fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', px: 1, py: 0.5, borderRadius: 2, '&:hover': { bgcolor: '#F0F4F8' } }}
            onClick={() => navigateTo('dashboard')}
          >
            <Avatar sx={{ bgcolor: BLUE, width: 30, height: 30, fontSize: '0.8rem', fontWeight: 700 }}>
              {auth.user?.name?.[0] || 'P'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A252F', lineHeight: 1.2 }}>
                {auth.user?.name?.split(' ')[0]}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#90A4AE', lineHeight: 1 }}>
                Policyholder
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Sign out">
            <IconButton size="small" onClick={logout} sx={{ color: '#90A4AE', '&:hover': { color: BLUE, bgcolor: `${BLUE}10` } }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Notification Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 380, maxHeight: 500, borderRadius: 2, border: '1px solid #E8EDF2', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F7F9FB', borderBottom: '1px solid #EEF2F6' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
            {unreadCount > 0 && (
              <Chip label={unreadCount} size="small" color="error" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
            )}
          </Box>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllRead} sx={{ color: BLUE, fontSize: '0.72rem', p: 0 }}>
              Mark all read
            </Button>
          )}
        </Box>
        <List dense sx={{ p: 0, maxHeight: 380, overflow: 'auto' }}>
          {notifications.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsIcon sx={{ color: '#ddd', fontSize: 36, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No notifications</Typography>
            </Box>
          )}
          {notifications.map(notif => (
            <ListItem
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.claimId) navigateTo('claim-detail', notif.claimId);
                setAnchorEl(null);
              }}
              sx={{
                bgcolor: notif.read ? 'transparent' : '#EBF4FF',
                borderLeft: notif.read ? '3px solid transparent' : `3px solid ${BLUE}`,
                '&:hover': { bgcolor: '#F7F9FB', cursor: 'pointer' },
                alignItems: 'flex-start', py: 1.5, gap: 1,
              }}
            >
              <Box sx={{ mt: 0.2, flexShrink: 0 }}>{TYPE_ICON[notif.type]}</Box>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: notif.read ? 400 : 600, lineHeight: 1.4, color: '#1A252F' }}>
                    {notif.message}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: '0.7rem', color: '#90A4AE', mt: 0.3 }}>{notif.date}</Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </AppBar>
  );
}
