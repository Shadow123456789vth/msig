import { useState } from 'react';
import {
  Box, Grid, TextField, Typography, Card, CardContent, FormControl,
  InputLabel, Select, MenuItem, RadioGroup, Radio, FormControlLabel,
  Button, IconButton, Table, TableHead, TableRow, TableCell,
  TableBody, InputAdornment, Chip, Alert, Tabs, Tab, Divider
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionHeader from '../../common/SectionHeader';

const TREATMENT_TYPES = ['Western Medicine', 'TCM (Traditional Chinese Medicine)', 'Dental', 'Mobility Aid', 'Maternity'];
const CURRENCIES = ['SGD', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'MYR', 'THB'];

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

export default function SectionB({ data, onChange }) {
  const [tab, setTab] = useState(0);
  const [hospitalised, setHospitalised] = useState(data.hospitalised || '');
  const [currentStatus, setCurrentStatus] = useState(data.currentStatus || '');
  const [previousCondition, setPreviousCondition] = useState(data.previousCondition || '');
  const [expenses, setExpenses] = useState(data.expenses || [emptyExpenseRow()]);

  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addRow = () => {
    const newExpenses = [...expenses, emptyExpenseRow()];
    setExpenses(newExpenses);
    update('expenses', newExpenses);
  };

  const deleteRow = (id) => {
    const newExpenses = expenses.filter(e => e.id !== id);
    setExpenses(newExpenses);
    update('expenses', newExpenses);
  };

  const updateRow = (id, field, value) => {
    const newExpenses = expenses.map(e => e.id === id ? { ...e, [field]: value } : e);
    setExpenses(newExpenses);
    update('expenses', newExpenses);
  };

  const totalClaimed = expenses.reduce((sum, e) => sum + (parseFloat(e.amountClaimed) || 0), 0);

  return (
    <Box>
      <SectionHeader
        icon={<LocalHospitalIcon />}
        title="Section B – Personal Accident Claims"
        subtitle="Provide details related to personal accident, medical, or hospital benefits"
        badge="PA"
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} textColor="primary" indicatorColor="primary">
        <Tab label="Review Benefit" />
        <Tab label="Claim Details" />
      </Tabs>

      {tab === 0 && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Applicable Benefits from Your Policy</Typography>
            <Grid container spacing={1.5}>
              {[
                { label: 'Medical Expense', limit: 'Up to SGD 500,000', active: true },
                { label: 'Hospital Benefits (per day)', limit: 'SGD 200/day, max 180 days', active: true },
                { label: 'Accidental Death & Disablement', limit: 'Up to SGD 500,000', active: true },
                { label: 'Emergency Medical Evacuation', limit: 'Unlimited', active: true },
              ].map(b => (
                <Grid item xs={12} sm={6} key={b.label}>
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 1.5, bgcolor: b.active ? '#f9f9f9' : '#fafafa' }}>
                    <Typography variant="body2" fontWeight={600}>{b.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{b.limit}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 2 }}>
              Benefits are fetched from your policy underwriting data. Actual payable amounts are subject to assessment.
            </Alert>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Hospitalisation Status */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Hospitalisation Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Were you hospitalised due to this incident? *</Typography>
                  <RadioGroup
                    row
                    value={hospitalised}
                    onChange={e => { setHospitalised(e.target.value); update('hospitalised', e.target.value); }}
                  >
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                {hospitalised === 'Yes' && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Current Status *</Typography>
                    <RadioGroup
                      row
                      value={currentStatus}
                      onChange={e => { setCurrentStatus(e.target.value); update('currentStatus', e.target.value); }}
                    >
                      <FormControlLabel value="Fully Recovered" control={<Radio size="small" />} label="Fully Recovered" />
                      <FormControlLabel value="Still Under Treatment" control={<Radio size="small" />} label="Still Under Treatment" />
                    </RadioGroup>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Previous history of same condition?</Typography>
                  <RadioGroup
                    row
                    value={previousCondition}
                    onChange={e => { setPreviousCondition(e.target.value); update('previousCondition', e.target.value); }}
                  >
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                {previousCondition === 'Yes' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Date(s) of Previous Consultation"
                        type="date"
                        fullWidth
                        value={data.prevConsultationDate || ''}
                        onChange={e => update('prevConsultationDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Doctor Name & Address"
                        fullWidth
                        value={data.doctorName || ''}
                        onChange={e => update('doctorName', e.target.value)}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Cause of Condition *</InputLabel>
                    <Select
                      label="Cause of Condition *"
                      value={data.causeOfCondition || ''}
                      onChange={e => update('causeOfCondition', e.target.value)}
                    >
                      <MenuItem value="Accident">Accident</MenuItem>
                      <MenuItem value="Illness">Illness</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Expense Line Items */}
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>Medical Expense Line Items</Typography>
                {totalClaimed > 0 && (
                  <Chip
                    label={`Total: SGD ${totalClaimed.toFixed(2)}`}
                    sx={{ bgcolor: '#1B75BB', color: 'white', fontWeight: 700 }}
                  />
                )}
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 700, width: 40 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Currency *</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date Incurred *</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Nature of Treatment</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Treatment Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Overseas?</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Medisave/MediShield?</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Amount (SGD) *</TableCell>
                      <TableCell sx={{ width: 40 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((row, idx) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ color: '#888', fontSize: '0.75rem' }}>{idx + 1}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                              value={row.currency}
                              onChange={e => updateRow(row.id, 'currency', e.target.value)}
                            >
                              {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="date"
                            size="small"
                            value={row.dateIncurred}
                            onChange={e => updateRow(row.id, 'dateIncurred', e.target.value)}
                            inputProps={{ max: new Date().toISOString().split('T')[0] }}
                            sx={{ width: 140 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={row.natureOfTreatment}
                            onChange={e => updateRow(row.id, 'natureOfTreatment', e.target.value)}
                            placeholder="e.g. Consultation"
                            sx={{ width: 160 }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                              value={row.treatmentType}
                              onChange={e => updateRow(row.id, 'treatmentType', e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value=""><em>Select</em></MenuItem>
                              {TREATMENT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                              value={row.incurredOverseas}
                              onChange={e => updateRow(row.id, 'incurredOverseas', e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value=""><em>Select</em></MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                              value={row.paidByMedisave}
                              onChange={e => updateRow(row.id, 'paidByMedisave', e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value=""><em>Select</em></MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={row.amountClaimed}
                            onChange={e => updateRow(row.id, 'amountClaimed', e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                            sx={{ width: 110 }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => deleteRow(row.id)} color="error" disabled={expenses.length === 1}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Button
                startIcon={<AddIcon />}
                onClick={addRow}
                sx={{ mt: 2, color: '#1B75BB', borderColor: '#1B75BB' }}
                variant="outlined"
                size="small"
              >
                Add Expense Row
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
