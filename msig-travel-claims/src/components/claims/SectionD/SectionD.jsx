import { useState } from 'react';
import {
  Box, Grid, TextField, Typography, Card, CardContent, FormControl,
  InputLabel, Select, MenuItem, RadioGroup, Radio, FormControlLabel,
  InputAdornment, Tabs, Tab, Alert
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import SectionHeader from '../../common/SectionHeader';

export default function SectionD({ data, onChange }) {
  const [tab, setTab] = useState(0);
  const [claimNoticeReceived, setClaimNoticeReceived] = useState(data.claimNoticeReceived || '');
  const [negligenceAdmitted, setNegligenceAdmitted] = useState(data.negligenceAdmitted || '');
  const today = new Date().toISOString().split('T')[0];

  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <Box>
      <SectionHeader
        icon={<GavelIcon />}
        title="Section D – Personal Liability Claims"
        subtitle="Report third-party property damage, injury, or rental vehicle excess claims"
        badge="Liability"
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} textColor="primary" indicatorColor="primary">
        <Tab label="Review Benefit" />
        <Tab label="Third-Party Report" />
        <Tab label="Rental Vehicle" />
      </Tabs>

      {tab === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Applicable Liability Benefits</Typography>
            <Grid container spacing={1.5}>
              {[
                { label: 'Personal Liability', limit: 'Up to SGD 1,000,000' },
                { label: 'Rental Vehicle Excess Cover', limit: 'Up to SGD 5,000' },
                { label: 'Additional Rental Car Return Costs', limit: 'Up to SGD 500' },
              ].map(b => (
                <Grid item xs={12} sm={6} key={b.label}>
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 1.5, bgcolor: '#f9f9f9' }}>
                    <Typography variant="body2" fontWeight={600}>{b.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{b.limit}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 2 }}>
              Proceed to the relevant tab to enter claim details.
            </Alert>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Third-Party Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Third Party Name *" fullWidth value={data.thirdPartyName || ''} onChange={e => update('thirdPartyName', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Third Party Address *" fullWidth value={data.thirdPartyAddress || ''} onChange={e => update('thirdPartyAddress', e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Details of Property Damage" fullWidth multiline rows={2} value={data.propertyDamageDetails || ''} onChange={e => update('propertyDamageDetails', e.target.value)} placeholder="Describe the property damaged and extent of damage" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Details of Third-Party Injuries" fullWidth multiline rows={2} value={data.injuryDetails || ''} onChange={e => update('injuryDetails', e.target.value)} placeholder="Describe any injuries sustained by the third party" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Legal & Negligence Declarations</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Have you received a third-party claim notice?</Typography>
                  <RadioGroup row value={claimNoticeReceived} onChange={e => { setClaimNoticeReceived(e.target.value); update('claimNoticeReceived', e.target.value); }}>
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                {claimNoticeReceived === 'Yes' && (
                  <Grid item xs={12}>
                    <TextField label="Correspondence / Documents Received (details)" fullWidth multiline rows={2} value={data.claimNoticeDetails || ''} onChange={e => update('claimNoticeDetails', e.target.value)} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Was there negligence on your part?</Typography>
                  <RadioGroup row value={negligenceAdmitted} onChange={e => { setNegligenceAdmitted(e.target.value); update('negligenceAdmitted', e.target.value); }}>
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                {negligenceAdmitted === 'Yes' && (
                  <Grid item xs={12}>
                    <TextField label="Reason for Negligence (optional)" fullWidth multiline rows={2} value={data.negligenceReason || ''} onChange={e => update('negligenceReason', e.target.value)} />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {tab === 2 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Rental Vehicle Claim Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type of Claim *</InputLabel>
                  <Select label="Type of Claim *" value={data.rentalClaimType || ''} onChange={e => update('rentalClaimType', e.target.value)}>
                    <MenuItem value="Rental Vehicle Excess Cover">Rental Vehicle Excess Cover</MenuItem>
                    <MenuItem value="Additional Costs of Rental Car Return">Additional Costs of Rental Car Return</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Vehicle Returned Date *" type="date" fullWidth value={data.vehicleReturnedDate || ''} onChange={e => update('vehicleReturnedDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Hire From Date *" type="date" fullWidth value={data.hireFromDate || ''} onChange={e => update('hireFromDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Hire To Date *" type="date" fullWidth value={data.hireToDate || ''} onChange={e => update('hireToDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: data.hireFromDate || '', max: today }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Amount to be Claimed (SGD) *" type="number" fullWidth value={data.rentalAmountClaimed || ''} onChange={e => update('rentalAmountClaimed', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Grid>
              {data.rentalClaimType === 'Additional Costs of Rental Car Return' && (
                <Grid item xs={12}>
                  <TextField label="Reason for Late Return" fullWidth multiline rows={2} value={data.lateReturnReason || ''} onChange={e => update('lateReturnReason', e.target.value)} />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
