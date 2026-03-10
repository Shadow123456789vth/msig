import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Divider,
  Table, TableHead, TableRow, TableCell, TableBody, LinearProgress,
  Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Tabs, Tab, Alert, Tooltip, IconButton,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GavelIcon from '@mui/icons-material/Gavel';
import { useClaim } from '../context/ClaimContext';
import { ANALYTICS, STATUS_COLORS } from '../data/demoData';

// ── Static report data ────────────────────────────────────────────────────────
const DOC_ACCURACY = [
  { type: 'Medical Certificate',  high: 85, medium: 12, low: 3,  total: 47, trend: +2 },
  { type: 'PCR Test Result',      high: 92, medium:  6, low: 2,  total: 23, trend: +1 },
  { type: 'Receipt / Invoice',    high: 71, medium: 22, low: 7,  total: 68, trend: -3 },
  { type: 'Police Report',        high: 68, medium: 25, low: 7,  total: 12, trend: +4 },
  { type: 'Repair Estimate',      high: 45, medium: 35, low: 20, total:  8, trend: -5 },
  { type: 'Passport / ID',        high: 94, medium:  5, low: 1,  total: 31, trend:  0 },
  { type: 'Flight Itinerary',     high: 88, medium: 10, low: 2,  total: 19, trend: +1 },
];

const ACC_TREND = [
  { month: 'Jul 24', overall: 87, high: 60, medium: 28, low: 12 },
  { month: 'Aug 24', overall: 88, high: 61, medium: 28, low: 11 },
  { month: 'Sep 24', overall: 87, high: 60, medium: 27, low: 13 },
  { month: 'Oct 24', overall: 89, high: 63, medium: 27, low: 10 },
  { month: 'Nov 24', overall: 90, high: 64, medium: 26, low: 10 },
  { month: 'Dec 24', overall: 90, high: 62, medium: 28, low: 10 },
];

const SLA_TABLE = [
  { id: 'CLM-2024-100291', handler: 'STP Automation',       tier: 'System',          type: 'Personal Accident',   submitted: '2024-11-10', decided: '2024-11-10', days: 0.1, slaTarget: 3, decision: 'Approved',      breach: false },
  { id: 'CLM-2024-100387', handler: 'Officer Priya Sharma', tier: 'Claims Officer',  type: 'COVID-19',            submitted: '2024-12-01', decided: '—',          days: null, slaTarget: 5, decision: 'Under Review',  breach: false },
  { id: 'CLM-2024-100451', handler: 'STP Automation',       tier: 'System',          type: 'Travel Inconvenience',submitted: '2024-12-10', decided: '2024-12-10', days: 0.2, slaTarget: 3, decision: 'Registered',    breach: false },
  { id: 'CLM-2024-100502', handler: 'Mgr Lee Boon Hwa',     tier: 'Claims Manager',  type: 'Personal Liability',  submitted: '2024-12-15', decided: '—',          days: null, slaTarget: 7, decision: 'Pending Review',breach: false },
  { id: 'CLM-2025-100003', handler: 'STP Automation',       tier: 'System',          type: 'Travel Inconvenience',submitted: '2025-01-08', decided: '—',          days: null, slaTarget: 3, decision: 'Processing',    breach: false },
];

const OFFICERS = ['All', 'STP Automation', 'Officer Priya Sharma', 'Mgr Lee Boon Hwa'];
const CLAIM_TYPES = ['All', 'Personal Accident', 'COVID-19', 'Travel Inconvenience', 'Personal Liability'];
const PLANS = ['All', 'Travel Easy Plus', 'Travel Easy Basic', 'Travel Easy Premier'];
const STATUSES = ['All', 'Submitted', 'Registered', 'Under Assessment', 'Pending Review', 'Settled'];

// ── Mini helpers ──────────────────────────────────────────────────────────────
function MiniBar({ data, valueKey, labelKey, colorKey }) {
  const max = Math.max(...data.map(d => d[valueKey])) || 1;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
      {data.map(item => (
        <Box key={item[labelKey]}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
            <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{item[labelKey]}</Typography>
            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem' }}>{item[valueKey]}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={(item[valueKey] / max) * 100}
            sx={{ height: 8, borderRadius: 4, bgcolor: '#EEF2F6',
              '& .MuiLinearProgress-bar': { bgcolor: item[colorKey] || '#1B75BB', borderRadius: 4 } }} />
        </Box>
      ))}
    </Box>
  );
}

