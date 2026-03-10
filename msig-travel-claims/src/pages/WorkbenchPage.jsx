import { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button, Table,
  TableHead, TableRow, TableCell, TableBody, Divider,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Tabs, Tab, LinearProgress, Tooltip, IconButton,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditNoteIcon from '@mui/icons-material/EditNote';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useClaim } from '../context/ClaimContext';
import { STATUS_COLORS } from '../data/demoData';

const CC = { High: '#27AE60', Medium: '#F39C12', Low: '#E74C3C' };

// ── Rich IDP extraction data ──────────────────────────────────────────────────
const AI_EXTRACTIONS = {
  'CLM-2024-100387': [
    { field: 'Date of Admission',      extracted: '27 Nov 2024',           confidence: 'High',   score: 98 },
    { field: 'Date of Discharge',      extracted: '30 Nov 2024',           confidence: 'High',   score: 96 },
    { field: 'Length of Stay',         extracted: '3 nights',              confidence: 'High',   score: 97 },
    { field: 'Hospital Name',          extracted: 'Bangkok Hospital',      confidence: 'High',   score: 91 },
    { field: 'Hospital Licence No.',   extracted: 'BKH-2847',              confidence: 'Low',    score: 42 },
    { field: 'Nature of Treatment',    extracted: 'Inpatient Hosp.',       confidence: 'High',   score: 96 },
    { field: 'Primary Diagnosis',      extracted: 'COVID-19 Confirmed',    confidence: 'High',   score: 93 },
    { field: 'ICD-10 Code',            extracted: 'U07.1',                 confidence: 'Medium', score: 68 },
    { field: 'Attending Doctor',       extracted: 'Dr. Somchai P.',        confidence: 'Medium', score: 72 },
    { field: 'Specialist Referred',    extracted: 'Dr. Rattana V.',        confidence: 'Low',    score: 38 },
    { field: 'Invoice No.',            extracted: 'INV-20241127-002',      confidence: 'Medium', score: 78 },
    { field: 'Total Bill (THB)',       extracted: 'THB 12,400',            confidence: 'High',   score: 94 },
    { field: 'SGD Equivalent',         extracted: 'SGD 468.00',            confidence: 'Medium', score: 71 },
    { field: 'Policyholder Signature', extracted: 'Detected',              confidence: 'High',   score: 99 },
  ],
  'CLM-2024-100502': [
    { field: 'Insured Name',           extracted: 'David Chen Kai Xiang',  confidence: 'High',   score: 99 },
    { field: 'Policy Number',          extracted: 'TRV-2024-009901',       confidence: 'High',   score: 99 },
    { field: 'Date of Incident',       extracted: '10 Dec 2024',           confidence: 'High',   score: 97 },
    { field: 'Incident Location',      extracted: 'London, UK',            confidence: 'High',   score: 89 },
    { field: 'Third Party Name',       extracted: 'James Wilson',          confidence: 'Medium', score: 75 },
    { field: 'Third Party Address',    extracted: '14 Baker St, London',   confidence: 'Low',    score: 52 },
    { field: 'Vehicle Registration',   extracted: 'LN23 XYZ',             confidence: 'Medium', score: 67 },
    { field: 'Police Report No.',      extracted: 'MPS-2024-109234',       confidence: 'Medium', score: 73 },
    { field: 'Third Party Insurer',    extracted: 'Aviva UK',              confidence: 'Medium', score: 69 },
    { field: 'Repair Estimate (GBP)',  extracted: 'GBP 4,200',            confidence: 'Low',    score: 45 },
    { field: 'SGD Equivalent',         extracted: 'SGD 7,182',             confidence: 'Low',    score: 41 },
    { field: 'Witness Name',           extracted: 'Sarah Thompson',        confidence: 'Low',    score: 48 },
    { field: 'CCTV Evidence',          extracted: 'Not Available',         confidence: 'Medium', score: 77 },
    { field: 'Claim Acknowledgement',  extracted: 'Signed',                confidence: 'High',   score: 94 },
  ],
};

