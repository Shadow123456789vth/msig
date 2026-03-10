import { useState } from 'react';
import {
  Box, Grid, TextField, Typography, Card, CardContent, FormControl,
  InputLabel, Select, MenuItem, RadioGroup, Radio, FormControlLabel,
  Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
  InputAdornment, Tabs, Tab, Alert, Chip, Divider
} from '@mui/material';
import LuggageIcon from '@mui/icons-material/Luggage';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionHeader from '../../common/SectionHeader';

const DELAY_CAUSES = ['Delayed Departure', 'Flight Diversion', 'Overbooked Flight', 'Missed Travel Connection'];
const DELAY_REASONS = {
  'Delayed Departure': ['Strike', 'Poor Weather', 'Mechanical Failure', 'Air Traffic Control', 'Others'],
  'Flight Diversion': ['Safety Concerns', 'Medical Emergency on Board', 'Poor Weather', 'Others'],
  'Overbooked Flight': ['Airline Overbooking', 'Others'],
  'Missed Travel Connection': ['Delayed Incoming Flight', 'Strike', 'Poor Weather', 'Others'],
};
const CANCELLATION_CAUSES = ['Illness', 'Injury', 'Natural Disaster', 'Riots/Strike', 'Others'];
const ARTICLE_CLASSIFICATIONS = ['Baggage', 'Laptop/Electronics', 'Jewellery', 'Travel Documents', 'Money/Cash', 'Golf Equipment', 'Others'];

const TI_SUBTYPES = [
  { key: 'baggage', label: 'Baggage & Personal Effects' },
  { key: 'baggageDelay', label: 'Baggage Delay' },
  { key: 'flightDelay', label: 'Flight Delay / Missed Connection / Overbooking' },
  { key: 'tripCancellation', label: 'Trip Cancellation / Postponement' },
  { key: 'tripShortening', label: 'Trip Shortening' },
  { key: 'travelDisruption', label: 'Travel Disruption' },
];

const emptyArticleRow = () => ({
  id: Date.now() + Math.random(),
  description: '',
  datePurchased: '',
  purchasePrice: '',
  hasReceipt: '',
  sourceOfGoods: '',
  classification: '',
  isElectronic: '',
  amountClaimed: '',
});

