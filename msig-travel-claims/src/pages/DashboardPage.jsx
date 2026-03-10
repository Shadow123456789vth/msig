import {
  Box, Card, CardContent, Typography, Button, Chip, Divider,
  Avatar, List, ListItem, ListItemText, ListItemAvatar,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LuggageIcon from '@mui/icons-material/Luggage';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useClaim } from '../context/ClaimContext';
import { STATUS_COLORS } from '../data/demoData';

const STATUS_ICON = {
  'Settled':          <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 16 }} />,
  'Under Assessment': <HourglassEmptyIcon sx={{ color: '#1565C0', fontSize: 16 }} />,
  'Registered':       <HourglassEmptyIcon sx={{ color: '#00838F', fontSize: 16 }} />,
  'Pending Review':   <PendingIcon sx={{ color: '#ED6C02', fontSize: 16 }} />,
  'Submitted':        <PendingIcon sx={{ color: '#757575', fontSize: 16 }} />,
};

const TYPE_ICON = {
  'Personal Accident':   <LocalHospitalIcon sx={{ fontSize: 18 }} />,
  'Travel Inconvenience':<LuggageIcon sx={{ fontSize: 18 }} />,
  'Personal Liability':  <GavelIcon sx={{ fontSize: 18 }} />,
};

function isRealName(str) {
  return str && /[a-zA-Z]/.test(str);
}

