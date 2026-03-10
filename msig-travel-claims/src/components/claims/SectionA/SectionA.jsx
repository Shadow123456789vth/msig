import { useState } from 'react';
import {
  Box, Grid, TextField, Typography, FormControlLabel, Switch, Card, CardContent,
  MenuItem, Divider, Alert, InputAdornment, FormControl, InputLabel, Select,
  Checkbox, FormGroup, Chip
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import InfoIcon from '@mui/icons-material/Info';
import SectionHeader from '../../common/SectionHeader';
import { useClaim } from '../../../context/ClaimContext';

const COUNTRIES = [
  'Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Japan', 'South Korea',
  'Australia', 'United Kingdom', 'United States', 'France', 'Germany',
  'Italy', 'Spain', 'China', 'India', 'Vietnam', 'Philippines', 'Taiwan',
  'Hong Kong', 'New Zealand', 'Canada', 'Switzerland', 'Netherlands', 'Others',
];

const RISK_COVERS = [
  { key: 'sectionB', label: 'Section B – Personal Accident', color: '#1565C0' },
  { key: 'sectionC', label: 'Section C – Travel Inconvenience', color: '#2E7D32' },
  { key: 'sectionD', label: 'Section D – Personal Liability', color: '#6A1B9A' },
  { key: 'sectionE', label: 'Section E – COVID-19', color: '#00838F' },
];

export default function SectionA({ data, onChange, claimData, updateSection }) {
  const [otherInsurance, setOtherInsurance] = useState(data.otherInsurance || false);
  const [otherSources, setOtherSources] = useState(data.otherSources || false);
  const [previousClaims, setPreviousClaims] = useState(data.previousClaims || false);

  const handleChange = (field, value) => onChange({ ...data, [field]: value });

  const toggleSection = (key, enabled) => {
    updateSection(key, { enabled });
  };

  return (
    <Box>
      <SectionHeader
        icon={<FlightTakeoffIcon />}
        title="Section A – Claim Notification & Shared Details"
        subtitle="Enter common claim details applicable to all selected risk covers"
        badge="Required"
      />

      {/* Risk Cover Selection */}
      <Card variant="outlined" sx={{ mb: 3, borderColor: '#1B75BB40' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1B75BB', fontWeight: 700 }}>
            Select Risk Cover(s) to Claim
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select all risk sections applicable to your claim. Each selected section will unlock the corresponding claim form.
          </Typography>
          <Grid container spacing={1.5}>
            {RISK_COVERS.map(({ key, label, color }) => (
              <Grid item xs={12} sm={6} key={key}>
                <Box
                  onClick={() => toggleSection(key, !claimData[key]?.enabled)}
                  sx={{
                    border: `2px solid ${claimData[key]?.enabled ? color : '#e0e0e0'}`,
                    borderRadius: 2,
                    p: 1.5,
                    cursor: 'pointer',
                    bgcolor: claimData[key]?.enabled ? `${color}10` : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: color, bgcolor: `${color}08` },
                  }}
                >
                  <Checkbox
                    checked={!!claimData[key]?.enabled}
                    sx={{ p: 0, color: color, '&.Mui-checked': { color } }}
                    onChange={() => {}}
                  />
                  <Typography variant="body2" fontWeight={500} sx={{ color: claimData[key]?.enabled ? color : '#333' }}>
                    {label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Travel Dates & Incident Details */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Travel & Incident Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Period of Travel – From *"
                type="date"
                fullWidth
                value={data.travelFrom || ''}
                onChange={e => handleChange('travelFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Period of Travel – To *"
                type="date"
                fullWidth
                value={data.travelTo || ''}
                onChange={e => handleChange('travelTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: data.travelFrom || '' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Country of Loss *</InputLabel>
                <Select
                  label="Country of Loss *"
                  value={data.countryOfLoss || ''}
                  onChange={e => handleChange('countryOfLoss', e.target.value)}
                >
                  {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Accident / Incident Location *"
                fullWidth
                value={data.accidentLocation || ''}
                onChange={e => handleChange('accidentLocation', e.target.value)}
                placeholder="e.g. Hotel lobby, Airport"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Brief Description of Loss *"
                fullWidth
                value={data.lossDescription || ''}
                onChange={e => handleChange('lossDescription', e.target.value)}
                placeholder="Short summary of what happened"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detailed Description of Loss *"
                fullWidth
                multiline
                rows={3}
                value={data.detailedDescription || ''}
                onChange={e => handleChange('detailedDescription', e.target.value)}
                placeholder="Provide a full account of the incident including dates, times, and circumstances"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Other Insurance */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Other Insurance Declaration
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={otherInsurance}
                  onChange={e => {
                    setOtherInsurance(e.target.checked);
                    handleChange('otherInsurance', e.target.checked);
                  }}
                  color="primary"
                />
              }
              label={<Typography variant="body2">{otherInsurance ? 'Yes' : 'No'}</Typography>}
              labelPlacement="start"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Do you have other insurance covering this incident?
          </Typography>
          {otherInsurance && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Other Policy Number"
                  fullWidth
                  value={data.otherPolicyNumber || ''}
                  onChange={e => handleChange('otherPolicyNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Other Insurance Company Name"
                  fullWidth
                  value={data.otherInsuranceCompany || ''}
                  onChange={e => handleChange('otherInsuranceCompany', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Other Sources of Claim */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Other Sources of Claim
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={otherSources}
                  onChange={e => {
                    setOtherSources(e.target.checked);
                    handleChange('otherSources', e.target.checked);
                  }}
                  color="primary"
                />
              }
              label={<Typography variant="body2">{otherSources ? 'Yes' : 'No'}</Typography>}
              labelPlacement="start"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you claiming the same loss from other sources (e.g., airlines, employer)?
          </Typography>
          {otherSources && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount Claimed from Other Sources (SGD)"
                  fullWidth
                  type="number"
                  value={data.otherSourcesAmount || ''}
                  onChange={e => handleChange('otherSourcesAmount', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Other Sources"
                  fullWidth
                  value={data.otherSourcesDetails || ''}
                  onChange={e => handleChange('otherSourcesDetails', e.target.value)}
                  placeholder="e.g. Airlines, Employer, Credit Card"
                />
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Any previous Travel Insurance claims for same condition?
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={previousClaims}
                  onChange={e => {
                    setPreviousClaims(e.target.checked);
                    handleChange('previousClaims', e.target.checked);
                  }}
                  color="primary"
                />
              }
              label={<Typography variant="body2">{previousClaims ? 'Yes' : 'No'}</Typography>}
              labelPlacement="start"
            />
          </Box>
          {previousClaims && (
            <TextField
              label="Previous Claims Details"
              fullWidth
              multiline
              rows={2}
              value={data.previousClaimsDetails || ''}
              onChange={e => handleChange('previousClaimsDetails', e.target.value)}
              placeholder="Provide reference numbers and details of previous claims"
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card variant="outlined" sx={{ mb: 3, borderColor: '#2E7D3230' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700}>Payment Details (PayNow)</Typography>
            <Chip label="Encrypted" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
          </Box>
          <Alert severity="info" sx={{ mb: 2 }} icon={<InfoIcon />}>
            Approved claim payments will be disbursed to your PayNow account. Your details are encrypted at rest.
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PayNow Mobile Number / UEN"
                fullWidth
                value={data.payNowNumber || ''}
                onChange={e => handleChange('payNowNumber', e.target.value)}
                placeholder="e.g. 91234567 or 201234567A"
                InputProps={{ startAdornment: <InputAdornment position="start">+65</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Holder Name"
                fullWidth
                value={data.accountHolderName || ''}
                onChange={e => handleChange('accountHolderName', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