export default function SectionC({ data, onChange }) {
  const [subType, setSubType] = useState(data.subType || 'baggage');
  const [policeReport, setPoliceReport] = useState(data.policeReport || '');
  const [articles, setArticles] = useState(data.articles || [emptyArticleRow()]);
  const [delayCause, setDelayCause] = useState(data.delayCause || '');
  const [cancellationType, setCancellationType] = useState(data.cancellationType || '');

  const update = (field, value) => onChange({ ...data, [field]: value, subType });

  const addArticle = () => {
    const updated = [...articles, emptyArticleRow()];
    setArticles(updated);
    update('articles', updated);
  };

  const deleteArticle = (id) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    update('articles', updated);
  };

  const updateArticle = (id, field, value) => {
    const updated = articles.map(a => a.id === id ? { ...a, [field]: value } : a);
    setArticles(updated);
    update('articles', updated);
  };

  const handleSubType = (_, val) => {
    setSubType(val);
    onChange({ ...data, subType: val });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box>
      <SectionHeader
        icon={<LuggageIcon />}
        title="Section C – Travel Inconvenience Claims"
        subtitle="Select the type of travel inconvenience you are claiming for"
        badge="TI"
      />

      <Tabs
        value={subType}
        onChange={handleSubType}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, '& .MuiTab-root': { fontSize: '0.78rem', minWidth: 'auto' } }}
        textColor="primary"
        indicatorColor="primary"
      >
        {TI_SUBTYPES.map(t => <Tab key={t.key} value={t.key} label={t.label} />)}
      </Tabs>

      {/* Baggage & Personal Effects */}
      {subType === 'baggage' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Police Report Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Was a police report filed within 24 hours? *</Typography>
                  <RadioGroup row value={policeReport} onChange={e => { setPoliceReport(e.target.value); update('policeReport', e.target.value); }}>
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                {policeReport === 'Yes' && (
                  <Grid item xs={12} sm={8}>
                    <TextField label="Name of Authorities / Police Station" fullWidth value={data.policeStation || ''} onChange={e => update('policeStation', e.target.value)} />
                  </Grid>
                )}
                {policeReport === 'No' && (
                  <Grid item xs={12}>
                    <TextField label="Reason for Not Reporting" fullWidth multiline rows={2} value={data.noReportReason || ''} onChange={e => update('noReportReason', e.target.value)} />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Compensation Attempt</InputLabel>
                    <Select label="Compensation Attempt" value={data.compensationAttempt || ''} onChange={e => update('compensationAttempt', e.target.value)}>
                      <MenuItem value="Successfully claimed full">Successfully claimed full</MenuItem>
                      <MenuItem value="Successfully claimed partial">Successfully claimed partial</MenuItem>
                      <MenuItem value="Attempted but unsuccessful">Attempted but unsuccessful</MenuItem>
                      <MenuItem value="No attempt made">No attempt made</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Articles / Items Lost or Damaged</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 950 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      {['#','Description','Date Purchased','Purchase Price (SGD)','Has Receipt?','Source','Classification','Electronic?','Amount Claimed',''].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, whiteSpace: 'nowrap', fontSize: '0.75rem' }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {articles.map((row, idx) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ color: '#888', fontSize: '0.75rem' }}>{idx + 1}</TableCell>
                        <TableCell><TextField size="small" value={row.description} onChange={e => updateArticle(row.id, 'description', e.target.value)} sx={{ width: 140 }} /></TableCell>
                        <TableCell>
                          <TextField size="small" type="date" value={row.datePurchased} onChange={e => updateArticle(row.id, 'datePurchased', e.target.value)} inputProps={{ max: today }} sx={{ width: 140 }} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={row.purchasePrice} onChange={e => updateArticle(row.id, 'purchasePrice', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ width: 100 }} />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select value={row.hasReceipt} onChange={e => updateArticle(row.id, 'hasReceipt', e.target.value)} displayEmpty>
                              <MenuItem value=""><em>-</em></MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField size="small" value={row.sourceOfGoods} onChange={e => updateArticle(row.id, 'sourceOfGoods', e.target.value)} sx={{ width: 110 }} />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select value={row.classification} onChange={e => updateArticle(row.id, 'classification', e.target.value)} displayEmpty>
                              <MenuItem value=""><em>Select</em></MenuItem>
                              {ARTICLE_CLASSIFICATIONS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select value={row.isElectronic} onChange={e => updateArticle(row.id, 'isElectronic', e.target.value)} displayEmpty>
                              <MenuItem value=""><em>-</em></MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={row.amountClaimed} onChange={e => updateArticle(row.id, 'amountClaimed', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ width: 100 }} />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => deleteArticle(row.id)} color="error" disabled={articles.length === 1}><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Button startIcon={<AddIcon />} onClick={addArticle} variant="outlined" size="small" sx={{ mt: 2, color: '#1B75BB', borderColor: '#1B75BB' }}>
                Add Item
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Baggage Delay */}
      {subType === 'baggageDelay' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Baggage Delay Details</Typography>
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
                  <InputLabel>Pick-up Point</InputLabel>
                  <Select label="Pick-up Point" value={data.pickupPoint || ''} onChange={e => update('pickupPoint', e.target.value)}>
                    <MenuItem value="Singapore">Singapore</MenuItem>
                    <MenuItem value="Overseas">Overseas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={6}>
                <TextField label="Delay From *" type="datetime-local" fullWidth value={data.delayFrom || ''} onChange={e => update('delayFrom', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: new Date().toISOString().slice(0, 16) }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Delay To *" type="datetime-local" fullWidth value={data.delayTo || ''} onChange={e => update('delayTo', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: data.delayFrom || '', max: new Date().toISOString().slice(0, 16) }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Flight Delay */}
      {subType === 'flightDelay' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Flight Disruption Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Scheduled Departure Date *" type="date" fullWidth value={data.scheduledDate || ''} onChange={e => update('scheduledDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Scheduled Time" type="time" fullWidth value={data.scheduledTime || ''} onChange={e => update('scheduledTime', e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Flight/Transport No." fullWidth value={data.transportNumber || ''} onChange={e => update('transportNumber', e.target.value)} placeholder="e.g. SQ321" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Place of Departure" fullWidth value={data.placeOfDeparture || ''} onChange={e => update('placeOfDeparture', e.target.value)} placeholder="e.g. Singapore Changi Airport" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cause of Delay *</InputLabel>
                  <Select label="Cause of Delay *" value={delayCause} onChange={e => { setDelayCause(e.target.value); update('delayCause', e.target.value); update('delayReason', ''); }}>
                    {DELAY_CAUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              {delayCause && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Reason for Delay</InputLabel>
                    <Select label="Reason for Delay" value={data.delayReason || ''} onChange={e => update('delayReason', e.target.value)}>
                      {(DELAY_REASONS[delayCause] || []).map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}><Divider><Chip label="Actual Departure" size="small" /></Divider></Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Actual Departure Date *" type="date" fullWidth value={data.actualDate || ''} onChange={e => update('actualDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: data.scheduledDate || '', max: today }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Actual Time" type="time" fullWidth value={data.actualTime || ''} onChange={e => update('actualTime', e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Actual Transport No." fullWidth value={data.actualTransportNumber || ''} onChange={e => update('actualTransportNumber', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Actual Place of Departure" fullWidth value={data.actualPlace || ''} onChange={e => update('actualPlace', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>Written confirmation from service provider?</Typography>
                <RadioGroup row value={data.writtenConfirmationFlight || ''} onChange={e => update('writtenConfirmationFlight', e.target.value)}>
                  <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Trip Cancellation/Postponement */}
      {subType === 'tripCancellation' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Trip Cancellation / Postponement Details</Typography>
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
                  <Select label="Type of Incident *" value={cancellationType} onChange={e => { setCancellationType(e.target.value); update('cancellationType', e.target.value); }}>
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
                <TextField label="Date of Cancellation/Postponement *" type="date" fullWidth value={data.cancellationDate || ''} onChange={e => update('cancellationDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
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
                <TextField label="Reason Details" fullWidth multiline rows={2} value={data.cancellationReason || ''} onChange={e => update('cancellationReason', e.target.value)} />
              </Grid>
              <Grid item xs={12}><Divider><Chip label="Financial Details" size="small" /></Divider></Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Amount Paid for Trip (SGD)" type="number" fullWidth value={data.amountPaid || ''} onChange={e => update('amountPaid', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Refund / Amount Recovered (SGD)" type="number" fullWidth value={data.refundAmount || ''} onChange={e => update('refundAmount', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} helperText="Enter 0 if none" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Amount to be Claimed (SGD)"
                  type="number"
                  fullWidth
                  value={((parseFloat(data.amountPaid) || 0) - (parseFloat(data.refundAmount) || 0)).toFixed(2)}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, readOnly: true }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: '#f5f5f5' } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Trip Shortening */}
      {subType === 'tripShortening' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Trip Shortening Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField label="Actual Departure Date *" type="date" fullWidth value={data.actualDeparture || ''} onChange={e => update('actualDeparture', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Planned Departure Date *" type="date" fullWidth value={data.plannedDeparture || ''} onChange={e => update('plannedDeparture', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: data.actualDeparture || '' }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cause *</InputLabel>
                  <Select label="Cause *" value={data.cause || ''} onChange={e => update('cause', e.target.value)}>
                    {CANCELLATION_CAUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Reason Details" fullWidth multiline rows={2} value={data.reasonDetails || ''} onChange={e => update('reasonDetails', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Amount Paid (SGD)" type="number" fullWidth value={data.amountPaid || ''} onChange={e => update('amountPaid', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Refund from Other Sources (SGD)" type="number" fullWidth value={data.refundAmount || ''} onChange={e => update('refundAmount', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Amount to be Claimed (SGD)" type="number" fullWidth value={((parseFloat(data.amountPaid) || 0) - (parseFloat(data.refundAmount) || 0)).toFixed(2)} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, readOnly: true }} sx={{ '& .MuiInputBase-input': { bgcolor: '#f5f5f5' } }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Travel Disruption */}
      {subType === 'travelDisruption' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Travel Disruption Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Disruption From Date *" type="date" fullWidth value={data.disruptionFrom || ''} onChange={e => update('disruptionFrom', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: today }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Disruption To Date *" type="date" fullWidth value={data.disruptionTo || ''} onChange={e => update('disruptionTo', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: data.disruptionFrom || '', max: today }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cause of Disruption *</InputLabel>
                  <Select label="Cause of Disruption *" value={data.cause || ''} onChange={e => update('cause', e.target.value)}>
                    {CANCELLATION_CAUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Details on Reason for Disruption" fullWidth multiline rows={2} value={data.disruptionDetails || ''} onChange={e => update('disruptionDetails', e.target.value)} />
              </Grid>
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
      )}
    </Box>
  );
}