export default function DashboardPage() {
  const { auth, claims, navigateTo, resetClaimForm, setActiveStep } = useClaim();

  const settled   = claims.filter(c => c.status === 'Settled').length;
  const pending   = claims.filter(c => ['Submitted','Registered','Under Assessment','Pending Review'].includes(c.status)).length;
  const stpCount  = claims.filter(c => c.stpStatus === 'STP').length;
  const totalClaimed  = claims.reduce((s, c) => s + (c.amountClaimed  || 0), 0);
  const totalApproved = claims.reduce((s, c) => s + (c.amountApproved || 0), 0);
  const approvalRate  = totalClaimed > 0 ? ((totalApproved / totalClaimed) * 100).toFixed(1) : 0;

  const displayName   = isRealName(auth.user?.name) ? auth.user.name.split(' ')[0] : 'Policyholder';
  const insuredPersons = (auth.policy?.insuredPersons || []).filter(isRealName);

  const handleNewClaim = () => {
    resetClaimForm();
    setActiveStep(0);
    navigateTo('new-claim');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #1565C0 60%, #1B75BB 100%)',
        borderRadius: 3, p: { xs: 2, md: 2.5 }, mb: 2.5, color: 'white',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.3 }}>
              Welcome back, {displayName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              {auth.policy?.policyNumber} · {auth.policy?.planType} · Valid until {auth.policy?.effectiveTo}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
              {auth.policy?.covers?.map(c => (
                <Chip key={c} label={c} size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.67rem', height: 20, border: '1px solid rgba(255,255,255,0.25)' }} />
              ))}
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleNewClaim}
            sx={{
              color: 'white', borderColor: 'white', borderWidth: 2, fontWeight: 700,
              flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.18)', borderColor: 'white', borderWidth: 2 },
            }}
          >
            File New Claim
          </Button>
        </Box>

        {/* Financial row inside banner */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, bgcolor: 'rgba(0,0,0,0.22)', borderRadius: 2, p: 1.5 }}>
          {[
            { label: 'Total Claimed',  value: `SGD ${(totalClaimed  / 1000).toFixed(1)}K`, color: '#90CAF9' },
            { label: 'Total Approved', value: `SGD ${(totalApproved / 1000).toFixed(1)}K`, color: '#A5D6A7' },
            { label: 'Approval Rate',  value: `${approvalRate}%`,                           color: '#80DEEA' },
          ].map(f => (
            <Box key={f.label} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.65rem', opacity: 0.7, display: 'block', mb: 0.2 }}>{f.label}</Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: f.color, lineHeight: 1 }}>{f.value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Stat Cards — 4 equal columns, always full width ────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2.5,
        '@media (max-width:599px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
      }}>
        {[
          { value: claims.length, label: 'Total Claims',  sub: 'All submissions',    color: '#1A1A2E' },
          { value: pending,       label: 'In Progress',   sub: 'Awaiting resolution', color: '#ED6C02' },
          { value: settled,       label: 'Settled',       sub: 'Successfully closed', color: '#2E7D32' },
          { value: stpCount,      label: 'STP Claims',    sub: 'Auto-processed',      color: '#1565C0' },
        ].map(s => (
          <Card key={s.label} variant="outlined">
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: s.color, lineHeight: 1, mb: 0.4 }}>{s.value}</Typography>
              <Typography variant="body2" fontWeight={700}>{s.label}</Typography>
              <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ── Main Content — 2 columns ────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5,
        '@media (min-width:900px)': { gridTemplateColumns: '2fr 1fr' },
      }}>

        {/* Recent Claims */}
        <Card variant="outlined">
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>Recent Claims</Typography>
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigateTo('claims-list')}
                sx={{ color: '#1B75BB', fontSize: '0.73rem', p: 0 }}>
                View All
              </Button>
            </Box>
            <List dense disablePadding>
              {claims.slice(0, 5).map((claim, idx) => (
                <Box key={claim.id}>
                  <ListItem
                    disablePadding
                    sx={{ py: 1, cursor: 'pointer', '&:hover': { bgcolor: '#F7F9FB' }, borderRadius: 1, px: 1 }}
                    onClick={() => navigateTo('claim-detail', claim.id)}
                  >
                    <ListItemAvatar sx={{ minWidth: 38 }}>
                      <Avatar sx={{ bgcolor: '#1B75BB10', color: '#1B75BB', width: 32, height: 32 }}>
                        {TYPE_ICON[claim.claimType?.[0]] || <FlightTakeoffIcon sx={{ fontSize: 16 }} />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#1B75BB' }}>{claim.id}</Typography>
                          <Chip label={claim.stpStatus || 'Manual'} size="small"
                            sx={{ height: 16, fontSize: '0.58rem', fontWeight: 700,
                              bgcolor: claim.stpStatus === 'STP' ? '#2E7D3215' : '#ED6C0215',
                              color:  claim.stpStatus === 'STP' ? '#2E7D32'   : '#ED6C02',
                            }} />
                          <Typography variant="caption" color="text.secondary">{claim.claimType?.join(', ')}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.2, alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">{claim.countryOfLoss}</Typography>
                          <Typography variant="caption" color="text.secondary">·</Typography>
                          <Typography variant="caption" fontWeight={600}>SGD {claim.amountClaimed?.toLocaleString()}</Typography>
                          <Typography variant="caption" color="text.secondary">· {claim.submittedDate}</Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      {STATUS_ICON[claim.status]}
                      <Typography variant="caption" sx={{ color: STATUS_COLORS[claim.status], fontWeight: 700, fontSize: '0.7rem' }}>
                        {claim.status}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx < Math.min(claims.length, 5) - 1 && <Divider sx={{ mx: 1 }} />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Right Panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Policy Details */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Policy Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
                {[
                  ['Policy No.',  auth.policy?.policyNumber],
                  ['Plan',        auth.policy?.planType],
                  ['Type',        auth.policy?.policyType],
                  ['Valid From',  auth.policy?.effectiveFrom],
                  ['Valid To',    auth.policy?.effectiveTo],
                  ['Sum Insured', `SGD ${auth.policy?.sumInsured?.toLocaleString()}`],
                ].map(([label, val]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="caption" fontWeight={700}>{val || '—'}</Typography>
                  </Box>
                ))}
              </Box>
              {insuredPersons.length > 0 && (
                <>
                  <Divider sx={{ my: 1.2 }} />
                  <Typography variant="caption" color="text.secondary"
                    sx={{ fontWeight: 700, display: 'block', mb: 0.8, textTransform: 'uppercase', fontSize: '0.63rem' }}>
                    Insured Persons
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {insuredPersons.map(name => (
                      <Chip key={name} label={name} size="small"
                        sx={{ bgcolor: '#f0f4ff', color: '#1565C0', fontWeight: 600, fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {[
                  { label: 'File New Claim',      onClick: handleNewClaim,                        color: '#1B75BB', icon: <AddCircleOutlineIcon sx={{ fontSize: 16 }} /> },
                  { label: 'View All Claims',      onClick: () => navigateTo('claims-list'),       color: '#1565C0', icon: <FlightTakeoffIcon    sx={{ fontSize: 16 }} /> },
                  { label: 'Claims Workbench',     onClick: () => navigateTo('workbench'),         color: '#6A1B9A', icon: <TrendingUpIcon        sx={{ fontSize: 16 }} /> },
                  { label: 'Analytics & Reports',  onClick: () => navigateTo('analytics'),         color: '#2E7D32', icon: <BarChartIcon          sx={{ fontSize: 16 }} /> },
                ].map(a => (
                  <Button key={a.label} variant="outlined" size="small"
                    startIcon={a.icon} endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    onClick={a.onClick}
                    sx={{ justifyContent: 'space-between', color: a.color, borderColor: `${a.color}30`, py: 0.8,
                      '&:hover': { borderColor: a.color, bgcolor: `${a.color}08` }, fontSize: '0.78rem' }}
                  >
                    {a.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

        </Box>
      </Box>
    </Box>
  );
}
