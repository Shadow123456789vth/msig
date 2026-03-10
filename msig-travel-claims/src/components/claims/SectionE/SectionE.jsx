import { useState } from 'react';
import {
  Box, Grid, TextField, Typography, Card, CardContent, FormControl,
  InputLabel, Select, MenuItem, RadioGroup, Radio, FormControlLabel,
  Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
  InputAdornment, Tabs, Tab, Divider, Chip, Alert
} from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionHeader from '../../common/SectionHeader';

const TREATMENT_TYPES = ['Western Medicine', 'TCM (Traditional Chinese Medicine)', 'Dental', 'Mobility Aid', 'Maternity'];
const CURRENCIES = ['SGD', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'MYR', 'THB'];
const CANCELLATION_CAUSES = ['Illness', 'Injury', 'Natural Disaster', 'Riots/Strike', 'Others'];

const emptyExpenseRow = () => ({
  id: Date.now() + Math.random(),
  currency: 'SGD',
  dateIncurred: '',
  natureOfTreatment: '',
  treatmentType: '',
  incurredOverseas: '',
  paidByMedisave: '',
  amountClaimed: '',
});

export default function SectionE({ data, onChange }) {
  const [tab, setTab] = useState(0);
  const [hospitalised, setHospitalised] = useState(data.hospitalised || '');
  const [currentStatus, setCurrentStatus] = useState(data.currentStatus || '');
  const [previousCondition, setPreviousCondition] = useState(data.previousCondition || '');
  const [expenses, setExpenses] = useState(data.expenses || [emptyExpenseRow()]);
  const today = new Date().toISOString().split('T')[0];

  const update = (field, value) => onChange({ ...data, [field]: value });

  const addRow = () => {
    const updated = [...expenses, emptyExpenseRow()];
    setExpenses(updated);
    update('expenses', updated);
  };
  const deleteRow = (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    update('expenses', updated);
  };
  const updateRow = (id, field, value) => {
    const updated = expenses.map(e => e.id === id ? { ...e, [field]: value } : e);
    setExpenses(updated);
    update('expenses', updated);
  };

  const totalClaimed = expenses.reduce((s, e) => s + (parseFloat(e.amountClaimed) || 0), 0);

  return (
    <Box>
      <SectionHeader
        icon={<CoronavirusIcon />}
        title="Section E – COVID-19 Claims"
        subtitle="Submit medical, cancellation, or disruption claims related to COVID-19"
        badge="COVID-19"
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} textColor="primary" indicatorColor="primary">
        <Tab label="Review Benefit" />
        <Tab label="Medical Expenses" />
        <Tab label="Cancellation / Postponement" />
        <Tab label="Trip Disruption & Shortening" />
      </Tabs>

      {tab === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Applicable COVID-19 Benefits</Typography>
            <Grid container spacing={1.5}>
              {[
                { label: 'COVID-19 Medical Expenses', limit: 'Up to SGD 150,000' },
                { label: 'COVID-19 Hospital Benefits', limit: 'SGD 200/day, max 180 days' },
                { label: 'COVID-19 Trip Cancellation', limit: 'Up to SGD 10,000' },
                { label: 'COVID-19 Travel Disruption', limit: 'Up to SGD 5,000' },
                { label: 'COVID-19 Emergency Evacuation', limit: 'Unlimited' },
              ].map(b => (
                <Grid item xs={12} sm={6} key={b.label}>
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 1.5, bgcolor: '#f0fff4' }}>
                    <Typography variant="body2" fontWeight={600}>{b.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{b.limit}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 2 }}>
              COVID-19 sub-benefits are shared with Personal Accident and Travel Inconvenience sections.
            </Alert>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>COVID-19 Medical Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Were you hospitalised due to COVID-19? *</Typography>
                  <RadioGroup row value={hospitalised} onChange={e => { setHospitalised(e.target.value); update('hospitalised', e.target.value); }}>
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                {hospitalised === 'Yes' && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Current Status *</Typography>
                    <RadioGroup row value={currentStatus} onChange={e => { setCurrentStatus(e.target.value); update('currentStatus', e.target.value); }}>
                      <FormControlLabel value="Fully Recovered" control={<Radio size="small" />} label="Fully Recovered" />
                      <FormControlLabel value="Still Under Treatment" control={<Radio size="small" />} label="Still Under Treatment" />
                    </RadioGroup>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Previous history of COVID-19 condition?</Typography>
                  <RadioGroup row value={previousCondition} onChange={e => { setPreviousCondition(e.target.value); update('previousCondition', e.target.value); }}>
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                {previousCondition === 'Yes' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Date(s) of Previous Consultation" type="date" fullWidth value={data.prevConsultationDate || ''} onChange={e => update('prevConsultationDate', e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Doctor Name & Address" fullWidth value={data.doctorName || ''} onChange={e => update('doctorName', e.target.value)} />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>COVID-19 Expense Line Items</Typography>
                {totalClaimed > 0 && <Chip label={`Total: SGD ${totalClaimed.toFixed(2)}`} sx={{ bgcolor: '#1B75BB', color: 'white', fontWeight: 700 }} />}
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      {['#','Currency *','Date Incurred *','Nature of Treatment','Treatment Type','Overseas?','Medisave/MediShield?','Amount (SGD) *',''].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((row, idx) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ color: '#888', fontSize: '0.75rem' }}>{idx + 1}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select value={row.currency} onChange={e => updateRow(row.id, 'currency', e.target.value)}>
                              {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField size="small" type="date" value={row.dateIncurred} onChange={e => updateRow(row.id, 'dateIncurred', e.target.value)} inputProps={{ max: today }} sx={{ width: 140 }} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" value={row.natureOfTreatment} onChange={e => updateRow(row.id, 'natureOfTreatment', e.target.value)} placeholder="e.g. PCR Test" sx={{ width: 150 }} />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select value={row.treatmentType} onChange={e => updateRow(row.id, 'treatmentType', e.target.value)} displayEmpty>
                              <MenuItem value=""><em>Select</em></MenuItem>
                              {TREATMENT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select value={row.incurredOverseas} onChange={e => updateRow(row.id, 'incurredOverseas', e.target.value)} displayEmpty>
                              <MenuItem value=""><em>-</em></MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select value={row.paidByMedisave} onChange={e => updateRow(row.id, 'paidByMedisave', e.target.value)} displayEmpty>
                              <MenuItem value=""><em>-</em></MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={row.amountClaimed} onChange={e => updateRow(row.id, 'amountClaimed', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ width: 110 }} />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => deleteRow(row.id)} color="error" disabled={expenses.length === 1}><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Button startIcon={<AddIcon />} onClick={addRow} variant="outlined" size="small" sx={{ mt: 2, color: '#1B75BB', borderColor: '#1B75BB' }}>
                Add Expense Row
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {tab === 2 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>COVID-19 Cancellation / Postponement</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>Written confirmation from service provider?</Typography>
                <RadioGroup row value={data.writtenConfirmation || ''} onChange={e => update('writtenConfirmation', e.target.value)}>
                  <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type of Incident *</InputLabel>
                  <Select label="Type of Incident *" value={data.cancellationType || ''} onChange={e => update('cancellationType', e.target.value)}>
                    <MenuItem value="Travel Cancellation">Travel Cancellation</MenuItem>
                    <MenuItem value="Travel Postponement">Travel Postponement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={4}>
                <TextField label="Planned Departure Date" type="date" fullWidth value={data.plannedDeparture || ''} onChange={e => update('plannedDeparture', e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Date of Cancellation *" type="date" fullWidth value={data.cancellationDate || ''} onChange={e => update('cancellationDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cause</InputLabel>
                  <Select label="Cause" value={data.cancellationCause || ''} onChange={e => update('cancellationCause', e.target.value)}>
                    {CANCELLATION_CAUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Reason Details" fullWidth multiline rows={2} value={data.reasonDetails || ''} onChange={e => update('reasonDetails', e.target.value)} />
              </Grid>
              <Grid item xs={12}><Divider><Chip label="Financial Details" size="small" /></Divider></Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Amount Paid (SGD)" type="number" fullWidth value={data.amountPaid || ''} onChange={e => update('amountPaid', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Refund from Other Sources (SGD)" type="number" fullWidth value={data.refundAmount || ''} onChange={e => update('refundAmount', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} helperText="Enter 0 if none" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Net Amount to be Claimed (SGD)" type="number" fullWidth value={((parseFloat(data.amountPaid) || 0) - (parseFloat(data.refundAmount) || 0)).toFixed(2)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, readOnly: true }} sx={{ '& .MuiInputBase-input': { bgcolor: '#f5f5f5' } }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 3 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Trip Shortening (COVID-19)</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField label="Actual Departure Date *" type="date" fullWidth value={data.actualDeparture || ''} onChange={e => update('actualDeparture', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Planned Departure Date *" type="date" fullWidth value={data.plannedDeparture || ''} onChange={e => update('plannedDeparture', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: data.actualDeparture || '' }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Cause</InputLabel>
                    <Select label="Cause" value={data.shorteningCause || ''} onChange={e => update('shorteningCause', e.target.value)}>
                      {CANCELLATION_CAUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Reason Details" fullWidth multiline rows={2} value={data.shorteningDetails || ''} onChange={e => update('shorteningDetails', e.target.value)} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Trip Disruption (COVID-19)</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Disruption From Date *" type="date" fullWidth value={data.disruptionFrom || ''} onChange={e => update('disruptionFrom', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Disruption To Date *" type="date" fullWidth value={data.disruptionTo || ''} onChange={e => update('disruptionTo', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: data.disruptionFrom || '', max: today }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Cause of Disruption</InputLabel>
                    <Select label="Cause of Disruption" value={data.disruptionCause || ''} onChange={e => update('disruptionCause', e.target.value)}>
                      {CANCELLATION_CAUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Details on Reason" fullWidth multiline rows={2} value={data.disruptionDetails || ''} onChange={e => update('disruptionDetails', e.target.value)} />
                </Grid>
                <Grid item xs={12}><Divider><Chip label="Financial Details" size="small" /></Divider></Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Amount Paid (SGD)" type="number" fullWidth value={data.amountPaid || ''} onChange={e => update('amountPaid', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Refund from Other Sources (SGD)" type="number" fullWidth value={data.refundAmount || ''} onChange={e => update('refundAmount', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Net Amount to be Claimed (SGD)" type="number" fullWidth value={((parseFloat(data.amountPaid) || 0) - (parseFloat(data.refundAmount) || 0)).toFixed(2)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, readOnly: true }} sx={{ '& .MuiInputBase-input': { bgcolor: '#f5f5f5' } }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
