import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Avatar, Tooltip, TablePagination,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LuggageIcon from '@mui/icons-material/Luggage';
import GavelIcon from '@mui/icons-material/Gavel';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useClaim } from '../context/ClaimContext';
import { STATUS_COLORS } from '../data/demoData';

const TYPE_ICON = {
  'Personal Accident': <LocalHospitalIcon sx={{ fontSize: 16 }} />,
  'Travel Inconvenience': <LuggageIcon sx={{ fontSize: 16 }} />,
  'Personal Liability': <GavelIcon sx={{ fontSize: 16 }} />,
  'COVID-19': <CoronavirusIcon sx={{ fontSize: 16 }} />,
};

export default function ClaimsListPage() {
  const { claims, navigateTo, resetClaimForm, setActiveStep } = useClaim();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;
  const isMobile = useMediaQuery('(max-width:700px)');

  const statuses = ['All', 'Submitted', 'Registered', 'Under Assessment', 'Pending Review', 'Settled'];

  const filtered = claims.filter(c => {
    const matchSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.insuredName.toLowerCase().includes(search.toLowerCase()) ||
      c.countryOfLoss.toLowerCase().includes(search.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleNewClaim = () => {
    resetClaimForm();
    setActiveStep(0);
    navigateTo('new-claim');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>My Claims</Typography>
          <Typography variant="body2" color="text.secondary">{claims.length} total claims across all policies</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleNewClaim}>
          File New Claim
        </Button>
      </Box>

      {/* Status Summary Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {statuses.map(s => {
          const count = s === 'All' ? claims.length : claims.filter(c => c.status === s).length;
          return (
            <Chip
              key={s}
              label={`${s} (${count})`}
              onClick={() => setStatusFilter(s)}
              sx={{
                bgcolor: statusFilter === s ? STATUS_COLORS[s] || '#1B75BB' : '#f5f5f5',
                color: statusFilter === s ? 'white' : '#333',
                fontWeight: statusFilter === s ? 700 : 400,
                cursor: 'pointer',
                '&:hover': { opacity: 0.85 },
              }}
            />
          );
        })}
      </Box>

      {/* Filters */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by claim ID, name, country, policy..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              size="small"
              sx={{ flex: 1, minWidth: 240 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#aaa' }} /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select label="Status Filter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
                {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Table / Card List */}
      {isMobile ? (
        <Card variant="outlined">
          {paginated.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center', color: '#aaa' }}>
              <Typography variant="body2">No claims found</Typography>
            </Box>
          )}
          {paginated.map(claim => (
            <Box key={claim.id} onClick={() => navigateTo('claim-detail', claim.id)} sx={{
              p: 2, borderBottom: '1px solid #F0F4F8', cursor: 'pointer',
              '&:hover': { bgcolor: '#F7F9FB' }, '&:last-child': { borderBottom: 'none' }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.8 }}>
                <Typography variant="body2" fontWeight={800} sx={{ color: '#1B75BB' }}>{claim.id}</Typography>
                <Chip label={claim.status} size="small" sx={{ bgcolor: `${STATUS_COLORS[claim.status]}20`, color: STATUS_COLORS[claim.status], fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
              </Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.3 }}>{claim.insuredName}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.8 }}>
                {claim.claimType?.map(t => (
                  <Chip key={t} label={t} size="small" sx={{ fontSize: '0.63rem', height: 18, bgcolor: '#f5f5f5' }} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">{claim.countryOfLoss} · {claim.submittedDate}</Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#1B75BB' }}>
                  SGD {claim.amountClaimed?.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          ))}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </Card>
      ) : (
        <Card variant="outlined">
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  {['Claim Reference', 'Policy / Insured', 'Claim Type', 'Country', 'Date Submitted', 'Amount Claimed', 'STP / NSTP', 'Status', ''].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap', color: '#555' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: '#aaa' }}>No claims found</TableCell>
                  </TableRow>
                )}
                {paginated.map(claim => (
                  <TableRow
                    key={claim.id}
                    hover
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#fafafa' } }}
                    onClick={() => navigateTo('claim-detail', claim.id)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#1B75BB' }}>{claim.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{claim.insuredName}</Typography>
                      <Typography variant="caption" color="text.secondary">{claim.policyNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {claim.claimType?.map(t => (
                          <Chip
                            key={t}
                            icon={TYPE_ICON[t]}
                            label={t}
                            size="small"
                            sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#f5f5f5' }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{claim.countryOfLoss}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{claim.submittedDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        SGD {claim.amountClaimed?.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                      </Typography>
                      {claim.amountApproved && (
                        <Typography variant="caption" sx={{ color: '#2E7D32' }}>
                          Approved: SGD {claim.amountApproved?.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={claim.stpStatus}
                        size="small"
                        sx={{
                          height: 20, fontSize: '0.65rem', fontWeight: 700,
                          bgcolor: claim.stpStatus === 'STP' ? '#2E7D3215' : claim.stpStatus === 'NSTP' ? '#ED6C0215' : '#1565C015',
                          color: claim.stpStatus === 'STP' ? '#2E7D32' : claim.stpStatus === 'NSTP' ? '#ED6C02' : '#1565C0',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={claim.status}
                        size="small"
                        sx={{
                          bgcolor: `${STATUS_COLORS[claim.status]}20`,
                          color: STATUS_COLORS[claim.status],
                          fontWeight: 700, fontSize: '0.68rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#1B75BB10', cursor: 'pointer' }}>
                          <OpenInNewIcon sx={{ fontSize: 14, color: '#1B75BB' }} />
                        </Avatar>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </Card>
      )}
    </Box>
  );
}