function TrendBars({ data }) {
  const max = Math.max(...data.map(d => d.claims)) || 1;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.8, height: 80 }}>
      {data.map(d => (
        <Box key={d.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: '100%', position: 'relative', height: 62, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Box sx={{ bgcolor: '#1B75BB25', borderRadius: '3px 3px 0 0', height: `${(d.claims / max) * 100}%`, width: '100%', minHeight: 4 }} />
            <Box sx={{ bgcolor: '#2E7D32', borderRadius: '3px 3px 0 0', height: `${(d.settled / max) * 100}%`, width: '55%', minHeight: 2, position: 'absolute', bottom: 0, left: '22.5%' }} />
          </Box>
          <Typography variant="caption" sx={{ fontSize: '0.58rem', color: '#90A4AE', mt: 0.3 }}>{d.month}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function AccTrendBars({ data }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 90 }}>
      {data.map(d => (
        <Box key={d.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#1B75BB', mb: 0.3 }}>{d.overall}%</Typography>
          <Box sx={{ width: '100%', height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '3px 3px 0 0', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: '#E74C3C', height: `${d.low}%`, width: '100%', minHeight: d.low > 0 ? 2 : 0 }} />
            <Box sx={{ bgcolor: '#F39C12', height: `${d.medium}%`, width: '100%' }} />
            <Box sx={{ bgcolor: '#27AE60', height: `${d.high}%`, width: '100%' }} />
          </Box>
          <Typography variant="caption" sx={{ fontSize: '0.58rem', color: '#90A4AE', mt: 0.3 }}>{d.month}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function FilterSelect({ label, value, onChange, options, width = 150 }) {
  return (
    <FormControl size="small" sx={{ minWidth: width }}>
      <InputLabel sx={{ fontSize: '0.78rem' }}>{label}</InputLabel>
      <Select value={value} onChange={e => onChange(e.target.value)} label={label}
        sx={{ fontSize: '0.78rem', '& .MuiSelect-select': { py: 0.8 } }}>
        {options.map(o => <MenuItem key={o} value={o} sx={{ fontSize: '0.78rem' }}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

function exportCSV(rows, cols, filename) {
  const header = cols.join(',');
  const body = rows.map(r => cols.map(c => `"${r[c] ?? ''}"`).join(',')).join('\n');
  const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { claims } = useClaim();

  const [tab, setTab] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshSec, setRefreshSec] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState(15);

  // RPT-01 filters
  const [f1, setF1] = useState({ dateFrom: '2024-01-01', dateTo: '2025-12-31', plan: 'All', status: 'All' });
  // RPT-02 filters
  const [accPeriod, setAccPeriod] = useState('6M');
  const [threshold, setThreshold] = useState(70);
  // RPT-03 filters
  const [f3, setF3] = useState({ officer: 'All', dateFrom: '', dateTo: '', claimType: 'All' });

  // Live refresh counter
  useEffect(() => {
    const t = setInterval(() => setRefreshSec(s => s + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => { setLastRefresh(new Date()); setRefreshSec(0); };

  // Derived metrics
  const totalClaimed  = claims.reduce((s, c) => s + (c.amountClaimed  || 0), 0);
  const totalApproved = claims.reduce((s, c) => s + (c.amountApproved || 0), 0);
  const stpRate       = claims.length > 0 ? (claims.filter(c => c.stpStatus === 'STP').length / claims.length * 100).toFixed(1) : 0;
  const settled       = claims.filter(c => c.status === 'Settled').length;

  const byStatus = Object.entries(
    claims.reduce((a, c) => { a[c.status] = (a[c.status] || 0) + 1; return a; }, {})
  ).map(([status, count]) => ({ status, count, color: STATUS_COLORS[status] || '#aaa' }));

  const byType = Object.entries(
    claims.flatMap(c => c.claimType || []).reduce((a, t) => { a[t] = (a[t] || 0) + 1; return a; }, {})
  ).map(([type, count], i) => ({ type, count, color: ['#1B75BB','#1565C0','#2E7D32','#00838F'][i % 4] }));

  const stpVsNstp = [
    { label: 'STP',  count: claims.filter(c => c.stpStatus === 'STP').length,  color: '#2E7D32' },
    { label: 'NSTP', count: claims.filter(c => c.stpStatus === 'NSTP').length, color: '#ED6C02' },
    { label: 'Processing', count: claims.filter(c => !['STP','NSTP'].includes(c.stpStatus)).length, color: '#1565C0' },
  ];

  // Filtered SLA data
  const slaFiltered = SLA_TABLE.filter(r =>
    (f3.officer   === 'All' || r.handler  === f3.officer) &&
    (f3.claimType === 'All' || r.type === f3.claimType) &&
    (!f3.dateFrom || r.submitted >= f3.dateFrom) &&
    (!f3.dateTo   || r.submitted <= f3.dateTo)
  );

  const breachCount = slaFiltered.filter(r => r.breach).length;

  // Alerts for accuracy
  const accuracyAlerts = DOC_ACCURACY.filter(d => d.high < threshold);
  const trendData = accPeriod === '3M' ? ACC_TREND.slice(-3) : accPeriod === '6M' ? ACC_TREND : ACC_TREND.slice(-3);

  const KPIS = [
    { label: 'Total Claims',    value: claims.length,                          color: '#1A1A2E', sub: 'All submissions'    },
    { label: 'STP Rate',        value: `${stpRate}%`,                          color: '#2E7D32', sub: 'Auto-processed'     },
    { label: 'Avg. Processing', value: `${ANALYTICS.avgProcessingDays}d`,      color: '#1565C0', sub: 'Days to settle'     },
    { label: 'Total Claimed',   value: `SGD ${(totalClaimed/1000).toFixed(1)}K`, color: '#1B75BB', sub: 'Cumulative'      },
    { label: 'Total Approved',  value: `SGD ${(totalApproved/1000).toFixed(1)}K`, color: '#2E7D32', sub: 'Net payable'    },
    { label: 'Approval Rate',   value: totalClaimed > 0 ? `${((totalApproved/totalClaimed)*100).toFixed(1)}%` : '—', color: '#00838F', sub: 'Approved vs Claimed' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartIcon sx={{ color: '#1B75BB' }} /> Analytics & Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            3 dashboards in scope · Powered by DXC Assure Insights (Sisense) · Real-time operational metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip label="DXC Assure Insights" size="small" sx={{ bgcolor: '#1B75BB10', color: '#1B75BB', fontWeight: 700, fontSize: '0.7rem' }} />
          <Button variant="outlined" size="small" startIcon={<DownloadIcon />}
            sx={{ color: '#1B75BB', borderColor: '#1B75BB', fontSize: '0.78rem' }}>
            Export Report
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5 }} textColor="primary" indicatorColor="primary" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
        <Tab label="Claims Dashboard" icon={<BarChartIcon sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 44, fontSize: '0.82rem' }} />
        <Tab label="AI Accuracy Report" icon={<PsychologyIcon sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 44, fontSize: '0.82rem' }} />
        <Tab label="SLA Compliance" icon={<GavelIcon sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 44, fontSize: '0.82rem' }} />
      </Tabs>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 0 — Claims Processing Dashboard (US-RPT-01)
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 0 && (
        <Box>
          {/* Filter Bar */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <FilterListIcon sx={{ color: '#607D8B', fontSize: 18 }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>Filters</Typography>
                <TextField size="small" label="Date From" type="date" value={f1.dateFrom}
                  onChange={e => setF1(p => ({...p, dateFrom: e.target.value}))}
                  InputLabelProps={{ shrink: true }} sx={{ '& input': { fontSize: '0.78rem', py: 0.8 }, minWidth: 140 }} />
                <TextField size="small" label="Date To" type="date" value={f1.dateTo}
                  onChange={e => setF1(p => ({...p, dateTo: e.target.value}))}
                  InputLabelProps={{ shrink: true }} sx={{ '& input': { fontSize: '0.78rem', py: 0.8 }, minWidth: 140 }} />
                <FilterSelect label="Plan Type" value={f1.plan} onChange={v => setF1(p => ({...p, plan: v}))} options={PLANS} />
                <FilterSelect label="Claim Status" value={f1.status} onChange={v => setF1(p => ({...p, status: v}))} options={STATUSES} />
                <Box sx={{ flex: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                    Refreshed {refreshSec === 0 ? 'just now' : `${refreshSec}m ago`}
                  </Typography>
                  <Tooltip title={`Auto-refresh: every ${refreshInterval} min`}>
                    <IconButton size="small" onClick={handleRefresh} sx={{ bgcolor: '#1B75BB10', '&:hover': { bgcolor: '#1B75BB20' } }}>
                      <RefreshIcon sx={{ fontSize: 16, color: '#1B75BB' }} />
                    </IconButton>
                  </Tooltip>
                  <FormControl size="small" sx={{ minWidth: 90 }}>
                    <Select value={refreshInterval} onChange={e => setRefreshInterval(e.target.value)}
                      sx={{ fontSize: '0.72rem', '& .MuiSelect-select': { py: 0.6 } }}>
                      {[5,10,15,30,60].map(v => <MenuItem key={v} value={v} sx={{ fontSize: '0.72rem' }}>{v} min</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* KPI Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1.5, mb: 2,
            '@media (max-width:1100px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
            '@media (max-width:599px)':  { gridTemplateColumns: 'repeat(2, 1fr)' },
          }}>
            {KPIS.map(k => (
              <Card key={k.label} variant="outlined">
                <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="h5" fontWeight={800} sx={{ color: k.color, lineHeight: 1 }}>{k.value}</Typography>
                  <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mt: 0.3, fontSize: '0.71rem' }}>{k.label}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.63rem' }}>{k.sub}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Charts Grid — 4 equal cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
            '@media (max-width:1100px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
            '@media (max-width:599px)':  { gridTemplateColumns: '1fr' },
          }}>
            {/* Claims by Status */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Claims by Status</Typography>
                <MiniBar data={byStatus} valueKey="count" labelKey="status" colorKey="color" />
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {byStatus.map(s => (
                    <Chip key={s.status} label={`${s.status}: ${s.count}`} size="small"
                      sx={{ bgcolor: `${s.color}15`, color: s.color, fontSize: '0.6rem', height: 18, fontWeight: 600 }} />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* STP vs NSTP */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>STP vs NSTP Split</Typography>
                <MiniBar data={stpVsNstp} valueKey="count" labelKey="label" colorKey="color" />
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {stpVsNstp.map(s => (
                    <Box key={s.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: s.color, fontWeight: 700, fontSize: '0.72rem' }}>{s.label}</Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem' }}>
                        {claims.length > 0 ? `${((s.count / claims.length) * 100).toFixed(0)}%` : '—'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Claims by Risk Type */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Claims by Risk Type</Typography>
                <MiniBar data={byType} valueKey="count" labelKey="type" colorKey="color" />
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Monthly Claims Trend</Typography>
                <TrendBars data={ANALYTICS.monthlyTrend} />
                <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#1B75BB25', borderRadius: 1 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.68rem' }}>Submitted</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#2E7D32', borderRadius: 1 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.68rem' }}>Settled</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
              Powered by DXC Assure Insights (Sisense) · Configurable refresh interval · All data is live from ServiceNow FSO
            </Typography>
          </Box>
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1 — AI Extraction Accuracy Report (US-RPT-02)
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 1 && (
        <Box>
          {/* Filter + Export */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <FilterListIcon sx={{ color: '#607D8B', fontSize: 18 }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>Period</Typography>
                {['3M','6M'].map(p => (
                  <Chip key={p} label={p} size="small" onClick={() => setAccPeriod(p)}
                    sx={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.7rem',
                      bgcolor: accPeriod === p ? '#1B75BB' : '#f5f5f5',
                      color:   accPeriod === p ? 'white'   : '#555',
                    }} />
                ))}
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Alert threshold</Typography>
                <TextField size="small" type="number" value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  sx={{ width: 70, '& input': { fontSize: '0.78rem', py: 0.6, textAlign: 'center' } }}
                  InputProps={{ endAdornment: <Typography variant="caption">%</Typography> }} />
                <Box sx={{ flex: 1 }} />
                <Button size="small" variant="outlined" startIcon={<DownloadIcon />}
                  onClick={() => exportCSV(DOC_ACCURACY, ['type','high','medium','low','total','trend'], 'ai_accuracy_report.csv')}
                  sx={{ color: '#1B75BB', borderColor: '#1B75BB', fontSize: '0.72rem' }}>
                  Export CSV
                </Button>
                <Button size="small" variant="outlined" startIcon={<DownloadIcon />}
                  onClick={() => window.print()}
                  sx={{ color: '#607D8B', borderColor: '#ccc', fontSize: '0.72rem' }}>
                  Export PDF
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Threshold Alerts */}
          {accuracyAlerts.length > 0 && (
            <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 2, py: 0.8 }}>
              <Typography variant="caption" fontWeight={700}>
                {accuracyAlerts.length} document type(s) below {threshold}% High confidence threshold:&nbsp;
                {accuracyAlerts.map(a => a.type).join(', ')}
              </Typography>
            </Alert>
          )}

          {/* Two column layout */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 2,
            '@media (max-width:899px)': { gridTemplateColumns: '1fr' } }}>

            {/* Confidence table by doc type */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>Extraction Confidence by Document Type</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[['#27AE60','High'],['#F39C12','Med'],['#E74C3C','Low']].map(([c,l]) => (
                      <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: c, borderRadius: 1 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>{l}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small" sx={{ '& td, & th': { py: 0.7, px: 1 } }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F7F9FB' }}>
                        {['Document Type','High %','Medium %','Low %','Total Docs','30d Trend'].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {DOC_ACCURACY.map(row => {
                        const alert = row.high < threshold;
                        return (
                          <TableRow key={row.type} sx={{ bgcolor: alert ? '#FFF8F6' : 'transparent' }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {alert && <WarningAmberIcon sx={{ color: '#ED6C02', fontSize: 14 }} />}
                                <Typography variant="caption" fontWeight={alert ? 700 : 400} sx={{ fontSize: '0.78rem' }}>{row.type}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <LinearProgress variant="determinate" value={row.high}
                                  sx={{ width: 40, height: 5, borderRadius: 3, '& .MuiLinearProgress-bar': { bgcolor: '#27AE60' } }} />
                                <Typography variant="caption" fontWeight={700} sx={{ color: '#27AE60', fontSize: '0.72rem' }}>{row.high}%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" sx={{ color: '#F39C12', fontWeight: 600, fontSize: '0.72rem' }}>{row.medium}%</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" sx={{ color: '#E74C3C', fontWeight: 600, fontSize: '0.72rem' }}>{row.low}%</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{row.total}</Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                {row.trend > 0
                                  ? <TrendingUpIcon sx={{ fontSize: 14, color: '#27AE60' }} />
                                  : row.trend < 0
                                    ? <TrendingDownIcon sx={{ fontSize: 14, color: '#E74C3C' }} />
                                    : null}
                                <Typography variant="caption" fontWeight={700}
                                  sx={{ color: row.trend > 0 ? '#27AE60' : row.trend < 0 ? '#E74C3C' : '#888', fontSize: '0.72rem' }}>
                                  {row.trend > 0 ? `+${row.trend}%` : row.trend < 0 ? `${row.trend}%` : '—'}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>

            {/* Trend chart + overall */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card variant="outlined">
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                    Overall Accuracy Trend ({accPeriod})
                  </Typography>
                  <AccTrendBars data={trendData} />
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap' }}>
                    {[['#27AE60','High'],['#F39C12','Medium'],['#E74C3C','Low']].map(([c,l]) => (
                      <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <Box sx={{ width: 10, height: 10, bgcolor: c, borderRadius: 1 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.68rem' }}>{l}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Summary</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {[
                      { label: 'Overall IDP Accuracy',  value: '90%',         color: '#27AE60' },
                      { label: 'Total Docs Processed',  value: `${DOC_ACCURACY.reduce((s,d)=>s+d.total,0)}`,  color: '#1B75BB' },
                      { label: 'Types Below Threshold', value: `${accuracyAlerts.length}`,  color: accuracyAlerts.length > 0 ? '#E74C3C' : '#27AE60' },
                      { label: 'Avg High Confidence',   value: `${(DOC_ACCURACY.reduce((s,d)=>s+d.high,0)/DOC_ACCURACY.length).toFixed(0)}%`, color: '#1565C0' },
                    ].map(s => (
                      <Box key={s.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                        <Typography variant="caption" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Alert severity="info" sx={{ mt: 1.5, py: 0.5 }}>
                    <Typography variant="caption">
                      Low-confidence fields are flagged for manual officer review in the workbench.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2 — SLA Compliance Report (US-RPT-03)
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 2 && (
        <Box>
          {/* Filter Bar */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <FilterListIcon sx={{ color: '#607D8B', fontSize: 18 }} />
                <FilterSelect label="Handler" value={f3.officer} onChange={v => setF3(p=>({...p, officer: v}))} options={OFFICERS} width={180} />
                <FilterSelect label="Claim Type" value={f3.claimType} onChange={v => setF3(p=>({...p, claimType: v}))} options={CLAIM_TYPES} width={170} />
                <TextField size="small" label="Date From" type="date" value={f3.dateFrom}
                  onChange={e => setF3(p=>({...p, dateFrom: e.target.value}))}
                  InputLabelProps={{ shrink: true }} sx={{ '& input': { fontSize: '0.78rem', py: 0.8 }, minWidth: 140 }} />
                <TextField size="small" label="Date To" type="date" value={f3.dateTo}
                  onChange={e => setF3(p=>({...p, dateTo: e.target.value}))}
                  InputLabelProps={{ shrink: true }} sx={{ '& input': { fontSize: '0.78rem', py: 0.8 }, minWidth: 140 }} />
                <Box sx={{ flex: 1 }} />
                <Button size="small" variant="outlined" startIcon={<DownloadIcon />}
                  onClick={() => exportCSV(slaFiltered, ['id','handler','tier','type','submitted','decided','days','slaTarget','decision','breach'], 'sla_report.csv')}
                  sx={{ color: '#1B75BB', borderColor: '#1B75BB', fontSize: '0.72rem' }}>
                  Export CSV
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* SLA Summary KPIs */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, mb: 2,
            '@media (max-width:599px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
            {[
              { label: 'Total in Period',  value: slaFiltered.length,                                         color: '#1A1A2E' },
              { label: 'SLA Compliant',    value: slaFiltered.filter(r => !r.breach).length,                  color: '#27AE60' },
              { label: 'SLA Breaches',     value: breachCount,                                                color: breachCount > 0 ? '#E74C3C' : '#27AE60' },
              { label: 'Compliance Rate',  value: slaFiltered.length > 0 ? `${(((slaFiltered.length - breachCount) / slaFiltered.length) * 100).toFixed(0)}%` : '—', color: '#1565C0' },
            ].map(s => (
              <Card key={s.label} variant="outlined">
                <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: s.color, lineHeight: 1, mb: 0.3 }}>{s.value}</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.78rem' }}>{s.label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {breachCount === 0 && (
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, py: 0.5 }}>
              <Typography variant="caption" fontWeight={700}>All claims within SLA targets for the selected period.</Typography>
            </Alert>
          )}

          {/* SLA Table */}
          <Card variant="outlined">
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F7F9FB' }}>
                    {['Claim ID','Handler','Authority Tier','Claim Type','Submitted','Decision Date','Time-to-Decision','SLA Target','Decision','SLA Status'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slaFiltered.map(row => (
                    <TableRow key={row.id}
                      sx={{ bgcolor: row.breach ? '#FFF5F5' : 'transparent',
                        '&:hover': { bgcolor: row.breach ? '#FFECEC' : '#F7FAFD' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#1B75BB', fontSize: '0.78rem' }}>{row.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>{row.handler}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={row.tier} size="small"
                          sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700,
                            bgcolor: row.tier === 'System' ? '#1B75BB10' : row.tier === 'Claims Manager' ? '#6A1B9A10' : '#2E7D3210',
                            color:   row.tier === 'System' ? '#1B75BB'   : row.tier === 'Claims Manager' ? '#6A1B9A'   : '#2E7D32',
                          }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{row.type}</Typography>
                      </TableCell>
                      <TableCell><Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{row.submitted}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{row.decided}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight={700}
                          sx={{ fontSize: '0.72rem', color: row.days !== null ? '#1B75BB' : '#90A4AE' }}>
                          {row.days !== null ? `${row.days}d` : 'In Progress'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.72rem', color: '#607D8B' }}>{row.slaTarget}d</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={row.decision} size="small"
                          sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700,
                            bgcolor: row.decision === 'Approved' ? '#2E7D3215' : '#1B75BB10',
                            color:   row.decision === 'Approved' ? '#2E7D32'   : '#1B75BB',
                          }} />
                      </TableCell>
                      <TableCell>
                        {row.breach
                          ? <Chip label="BREACH" size="small" color="error" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
                          : row.days === null
                            ? <Chip label="Pending" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#1565C010', color: '#1565C0' }} />
                            : <Chip label="Compliant" size="small" icon={<CheckCircleIcon sx={{ fontSize: '10px !important' }} />} color="success" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                  {slaFiltered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="body2" color="text.secondary">No records match the selected filters.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ px: 2, py: 1, borderTop: '1px solid #EEF2F6' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                Filterable by handler, date range, and claim type · Powered by DXC Assure Insights (Sisense) · {slaFiltered.length} record(s) shown
              </Typography>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
}