// ── Per-claim demo documents ──────────────────────────────────────────────────
const CLAIM_DOCS = {
  'CLM-2024-100387': [
    { name: 'Bangkok Hospital Medical Report',  type: 'PDF', pages: 3, uploaded: '2024-12-01', status: 'Verified', icon: 'pdf' },
    { name: 'Official Receipt – Bangkok Hosp.', type: 'PDF', pages: 1, uploaded: '2024-12-01', status: 'Verified', icon: 'pdf' },
    { name: 'COVID-19 PCR Test Certificate',    type: 'PDF', pages: 1, uploaded: '2024-12-01', status: 'Verified', icon: 'pdf' },
    { name: 'Passport – Travel Document',       type: 'Image', pages: 2, uploaded: '2024-12-01', status: 'Verified', icon: 'img' },
    { name: 'Flight Booking Confirmation',      type: 'PDF', pages: 1, uploaded: '2024-12-01', status: 'Pending', icon: 'pdf' },
  ],
  'CLM-2024-100502': [
    { name: 'Police Report – MPS London',       type: 'PDF', pages: 4, uploaded: '2024-12-16', status: 'Verified', icon: 'pdf' },
    { name: 'Vehicle Damage Assessment',        type: 'PDF', pages: 2, uploaded: '2024-12-16', status: 'Verified', icon: 'pdf' },
    { name: 'Third Party Correspondence',       type: 'PDF', pages: 3, uploaded: '2024-12-17', status: 'Pending', icon: 'pdf' },
    { name: 'Repair Estimate – ABC Garage',     type: 'PDF', pages: 1, uploaded: '2024-12-17', status: 'Pending', icon: 'pdf' },
  ],
};

const getFallbackDocs = (claim) =>
  claim.documents?.length
    ? claim.documents.map(d => ({ name: d.name, type: 'PDF', pages: 1, uploaded: claim.submittedDate, status: d.status, icon: 'pdf' }))
    : [{ name: 'Claim Form', type: 'PDF', pages: 1, uploaded: claim.submittedDate, status: 'Pending', icon: 'pdf' }];

// ── Confidence pill ───────────────────────────────────────────────────────────
function ConfPill({ conf, score }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <LinearProgress variant="determinate" value={score}
        sx={{ width: 48, height: 5, borderRadius: 3, '& .MuiLinearProgress-bar': { bgcolor: CC[conf] } }} />
      <Typography variant="caption" fontWeight={700} sx={{ color: CC[conf], fontSize: '0.7rem', width: 30 }}>{score}%</Typography>
    </Box>
  );
}

