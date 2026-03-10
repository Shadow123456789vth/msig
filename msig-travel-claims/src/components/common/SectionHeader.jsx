import { Box, Typography, Chip } from '@mui/material';

export default function SectionHeader({ icon, title, subtitle, badge }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      {icon && (
        <Box sx={{
          bgcolor: '#1B75BB10',
          color: '#1B75BB',
          borderRadius: 2,
          p: 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ color: '#1A1A2E', fontWeight: 700 }}>{title}</Typography>
          {badge && <Chip label={badge} size="small" sx={{ bgcolor: '#1B75BB', color: 'white', height: 20, fontSize: '0.65rem' }} />}
        </Box>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </Box>
    </Box>
  );
}