// ── Document Viewer panel ─────────────────────────────────────────────────────
function DocViewer({ docs, idx, onPrev, onNext }) {
  const doc = docs[idx];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Preview area */}
      <Box sx={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        bgcolor: '#F7F9FB', borderRadius: 2, border: '1px dashed #C5D5E8', p: 2, mb: 1.5, minHeight: 160,
      }}>
        {doc.icon === 'pdf'
          ? <PictureAsPdfIcon sx={{ fontSize: 56, color: '#E53935', mb: 1.5 }} />
          : <ImageIcon sx={{ fontSize: 56, color: '#1B75BB', mb: 1.5 }} />}
        <Typography variant="subtitle2" fontWeight={700} sx={{ textAlign: 'center', mb: 0.3 }}>{doc.name}</Typography>
        <Typography variant="caption" color="text.secondary">{doc.type} · {doc.pages} page{doc.pages > 1 ? 's' : ''}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Uploaded: {doc.uploaded}</Typography>
        <Chip
          label={doc.status}
          size="small"
          icon={doc.status === 'Verified' ? <VerifiedIcon sx={{ fontSize: '12px !important' }} /> : undefined}
          sx={{ mt: 1, height: 20, fontSize: '0.65rem', fontWeight: 700,
            bgcolor: doc.status === 'Verified' ? '#2E7D3215' : '#ED6C0215',
            color: doc.status === 'Verified' ? '#2E7D32' : '#ED6C02',
          }}
        />
      </Box>

      {/* Navigation row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton size="small" onClick={onPrev} disabled={idx === 0}
          sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' }, '&.Mui-disabled': { bgcolor: '#f9f9f9' } }}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" fontWeight={700} sx={{ color: '#1B75BB' }}>
            Document {idx + 1} of {docs.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.4, justifyContent: 'center', mt: 0.3 }}>
            {docs.map((_, i) => (
              <Box key={i} sx={{ width: i === idx ? 16 : 6, height: 4, borderRadius: 2, bgcolor: i === idx ? '#1B75BB' : '#C5D5E8', transition: 'width 0.2s' }} />
            ))}
          </Box>
        </Box>
        <IconButton size="small" onClick={onNext} disabled={idx === docs.length - 1}
          sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' }, '&.Mui-disabled': { bgcolor: '#f9f9f9' } }}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function WorkbenchPage() {
  const { claims, setClaims, navigateTo } = useClaim();
  const [tab, setTab]         = useState(0);
  const [docIdx, setDocIdx]   = useState({});       // { claimId: number }
  const [notes, setNotes]     = useState({});        // { claimId: string }
  const [amounts, setAmounts] = useState({});        // { claimId: string }
  const [addedDocs, setAddedDocs] = useState({});   // { claimId: [name, ...] }
  const [actionDialog, setActionDialog] = useState({ open: false, claim: null, action: '' });
  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);

  const nstpClaims = claims.filter(c => c.stpStatus === 'NSTP' || c.status === 'Under Assessment' || c.status === 'Pending Review');
  const stpClaims  = claims.filter(c => c.stpStatus === 'STP');

  const getDocIdx  = id => docIdx[id] || 0;
  const getDocs    = claim => {
    const base = CLAIM_DOCS[claim.id] || getFallbackDocs(claim);
    const extra = (addedDocs[claim.id] || []).map(n => ({ name: n, type: 'PDF', pages: 1, uploaded: 'Just now', status: 'Pending', icon: 'pdf' }));
    return [...base, ...extra];
  };

  const handleUploadClick = (claimId) => {
    setUploadTarget(claimId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !uploadTarget) return;
    setAddedDocs(prev => ({
      ...prev,
      [uploadTarget]: [...(prev[uploadTarget] || []), ...files.map(f => f.name)],
    }));
    e.target.value = '';
  };

  const handleAction = (claim, action) => {
    setActionDialog({ open: true, claim, action });
  };

  const confirmAction = () => {
    const { claim, action } = actionDialog;
    const statusMap = { Approve: 'Settled', Reject: 'Settled', 'Request More Info': 'Pending Review', Escalate: 'Pending Review' };
    const note = notes[claim.id] || `Action: ${action} by Claims Officer`;
    setClaims(prev => prev.map(c => {
      if (c.id !== claim.id) return c;
      return {
        ...c,
        status: statusMap[action] || c.status,
        amountApproved: action === 'Approve' ? parseFloat(amounts[claim.id] || c.amountClaimed) : c.amountApproved,
        assessedDate: new Date().toISOString().split('T')[0],
        timeline: [...(c.timeline || []), {
          stage: action === 'Approve' ? 'Assessment Complete' : action,
          date: new Date().toLocaleString(),
          note,
        }],
      };
    }));
    setActionDialog({ open: false, claim: null, action: '' });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff" multiple hidden onChange={handleFileChange} />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon sx={{ color: '#1B75BB' }} /> Claims Officer Workbench
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review NSTP claims · Verify IDP extractions · Take action
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, mb: 2.5,
        '@media (max-width:599px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
        {[
          { label: 'Pending NSTP',        value: nstpClaims.length, color: '#ED6C02', sub: 'Requires review' },
          { label: 'STP Auto-Processed',  value: stpClaims.length,  color: '#2E7D32', sub: 'No action needed' },
          { label: 'Avg. Handling Time',  value: '2.4d',            color: '#1565C0', sub: 'Days per claim' },
          { label: 'SLA Breaches',        value: 0,                 color: '#1B75BB', sub: 'All within SLA' },
        ].map(s => (
          <Card key={s.label} variant="outlined">
            <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: s.color, lineHeight: 1, mb: 0.3 }}>{s.value}</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.78rem' }}>{s.label}</Typography>
              <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5 }} textColor="primary" indicatorColor="primary">
        <Tab label={`NSTP Claims (${nstpClaims.length})`} />
        <Tab label={`STP Claims (${stpClaims.length})`} />
      </Tabs>

      {/* ── NSTP Claims ────────────────────────────────────────────────────── */}
      {tab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {nstpClaims.length === 0 && <Alert severity="success">No NSTP claims pending review.</Alert>}

          {nstpClaims.map(claim => {
            const docs    = getDocs(claim);
            const idx     = getDocIdx(claim.id);
            const idpRows = AI_EXTRACTIONS[claim.id] || [];
            const lowCount = idpRows.filter(r => r.confidence === 'Low').length;

            return (
              <Card key={claim.id} variant="outlined" sx={{ borderLeft: '4px solid #ED6C02' }}>
                {/* ── Claim Header ── */}
                <Box sx={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  px: 2.5, py: 1.5, bgcolor: '#FAFBFC', borderBottom: '1px solid #EEF2F6',
                  flexWrap: 'wrap', gap: 1,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#1B75BB' }}>{claim.id}</Typography>
                    <Chip label={claim.status} size="small" sx={{ bgcolor: `${STATUS_COLORS[claim.status]}20`, color: STATUS_COLORS[claim.status], fontWeight: 700, height: 20, fontSize: '0.68rem' }} />
                    <Chip label="NSTP" size="small" sx={{ bgcolor: '#ED6C0220', color: '#ED6C02', fontWeight: 700, height: 20, fontSize: '0.68rem' }} />
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 14, alignSelf: 'center' }} />
                    <Typography variant="body2" color="text.secondary">{claim.insuredName}</Typography>
                    <Typography variant="caption" color="text.secondary">· {claim.policyNumber}</Typography>
                    <Typography variant="caption" color="text.secondary">· {claim.countryOfLoss}</Typography>
                    <Typography variant="caption" color="text.secondary">· Submitted {claim.submittedDate}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight={800} sx={{ color: '#1B75BB', lineHeight: 1 }}>
                        SGD {claim.amountClaimed?.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Amount Claimed</Typography>
                    </Box>
                    {lowCount > 0 && (
                      <Chip label={`${lowCount} Low Confidence`} size="small"
                        sx={{ bgcolor: '#E74C3C15', color: '#E74C3C', fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                    )}
                  </Box>
                </Box>

                {/* ── 3-Panel Body ── */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: '30% 42% 28%',
                  '@media (max-width:1100px)': { gridTemplateColumns: '1fr 1fr' },
                  '@media (max-width:699px)':  { gridTemplateColumns: '1fr' },
                  gap: 0,
                }}>
                  {/* ── Panel 1: Document Viewer ── */}
                  <Box sx={{ p: 2.5, borderRight: '1px solid #EEF2F6', display: 'flex', flexDirection: 'column' }}>
                    {/* Header with upload button always visible */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                      <PictureAsPdfIcon sx={{ color: '#E53935', fontSize: 16 }} />
                      <Typography variant="subtitle2" fontWeight={700}>Documents</Typography>
                      <Chip label={`${docs.length} files`} size="small" sx={{ height: 18, fontSize: '0.62rem', bgcolor: '#f5f5f5' }} />
                      <Box sx={{ flex: 1 }} />
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<UploadFileIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => handleUploadClick(claim.id)}
                        sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2, height: 26, flexShrink: 0,
                          background: 'linear-gradient(135deg, #1B75BB 0%, #1558A0 100%)',
                        }}
                      >
                        Upload Doc
                      </Button>
                    </Box>

                    <DocViewer
                      docs={docs}
                      idx={idx}
                      onPrev={() => setDocIdx(p => ({ ...p, [claim.id]: Math.max(0, idx - 1) }))}
                      onNext={() => setDocIdx(p => ({ ...p, [claim.id]: Math.min(docs.length - 1, idx + 1) }))}
                    />

                    {/* Scrollable doc list */}
                    <Box sx={{ mt: 1.5, maxHeight: 150, overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: 4 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: '#C5D5E8', borderRadius: 2 },
                    }}>
                      {docs.map((d, i) => (
                        <Box key={i} onClick={() => setDocIdx(p => ({ ...p, [claim.id]: i }))}
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.8, py: 0.5, px: 0.8, borderRadius: 1,
                            cursor: 'pointer', bgcolor: i === idx ? '#EBF4FF' : 'transparent',
                            border: i === idx ? '1px solid #1B75BB30' : '1px solid transparent',
                            '&:hover': { bgcolor: '#F7F9FB' }, mb: 0.3,
                          }}>
                          <PictureAsPdfIcon sx={{ fontSize: 12, color: '#E53935', flexShrink: 0 }} />
                          <Typography variant="caption" noWrap sx={{ flex: 1, fontWeight: i === idx ? 700 : 400, fontSize: '0.68rem' }}>
                            {d.name}
                          </Typography>
                          <Chip label={d.status} size="small" sx={{ height: 14, fontSize: '0.55rem', flexShrink: 0,
                            bgcolor: d.status === 'Verified' ? '#2E7D3210' : '#ED6C0210',
                            color: d.status === 'Verified' ? '#2E7D32' : '#ED6C02' }} />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* ── Panel 2: IDP Extraction ── */}
                  <Box sx={{ p: 2.5, borderRight: '1px solid #EEF2F6' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <AutoFixHighIcon sx={{ color: '#6A1B9A', fontSize: 16 }} />
                        <Typography variant="subtitle2" fontWeight={700}>AI-Extracted Fields (IDP)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {['High','Medium','Low'].map(c => (
                          <Chip key={c} label={`${idpRows.filter(r=>r.confidence===c).length} ${c}`} size="small"
                            sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${CC[c]}15`, color: CC[c] }} />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ overflowX: 'auto' }}>
                      <Table size="small" sx={{ '& td, & th': { py: 0.7, px: 1 } }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#F7F9FB' }}>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', width: '38%' }}>Field</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', width: '32%' }}>Extracted Value</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', width: '30%' }}>Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {idpRows.map(row => (
                            <TableRow key={row.field}
                              sx={{ bgcolor: row.confidence === 'Low' ? '#FFF8F6' : 'transparent',
                                '&:hover': { bgcolor: row.confidence === 'Low' ? '#FFF0EB' : '#F7F9FB' } }}>
                              <TableCell>
                                <Typography variant="caption" sx={{ color: '#455A64', fontWeight: 500 }}>{row.field}</Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 0.8, py: 0.2, borderRadius: 1,
                                  bgcolor: row.confidence === 'Low' ? '#FFF3E0' : row.confidence === 'High' ? '#F0FFF4' : '#FFF8E1',
                                  border: `1px solid ${CC[row.confidence]}30` }}>
                                  <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem' }}>{row.extracted}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Chip label={row.confidence} size="small"
                                    sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${CC[row.confidence]}15`, color: CC[row.confidence], mr: 0.3 }} />
                                  <ConfPill conf={row.confidence} score={row.score} />
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                          {idpRows.length === 0 && (
                            <TableRow><TableCell colSpan={3}><Typography variant="caption" color="text.secondary">No IDP data available.</Typography></TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>

                    {lowCount > 0 && (
                      <Alert severity="warning" sx={{ mt: 1.5, py: 0.5 }}>
                        <Typography variant="caption">
                          <strong>{lowCount} field(s)</strong> have low confidence — manual verification required before approval.
                        </Typography>
                      </Alert>
                    )}
                  </Box>

                  {/* ── Panel 3: Decision Panel ── */}
                  <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Claim types */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.62rem', display: 'block', mb: 0.5 }}>Claim Types</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {claim.claimType?.map(t => (
                          <Chip key={t} label={t} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#1B75BB10', color: '#1B75BB' }} />
                        ))}
                      </Box>
                    </Box>

                    {/* Approved amount */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.62rem', display: 'block', mb: 0.5 }}>Amount to Approve (SGD)</Typography>
                      <TextField
                        size="small"
                        fullWidth
                        type="number"
                        placeholder={claim.amountClaimed?.toString()}
                        value={amounts[claim.id] || ''}
                        onChange={e => setAmounts(p => ({ ...p, [claim.id]: e.target.value }))}
                        sx={{ '& input': { fontSize: '0.85rem', fontWeight: 700, color: '#2E7D32' } }}
                        InputProps={{ startAdornment: <Typography variant="caption" sx={{ color: '#888', mr: 0.5, whiteSpace: 'nowrap' }}>SGD</Typography> }}
                      />
                    </Box>

                    {/* Latest activity */}
                    {claim.timeline?.slice(-1).map(t => (
                      <Box key={t.stage} sx={{ p: 1, bgcolor: '#F7F9FB', borderRadius: 1, border: '1px solid #EEF2F6' }}>
                        <Typography variant="caption" fontWeight={700} sx={{ display: 'block' }}>{t.stage}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.note}</Typography>
                      </Box>
                    ))}

                    {/* Officer notes */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <EditNoteIcon sx={{ fontSize: 14, color: '#607D8B' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.62rem' }}>Officer Notes</Typography>
                      </Box>
                      <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add assessment notes..."
                        value={notes[claim.id] || ''}
                        onChange={e => setNotes(p => ({ ...p, [claim.id]: e.target.value }))}
                        sx={{ '& textarea': { fontSize: '0.78rem' } }}
                      />
                    </Box>

                    <Divider />

                    {/* Action Buttons */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
                      <Button variant="contained" color="success" size="small" fullWidth
                        startIcon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => handleAction(claim, 'Approve')}
                        sx={{ fontSize: '0.75rem', py: 0.8 }}>
                        Approve
                      </Button>
                      <Button variant="outlined" color="error" size="small" fullWidth
                        startIcon={<CancelIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => handleAction(claim, 'Reject')}
                        sx={{ fontSize: '0.75rem', py: 0.8 }}>
                        Reject
                      </Button>
                      <Button variant="outlined" size="small" fullWidth
                        startIcon={<HelpOutlineIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => handleAction(claim, 'Request More Info')}
                        sx={{ fontSize: '0.75rem', py: 0.8, borderColor: '#ED6C0260', color: '#ED6C02',
                          '&:hover': { borderColor: '#ED6C02', bgcolor: '#ED6C0208' } }}>
                        More Info
                      </Button>
                      <Button variant="outlined" size="small" fullWidth
                        startIcon={<TrendingUpIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => handleAction(claim, 'Escalate')}
                        sx={{ fontSize: '0.75rem', py: 0.8, borderColor: '#6A1B9A60', color: '#6A1B9A',
                          '&:hover': { borderColor: '#6A1B9A', bgcolor: '#6A1B9A08' } }}>
                        Escalate
                      </Button>
                    </Box>

                    <Button variant="text" size="small" onClick={() => navigateTo('claim-detail', claim.id)}
                      sx={{ color: '#1B75BB', fontSize: '0.72rem', p: 0 }}>
                      View Full Claim Details →
                    </Button>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* ── STP Claims ─────────────────────────────────────────────────────── */}
      {tab === 1 && (
        <Card variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                {['Claim ID','Insured','Type','Amount Claimed','Amount Approved','Status','Payment Ref'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stpClaims.map(c => (
                <TableRow key={c.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigateTo('claim-detail', c.id)}>
                  <TableCell><Typography variant="body2" fontWeight={700} sx={{ color: '#1B75BB' }}>{c.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{c.insuredName}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{c.claimType?.join(', ')}</Typography></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600}>SGD {c.amountClaimed?.toLocaleString()}</Typography></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600} sx={{ color: '#2E7D32' }}>{c.amountApproved ? `SGD ${c.amountApproved?.toLocaleString()}` : '—'}</Typography></TableCell>
                  <TableCell><Chip label={c.status} size="small" sx={{ bgcolor: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status], fontWeight: 700, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell><Typography variant="caption" sx={{ color: '#1565C0' }}>{c.paymentRef || '—'}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ── Action Confirmation Dialog ──────────────────────────────────────── */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, claim: null, action: '' })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actionDialog.action === 'Approve'   && <CheckCircleIcon sx={{ color: '#27AE60' }} />}
          {actionDialog.action === 'Reject'    && <CancelIcon sx={{ color: '#E74C3C' }} />}
          {actionDialog.action === 'Escalate' && <TrendingUpIcon sx={{ color: '#6A1B9A' }} />}
          {actionDialog.action === 'Request More Info' && <HelpOutlineIcon sx={{ color: '#ED6C02' }} />}
          Confirm: {actionDialog.action}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1.5, bgcolor: '#F7F9FB', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" fontWeight={700}>{actionDialog.claim?.id}</Typography>
            <Typography variant="body2" color="text.secondary">
              {actionDialog.claim?.insuredName} · SGD {actionDialog.claim?.amountClaimed?.toLocaleString()}
            </Typography>
            {actionDialog.action === 'Approve' && amounts[actionDialog.claim?.id] && (
              <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 700, mt: 0.5 }}>
                Approving: SGD {parseFloat(amounts[actionDialog.claim?.id]).toLocaleString()}
              </Typography>
            )}
          </Box>
          <TextField label="Officer Note / Reason" fullWidth multiline rows={3}
            value={notes[actionDialog.claim?.id] || ''}
            onChange={e => setNotes(p => ({ ...p, [actionDialog.claim?.id]: e.target.value }))}
            placeholder={`Add notes for ${actionDialog.action}...`} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setActionDialog({ open: false, claim: null, action: '' })}>Cancel</Button>
          <Button variant="contained" onClick={confirmAction}
            color={actionDialog.action === 'Approve' ? 'success' : actionDialog.action === 'Reject' ? 'error' : 'primary'}>
            Confirm {actionDialog.action}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
