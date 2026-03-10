import { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button, Divider,
  Avatar, Alert, LinearProgress, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert as MuiAlert, Table, TableHead,
  TableRow, TableCell, TableBody, Collapse, Badge, Menu, MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LuggageIcon from '@mui/icons-material/Luggage';
import GavelIcon from '@mui/icons-material/Gavel';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import PersonIcon from '@mui/icons-material/Person';
import PolicyIcon from '@mui/icons-material/Policy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DownloadIcon from '@mui/icons-material/Download';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SendIcon from '@mui/icons-material/Send';
import FlagIcon from '@mui/icons-material/Flag';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCommentIcon from '@mui/icons-material/AddComment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { useClaim } from '../context/ClaimContext';
import { STATUS_COLORS } from '../data/demoData';

const BLUE = 'rgb(27, 117, 187)';

const STAGE_FLOW = [
  { key: 'Submitted',           label: 'Submitted',    icon: <FlightTakeoffIcon sx={{ fontSize: 14 }} /> },
  { key: 'Registered',          label: 'Registered',   icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  { key: 'Under Assessment',    label: 'Assessment',   icon: <HourglassTopIcon sx={{ fontSize: 14 }} /> },
  { key: 'Assessment Complete', label: 'Assessed',     icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  { key: 'Payment Approved',    label: 'Pmt Approved', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  { key: 'Settled',             label: 'Settled',      icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
];

const SECTION_META = {
  sectionB: { title: 'Personal Accident',    color: '#1565C0', icon: <LocalHospitalIcon sx={{ fontSize: 16 }} /> },
  sectionC: { title: 'Travel Inconvenience', color: '#2E7D32', icon: <LuggageIcon sx={{ fontSize: 16 }} /> },
  sectionD: { title: 'Personal Liability',   color: '#6A1B9A', icon: <GavelIcon sx={{ fontSize: 16 }} /> },
  sectionE: { title: 'COVID-19',             color: '#00838F', icon: <CoronavirusIcon sx={{ fontSize: 16 }} /> },
};

function val(v) {
  if (v === null || v === undefined || v === '' || v === 'undefined') return '—';
  return v;
}

function InfoRow({ label, value, bold }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.6, borderBottom: '1px solid #F0F4F8' }}>
      <Typography variant="caption" sx={{ color: '#90A4AE', minWidth: 110 }}>{label}</Typography>
      <Typography variant="caption" sx={{ fontWeight: bold ? 700 : 500, color: '#2C3E50', textAlign: 'right', flex: 1, ml: 1 }}>
        {val(value)}
      </Typography>
    </Box>
  );
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#607D8B';
  return <Chip label={status} sx={{ bgcolor: `${color}18`, color, fontWeight: 700, fontSize: '0.78rem', border: `1px solid ${color}30` }} />;
}

function STPBadge({ stpStatus }) {
  const cfg = {
    STP:        { bg: '#EAFAF1', color: '#27AE60', border: '#27AE6030' },
    NSTP:       { bg: '#FEF9E7', color: '#F39C12', border: '#F39C1230' },
    Processing: { bg: '#EBF4FF', color: BLUE,      border: `${BLUE}30` },
  }[stpStatus] || { bg: '#F0F4F8', color: '#607D8B', border: '#607D8B30' };
  return <Chip label={stpStatus} size="small" sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.72rem', border: `1px solid ${cfg.border}` }} />;
}

// ── Mock document preview content ──────────────────────────────────────────
function DocPreviewContent({ doc }) {
  return (
    <Box sx={{ bgcolor: '#F7F9FB', borderRadius: 2, p: 3, minHeight: 340, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 2, borderBottom: '1px solid #E8EDF2' }}>
        {doc.name.endsWith('.pdf')
          ? <PictureAsPdfIcon sx={{ color: '#E74C3C', fontSize: 36 }} />
          : <ImageIcon sx={{ color: BLUE, fontSize: 36 }} />}
        <Box>
          <Typography fontWeight={700}>{doc.name}</Typography>
          <Typography variant="caption" color="text.secondary">Section: {doc.section} · Status: {doc.status}</Typography>
        </Box>
      </Box>
      {/* Simulated document body */}
      <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, border: '1px solid #E8EDF2', flex: 1 }}>
        <Typography variant="caption" sx={{ color: '#B0BEC5', fontWeight: 700, display: 'block', mb: 2, letterSpacing: 1 }}>
          DOCUMENT PREVIEW
        </Typography>
        {[80, 60, 90, 45, 70, 55, 85].map((w, i) => (
          <Box key={i} sx={{ height: 10, bgcolor: i % 3 === 0 ? '#E8EDF2' : '#F0F4F8', borderRadius: 1, mb: 1.2, width: `${w}%` }} />
        ))}
        <Box sx={{ mt: 2, p: 1.5, bgcolor: '#EBF4FF', borderRadius: 1.5 }}>
          <Typography variant="caption" sx={{ color: BLUE, fontWeight: 600 }}>
            ✓ Document verified by IDP engine · Confidence: 94.2%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function ClaimDetailPage() {
  const { selectedClaimId, claims, navigateTo, resetClaimForm, setActiveStep } = useClaim();
  const claim = claims.find(c => c.id === selectedClaimId);

  // ── Local state ─────────────────────────────────────────────────────────
  const [snack, setSnack]               = useState({ open: false, msg: '', severity: 'success' });
  const [previewDoc, setPreviewDoc]     = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [noteText, setNoteText]         = useState('');
  const [notes, setNotes]               = useState([]);
  const [expandedSec, setExpandedSec]   = useState({});
  const [emailDialog, setEmailDialog]   = useState(false);
  const [emailTo, setEmailTo]           = useState('');
  const [emailBody, setEmailBody]       = useState('');
  const [flagDialog, setFlagDialog]     = useState(false);
  const [flagReason, setFlagReason]     = useState('');
  const [flagged, setFlagged]           = useState(false);
  const [reqDocDialog, setReqDocDialog] = useState(false);
  const [reqDocNote, setReqDocNote]     = useState('');
  const [moreAnchor, setMoreAnchor]     = useState(null);
  const fileInputRef = useRef(null);

  const toast = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

  if (!claim) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>Claim record not found.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigateTo('claims-list')}>Back to Claims</Button>
      </Box>
    );
  }

  const enabledSections = ['sectionB', 'sectionC', 'sectionD', 'sectionE'].filter(s => claim[s]?.enabled);
  const lastStage       = claim.timeline?.[claim.timeline.length - 1]?.stage || 'Submitted';
  const activeStageIdx  = STAGE_FLOW.findIndex(s => s.key === lastStage);
  const stageIdx        = activeStageIdx >= 0 ? activeStageIdx : 0;
  const progressPct     = ((stageIdx + 1) / STAGE_FLOW.length) * 100;

  const travelFrom   = claim.sectionA?.travelFrom;
  const travelTo     = claim.sectionA?.travelTo;
  const travelPeriod = (travelFrom && travelFrom !== 'undefined' && travelTo && travelTo !== 'undefined')
    ? `${travelFrom} → ${travelTo}` : '—';

  const expenseBreakdown = enabledSections.map(s => {
    const section = claim[s]?.data || {};
    const total   = section.expenses?.reduce((sum, e) => sum + (parseFloat(e.amountClaimed) || 0), 0) || 0;
    return { key: s, ...SECTION_META[s], total, count: section.expenses?.length || 0, items: section.expenses || [] };
  }).filter(e => e.total > 0);

  const allDocs = [...(claim.documents || []), ...uploadedDocs];

  // ── Handlers ────────────────────────────────────────────────────────────
  const copyClaimId = () => {
    navigator.clipboard.writeText(claim.id).then(() => toast(`Copied "${claim.id}" to clipboard`));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(f => ({ name: f.name, section: 'Additional', status: 'Uploaded', isNew: true }));
    setUploadedDocs(prev => [...prev, ...newDocs]);
    toast(`${files.length} document(s) uploaded successfully`);
    e.target.value = '';
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });
    setNotes(prev => [...prev, { text: noteText.trim(), date: dateStr, author: 'You' }]);
    setNoteText('');
    toast('Note added to timeline');
  };

  const handleSendEmail = () => {
    if (!emailTo.trim()) { toast('Please enter a recipient email', 'error'); return; }
    setEmailDialog(false);
    setEmailTo(''); setEmailBody('');
    toast(`Claim summary sent to ${emailTo}`);
  };

  const handleFlagSubmit = () => {
    if (!flagReason.trim()) { toast('Please enter a reason', 'error'); return; }
    setFlagDialog(false);
    setFlagged(true);
    setFlagReason('');
    toast('Claim flagged for review — team notified', 'warning');
  };

  const handleReqDocSubmit = () => {
    setReqDocDialog(false);
    setReqDocNote('');
    toast('Document request sent to policyholder');
  };

  const handleDownload = () => {
    toast('Claim summary PDF downloaded');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigateTo('claims-list')} size="small"
          sx={{ color: '#607D8B', bgcolor: 'white', border: '1px solid #E8EDF2', '&:hover': { bgcolor: '#F0F4F8' }, mt: 0.5 }}>
          Back
        </Button>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
            {/* Clickable claim ID — copies to clipboard */}
            <Tooltip title="Click to copy claim ID" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover .copy-icon': { opacity: 1 } }}
                onClick={copyClaimId}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#1A252F' }}>{claim.id}</Typography>
                <ContentCopyIcon className="copy-icon" sx={{ fontSize: 16, color: BLUE, opacity: 0, transition: '0.2s' }} />
              </Box>
            </Tooltip>
            <StatusBadge status={claim.status} />
            <STPBadge stpStatus={claim.stpStatus} />
            {flagged && (
              <Chip icon={<FlagIcon sx={{ fontSize: '14px !important' }} />} label="Flagged" size="small"
                sx={{ bgcolor: '#FDECEA', color: '#D32F2F', fontWeight: 700, border: '1px solid #D32F2F30' }} />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: '#607D8B' }}>
            {claim.claimType?.join(' · ')} &nbsp;·&nbsp; {val(claim.countryOfLoss)} &nbsp;·&nbsp; Submitted {claim.submittedDate}
          </Typography>
        </Box>

        {/* Header action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, flexWrap: 'wrap' }}>
          <Button variant="outlined" size="small" startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
            onClick={() => { setEmailBody(`Dear Team,\n\nPlease find the summary for claim ${claim.id}.\n\nStatus: ${claim.status}\nAmount Claimed: SGD ${(claim.amountClaimed||0).toLocaleString()}\n\nRegards`); setEmailDialog(true); }}
            sx={{ fontSize: '0.78rem', color: BLUE, borderColor: `${BLUE}40` }}>
            Share
          </Button>
          <Button variant="outlined" size="small" startIcon={<FlagIcon sx={{ fontSize: 16 }} />}
            onClick={() => setFlagDialog(true)}
            disabled={flagged}
            sx={{ fontSize: '0.78rem', color: flagged ? '#D32F2F' : '#607D8B', borderColor: flagged ? '#D32F2F40' : '#90A4AE40' }}>
            {flagged ? 'Flagged' : 'Flag'}
          </Button>
          <IconButton size="small" onClick={e => setMoreAnchor(e.currentTarget)}
            sx={{ border: '1px solid #E8EDF2', borderRadius: 1.5, color: '#607D8B' }}>
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}
            PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 190 } }}>
            <MenuItem dense onClick={() => { setMoreAnchor(null); handleDownload(); }}>
              <DownloadIcon sx={{ fontSize: 16, mr: 1.5, color: '#607D8B' }} /> Download PDF
            </MenuItem>
            <MenuItem dense onClick={() => { setMoreAnchor(null); setReqDocDialog(true); }}>
              <RequestPageIcon sx={{ fontSize: 16, mr: 1.5, color: '#607D8B' }} /> Request Documents
            </MenuItem>
            <MenuItem dense onClick={() => { setMoreAnchor(null); navigateTo('workbench'); }}>
              <OpenInNewIcon sx={{ fontSize: 16, mr: 1.5, color: '#607D8B' }} /> Open in Workbench
            </MenuItem>
            <Divider />
            <MenuItem dense onClick={() => { setMoreAnchor(null); toast('Claim archived', 'info'); }} sx={{ color: '#E74C3C' }}>
              Archive Claim
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ── Two-column CSS grid ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5, '@media (min-width:1100px)': { gridTemplateColumns: '1fr 360px' } }}>

        {/* ════ LEFT COLUMN ════ */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Progress Tracker — clickable stages */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2">Claim Processing Status</Typography>
                <Typography variant="caption" sx={{ color: '#90A4AE' }}>Stage {stageIdx + 1} of {STAGE_FLOW.length}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progressPct} sx={{
                height: 8, borderRadius: 4, mb: 2, bgcolor: '#EEF2F6',
                '& .MuiLinearProgress-bar': { bgcolor: claim.status === 'Settled' ? '#27AE60' : BLUE },
              }} />
              <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                {STAGE_FLOW.map((s, idx) => {
                  const done = idx < stageIdx; const current = idx === stageIdx;
                  return (
                    <Tooltip key={s.key} title={done ? `Completed` : current ? 'Current stage' : 'Pending'} arrow>
                      <Chip
                        icon={done ? <CheckCircleIcon sx={{ fontSize: '14px !important', color: '#27AE60 !important' }} /> : s.icon}
                        label={s.label} size="small"
                        onClick={() => toast(`Stage: ${s.label} — ${done ? 'Completed' : current ? 'In progress' : 'Pending'}`, done ? 'success' : current ? 'info' : 'warning')}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: current ? BLUE : done ? '#EAFAF1' : '#F0F4F8',
                          color:   current ? 'white' : done ? '#27AE60' : '#90A4AE',
                          fontWeight: current ? 700 : 500, fontSize: '0.72rem',
                          border: current ? 'none' : done ? '1px solid #27AE6030' : '1px solid #E8EDF2',
                          '& .MuiChip-icon': { color: current ? 'white !important' : undefined },
                          '&:hover': { opacity: 0.85 },
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          {/* Section A + Timeline side by side */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', '@media (min-width:700px)': { gridTemplateColumns: '1fr 1fr' }, gap: 2.5 }}>

            {/* Section A */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ bgcolor: `${BLUE}12`, borderRadius: 1.5, p: 0.8, display: 'flex' }}>
                    <FlightTakeoffIcon sx={{ fontSize: 16, color: BLUE }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ color: BLUE }}>Section A – Shared Details</Typography>
                </Box>
                <InfoRow label="Travel Period"     value={travelPeriod} />
                <InfoRow label="Country of Loss"   value={claim.sectionA?.countryOfLoss} />
                <InfoRow label="Incident Location" value={claim.sectionA?.accidentLocation} />
                <InfoRow label="PayNow Ref"        value={claim.sectionA?.payNowNumber} />
                <InfoRow label="Account Name"      value={claim.sectionA?.accountHolderName} />
                <InfoRow label="Other Insurance"   value={claim.sectionA?.otherInsurance ? 'Yes' : 'No'} />
                {claim.sectionA?.lossDescription && (
                  <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#F7F9FB', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#90A4AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Loss Description
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: '#1A252F' }}>{claim.sectionA.lossDescription}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Activity Timeline + Add Note */}
            <Card variant="outlined">
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Activity Timeline</Typography>
                  <Badge badgeContent={notes.length} color="primary" invisible={notes.length === 0}>
                    <AddCommentIcon sx={{ fontSize: 18, color: '#90A4AE' }} />
                  </Badge>
                </Box>
                <Box>
                  {[...(claim.timeline || [])].map((item, idx, arr) => {
                    const isLast = idx === arr.length - 1 && notes.length === 0;
                    return (
                      <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: isLast ? BLUE : '#27AE60' }}>
                            {isLast ? <PendingIcon sx={{ fontSize: 13 }} /> : <CheckCircleIcon sx={{ fontSize: 13 }} />}
                          </Avatar>
                          {!(isLast) && <Box sx={{ width: 2, flex: 1, bgcolor: '#E8EDF2', my: 0.5, minHeight: 14 }} />}
                        </Box>
                        <Box sx={{ pb: isLast ? 0 : 1.8, flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" fontWeight={700} sx={{ color: isLast ? BLUE : '#1A252F', fontSize: '0.8rem' }}>{item.stage}</Typography>
                            <Typography variant="caption" sx={{ color: '#90A4AE', fontSize: '0.68rem' }}>{item.date}</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#607D8B', fontSize: '0.72rem' }}>{item.note}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                  {/* User-added notes */}
                  {notes.map((n, idx) => (
                    <Box key={`note-${idx}`} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#6A1B9A', fontSize: '0.6rem', fontWeight: 700 }}>You</Avatar>
                        {idx < notes.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: '#E8EDF2', my: 0.5, minHeight: 14 }} />}
                      </Box>
                      <Box sx={{ pb: idx < notes.length - 1 ? 1.8 : 0, flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#6A1B9A', fontSize: '0.8rem' }}>Your Note</Typography>
                          <Typography variant="caption" sx={{ color: '#90A4AE', fontSize: '0.68rem' }}>{n.date}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#607D8B', fontSize: '0.72rem' }}>{n.text}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                {/* Add note input */}
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small" fullWidth placeholder="Add a note to timeline…"
                    value={noteText} onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                    multiline maxRows={2}
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.78rem' } }}
                  />
                  <IconButton size="small" onClick={handleAddNote} disabled={!noteText.trim()}
                    sx={{ bgcolor: BLUE, color: 'white', borderRadius: 1.5, '&:hover': { bgcolor: '#1565C0' }, '&:disabled': { bgcolor: '#E8EDF2' }, alignSelf: 'flex-end', mb: 0.5 }}>
                    <SendIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Risk Sections — expandable expense items */}
          {enabledSections.map(s => {
            const meta     = SECTION_META[s];
            const section  = claim[s]?.data || {};
            const hasExp   = section.expenses?.length > 0;
            const totalExp = section.expenses?.reduce((sum, e) => sum + (parseFloat(e.amountClaimed) || 0), 0) || 0;
            const expanded = expandedSec[s];
            return (
              <Card variant="outlined" key={s}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ bgcolor: `${meta.color}12`, borderRadius: 1.5, p: 0.8, display: 'flex', color: meta.color }}>{meta.icon}</Box>
                      <Typography variant="subtitle2" sx={{ color: meta.color }}>{meta.title}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                      <Chip label="Included" size="small" color="success" sx={{ height: 20, fontSize: '0.68rem' }} />
                      {hasExp && (
                        <Tooltip title={expanded ? 'Hide expense items' : 'Show expense items'} arrow>
                          <Chip
                            label={`${section.expenses.length} expenses`}
                            size="small"
                            icon={expanded ? <ExpandLessIcon sx={{ fontSize: '14px !important' }} /> : <ExpandMoreIcon sx={{ fontSize: '14px !important' }} />}
                            onClick={() => setExpandedSec(prev => ({ ...prev, [s]: !prev[s] }))}
                            sx={{ height: 22, fontSize: '0.68rem', cursor: 'pointer', bgcolor: `${meta.color}12`, color: meta.color,
                              border: `1px solid ${meta.color}30`, '&:hover': { bgcolor: `${meta.color}20` } }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1.5 }}>
                    {Object.entries(section)
                      .filter(([k, v]) => v && k !== 'expenses' && k !== 'articles' && k !== 'id' && String(v) !== 'undefined')
                      .slice(0, 10)
                      .map(([key, value]) => (
                        <Box key={key} sx={{ p: 1.2, bgcolor: '#F7F9FB', borderRadius: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#90A4AE', textTransform: 'capitalize', display: 'block', fontSize: '0.68rem' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#1A252F', fontSize: '0.8rem' }}>{String(value)}</Typography>
                        </Box>
                      ))}
                  </Box>
                  {/* Expandable expense line items */}
                  <Collapse in={!!expanded}>
                    <Box sx={{ mt: 2, border: `1px solid ${meta.color}20`, borderRadius: 2, overflow: 'hidden' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: `${meta.color}08` }}>
                            <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: meta.color, py: 0.8 }}>Description</TableCell>
                            <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: meta.color, py: 0.8 }}>Date</TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.72rem', fontWeight: 700, color: meta.color, py: 0.8 }}>Amount (SGD)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {section.expenses?.map((e, i) => (
                            <TableRow key={i} sx={{ '&:hover': { bgcolor: `${meta.color}05` } }}>
                              <TableCell sx={{ fontSize: '0.78rem', py: 0.7 }}>{e.description || `Item ${i + 1}`}</TableCell>
                              <TableCell sx={{ fontSize: '0.78rem', py: 0.7, color: '#607D8B' }}>{e.date || '—'}</TableCell>
                              <TableCell align="right" sx={{ fontSize: '0.78rem', fontWeight: 600, py: 0.7 }}>
                                {parseFloat(e.amountClaimed || 0).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ bgcolor: `${meta.color}08` }}>
                            <TableCell colSpan={2} sx={{ fontSize: '0.78rem', fontWeight: 700, py: 0.8 }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 800, color: meta.color, py: 0.8 }}>
                              {totalExp.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                  {hasExp && !expanded && (
                    <Box sx={{ mt: 1.5, p: 1.2, bgcolor: `${meta.color}08`, borderRadius: 2, border: `1px solid ${meta.color}20`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                      '&:hover': { bgcolor: `${meta.color}14` } }}
                      onClick={() => setExpandedSec(prev => ({ ...prev, [s]: true }))}>
                      <Typography variant="caption" sx={{ color: '#607D8B' }}>
                        {section.expenses.length} expense item(s) — click to expand
                      </Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: meta.color }}>
                        Total: SGD {totalExp.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Documents — clickable preview + upload */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2">Supporting Documents</Typography>
                  <Chip label={allDocs.length} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#EBF4FF', color: BLUE }} />
                </Box>
                <Button variant="contained" size="small" startIcon={<UploadFileIcon sx={{ fontSize: '14px !important' }} />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ fontSize: '0.73rem', py: 0.5, bgcolor: BLUE, '&:hover': { bgcolor: '#1565C0' } }}>
                  Upload
                </Button>
                <input type="file" ref={fileInputRef} multiple style={{ display: 'none' }} onChange={handleFileChange} />
              </Box>
              {allDocs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3, color: '#B0BEC5' }}>
                  <PictureAsPdfIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">No documents uploaded.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1 }}>
                  {allDocs.map((doc, idx) => (
                    <Box key={idx} onClick={() => setPreviewDoc(doc)} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                      bgcolor: doc.isNew ? '#EAFAF1' : '#F7F9FB',
                      borderRadius: 2, border: `1px solid ${doc.isNew ? '#27AE6030' : '#EEF2F6'}`,
                      cursor: 'pointer', '&:hover': { bgcolor: '#EBF4FF', borderColor: `${BLUE}40` },
                      transition: 'all 0.15s',
                    }}>
                      {doc.name.endsWith('.pdf')
                        ? <PictureAsPdfIcon sx={{ color: '#E74C3C', fontSize: 22, flexShrink: 0 }} />
                        : <ImageIcon sx={{ color: BLUE, fontSize: 22, flexShrink: 0 }} />}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{doc.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#90A4AE' }}>{doc.section}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.3 }}>
                        <Chip label={doc.isNew ? 'New' : doc.status} size="small"
                          color={doc.isNew ? 'success' : 'success'} sx={{ height: 18, fontSize: '0.63rem' }} />
                        <VisibilityIcon sx={{ fontSize: 13, color: '#90A4AE' }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* ════ RIGHT COLUMN ════ */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Financial Summary */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Financial Summary</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ p: 2, bgcolor: '#EBF4FF', borderRadius: 2, border: `1px solid ${BLUE}20` }}>
                  <Typography variant="caption" sx={{ color: '#607D8B', display: 'block', mb: 0.3 }}>Amount Claimed</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: BLUE }}>
                    SGD {(claim.amountClaimed || 0).toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: '#EAFAF1', borderRadius: 2, border: '1px solid #27AE6020' }}>
                  <Typography variant="caption" sx={{ color: '#607D8B', display: 'block', mb: 0.3 }}>Amount Approved</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#27AE60' }}>
                    {claim.amountApproved != null
                      ? `SGD ${claim.amountApproved.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`
                      : <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#90A4AE' }}>Pending Assessment</span>}
                  </Typography>
                </Box>
                {claim.amountApproved != null && claim.amountClaimed > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Settlement Rate</Typography>
                      <Typography variant="caption" fontWeight={700}>
                        {((claim.amountApproved / claim.amountClaimed) * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={(claim.amountApproved / claim.amountClaimed) * 100}
                      sx={{ height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { bgcolor: '#27AE60' } }} />
                  </Box>
                )}
                {claim.paymentRef && (
                  <Box sx={{ p: 1.5, bgcolor: '#F7F9FB', borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: '#EBF4FF' } }}
                    onClick={() => { navigator.clipboard.writeText(claim.paymentRef); toast('Payment reference copied'); }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#90A4AE' }}>Payment Reference</Typography>
                      <ContentCopyIcon sx={{ fontSize: 13, color: '#B0BEC5' }} />
                    </Box>
                    <Typography variant="body2" fontWeight={700} sx={{ color: BLUE }}>{claim.paymentRef}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          {expenseBreakdown.length > 0 && (
            <Card variant="outlined">
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <ReceiptLongIcon sx={{ fontSize: 16, color: BLUE }} />
                  <Typography variant="subtitle2">Expense Breakdown</Typography>
                </Box>
                {expenseBreakdown.map(e => (
                  <Box key={e.key} sx={{ mb: 1.5, cursor: 'pointer' }}
                    onClick={() => setExpandedSec(prev => ({ ...prev, [e.key]: !prev[e.key] }))}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        <Box sx={{ color: e.color, display: 'flex' }}>{e.icon}</Box>
                        <Typography variant="caption" fontWeight={600} sx={{ color: e.color }}>{e.title}</Typography>
                      </Box>
                      <Typography variant="caption" fontWeight={700} sx={{ color: e.color }}>SGD {e.total.toFixed(2)}</Typography>
                    </Box>
                    <LinearProgress variant="determinate"
                      value={claim.amountClaimed > 0 ? Math.min((e.total / claim.amountClaimed) * 100, 100) : 0}
                      sx={{ height: 5, borderRadius: 3, bgcolor: `${e.color}15`, '& .MuiLinearProgress-bar': { bgcolor: e.color } }} />
                    <Typography variant="caption" sx={{ color: '#90A4AE', fontSize: '0.67rem' }}>
                      {e.count} item{e.count !== 1 ? 's' : ''} · click to {expandedSec[e.key] ? 'collapse' : 'expand'}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Key Dates */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: BLUE }} />
                <Typography variant="subtitle2">Key Dates</Typography>
              </Box>
              {[['Submitted', claim.submittedDate], ['Registered', claim.registeredDate], ['Assessed', claim.assessedDate], ['Settled', claim.settledDate]].map(([label, date]) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid #F0F4F8' }}>
                  <Typography variant="caption" sx={{ color: '#90A4AE' }}>{label}</Typography>
                  {date
                    ? <Chip label={date} size="small" sx={{ height: 20, fontSize: '0.68rem', bgcolor: '#EBF4FF', color: BLUE, fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => toast(`${label} date: ${date}`, 'info')} />
                    : <Typography variant="caption" sx={{ color: '#CFD8DC' }}>—</Typography>}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Policy Info */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PolicyIcon sx={{ fontSize: 16, color: BLUE }} />
                <Typography variant="subtitle2">Policy Information</Typography>
              </Box>
              <InfoRow label="Policy No."   value={claim.policyNumber} bold />
              <InfoRow label="Insured Name" value={claim.insuredName} />
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#90A4AE', fontWeight: 600 }}>CLAIM TYPES</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.8 }}>
                  {claim.claimType?.map(t => (
                    <Chip key={t} label={t} size="small" onClick={() => toast(`Claim type: ${t}`, 'info')}
                      sx={{ bgcolor: `${BLUE}10`, color: BLUE, fontSize: '0.68rem', height: 20, cursor: 'pointer', '&:hover': { bgcolor: `${BLUE}20` } }} />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Button variant="outlined" size="small" fullWidth startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  onClick={handleDownload}
                  sx={{ justifyContent: 'flex-start', color: BLUE, borderColor: `${BLUE}30`, fontSize: '0.78rem', py: 0.9, '&:hover': { borderColor: BLUE, bgcolor: `${BLUE}08` } }}>
                  Download Claim Summary
                </Button>
                <Button variant="outlined" size="small" fullWidth startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
                  onClick={() => { setEmailBody(`Dear Team,\n\nPlease find the summary for claim ${claim.id}.\n\nStatus: ${claim.status}\nAmount Claimed: SGD ${(claim.amountClaimed||0).toLocaleString()}\n\nRegards`); setEmailDialog(true); }}
                  sx={{ justifyContent: 'flex-start', color: '#1565C0', borderColor: '#1565C030', fontSize: '0.78rem', py: 0.9, '&:hover': { borderColor: '#1565C0', bgcolor: '#1565C008' } }}>
                  Share via Email
                </Button>
                {claim.status !== 'Settled' && (
                  <>
                    <Button variant="outlined" size="small" fullWidth startIcon={<AddCircleOutlineIcon sx={{ fontSize: 16 }} />}
                      onClick={() => { resetClaimForm(); setActiveStep(0); navigateTo('new-claim'); }}
                      sx={{ justifyContent: 'flex-start', color: '#2E7D32', borderColor: '#2E7D3230', fontSize: '0.78rem', py: 0.9, '&:hover': { borderColor: '#2E7D32', bgcolor: '#2E7D3208' } }}>
                      File Supplementary Claim
                    </Button>
                    <Button variant="outlined" size="small" fullWidth startIcon={<RequestPageIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setReqDocDialog(true)}
                      sx={{ justifyContent: 'flex-start', color: '#E65100', borderColor: '#E6510030', fontSize: '0.78rem', py: 0.9, '&:hover': { borderColor: '#E65100', bgcolor: '#E6510008' } }}>
                      Request Additional Documents
                    </Button>
                  </>
                )}
                <Button variant="outlined" size="small" fullWidth startIcon={<SupportAgentIcon sx={{ fontSize: 16 }} />}
                  onClick={() => toast('Support ticket created — ref #TKT-' + Math.floor(Math.random()*9000+1000), 'info')}
                  sx={{ justifyContent: 'flex-start', color: '#6A1B9A', borderColor: '#6A1B9A30', fontSize: '0.78rem', py: 0.9, '&:hover': { borderColor: '#6A1B9A', bgcolor: '#6A1B9A08' } }}>
                  Contact Support
                </Button>
                <Button variant="outlined" size="small" fullWidth startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                  onClick={() => navigateTo('workbench')}
                  sx={{ justifyContent: 'flex-start', color: '#607D8B', borderColor: '#90A4AE40', fontSize: '0.78rem', py: 0.9, '&:hover': { borderColor: '#607D8B', bgcolor: '#607D8B08' } }}>
                  View in Officer Workbench
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Assigned Officer */}
          {claim.claimOfficer && (
            <Card variant="outlined" sx={{ border: '1px solid #F39C1230' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Assigned Officer</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#FEF9E7', borderRadius: 2,
                  cursor: 'pointer', '&:hover': { bgcolor: '#FEF3CD' } }}
                  onClick={() => toast(`Contacting ${claim.claimOfficer}…`, 'info')}>
                  <Avatar sx={{ bgcolor: '#6A1B9A', width: 38, height: 38 }}><PersonIcon fontSize="small" /></Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>{claim.claimOfficer}</Typography>
                    <Chip label="NSTP Manual Review" size="small" sx={{ bgcolor: '#F39C1220', color: '#F39C12', height: 18, fontSize: '0.65rem', mt: 0.3 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* STP/NSTP Info */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AutoFixHighIcon sx={{ fontSize: 16, color: '#6A1B9A' }} />
                <Typography variant="subtitle2">Processing Method</Typography>
              </Box>
              {claim.stpStatus === 'STP' ? (
                <Alert severity="success" sx={{ py: 0.8 }}>
                  <Typography variant="caption" fontWeight={600}>Straight-Through Processing</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.2 }}>Automatically validated and approved without manual intervention.</Typography>
                </Alert>
              ) : claim.stpStatus === 'NSTP' ? (
                <Alert severity="warning" sx={{ py: 0.8 }}>
                  <Typography variant="caption" fontWeight={600}>Manual Review Required (NSTP)</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.2 }}>Routed to a Claims Officer — exceeded STP thresholds.</Typography>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ py: 0.8 }}>
                  <Typography variant="caption" fontWeight={600}>STP Validation In Progress</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.2 }}>Being validated by the STP rules engine.</Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* What's Next */}
          {claim.status !== 'Settled' && (
            <Card variant="outlined" sx={{ border: `1px solid ${BLUE}20`, bgcolor: '#F8FBFF' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: BLUE }} />
                  <Typography variant="subtitle2" sx={{ color: BLUE }}>What Happens Next?</Typography>
                </Box>
                {claim.status === 'Submitted'       && <Typography variant="caption" sx={{ color: '#607D8B' }}>✓ Queued for STP validation. You'll receive a confirmation once registered.</Typography>}
                {claim.status === 'Registered'      && <Typography variant="caption" sx={{ color: '#607D8B' }}>✓ Claim registered. Assessment begins shortly. Estimated: 1–3 business days.</Typography>}
                {claim.status === 'Under Assessment' && <Typography variant="caption" sx={{ color: '#607D8B' }}>✓ A Claims Officer is reviewing your documentation. You may be contacted for more info.</Typography>}
                {claim.status === 'Pending Review'  && <Typography variant="caption" sx={{ color: '#F39C12', fontWeight: 600 }}>⚠ Action may be required — check notifications for document requests.</Typography>}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════════
          DIALOGS
      ══════════════════════════════════════════════════ */}

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onClose={() => setPreviewDoc(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography fontWeight={700}>Document Preview</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
              onClick={() => { toast(`${previewDoc?.name} downloaded`); }}
              sx={{ fontSize: '0.75rem' }}>
              Download
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {previewDoc && <DocPreviewContent doc={previewDoc} />}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPreviewDoc(null)} variant="outlined" size="small">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Share via Email Dialog */}
      <Dialog open={emailDialog} onClose={() => setEmailDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Share Claim Summary</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="To" fullWidth size="small" value={emailTo}
            onChange={e => setEmailTo(e.target.value)} placeholder="recipient@example.com" />
          <TextField label="Subject" fullWidth size="small" defaultValue={`Claim Summary — ${claim.id}`} />
          <TextField label="Message" fullWidth multiline rows={5} size="small"
            value={emailBody} onChange={e => setEmailBody(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setEmailDialog(false)} variant="outlined" size="small">Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained" size="small" startIcon={<SendIcon sx={{ fontSize: 14 }} />}
            sx={{ bgcolor: BLUE }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flag Claim Dialog */}
      <Dialog open={flagDialog} onClose={() => setFlagDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#D32F2F' }}>
          <FlagIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />Flag Claim for Review
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#607D8B' }}>
            Flagging this claim will notify the team lead for priority review.
          </Typography>
          <TextField label="Reason for flagging" fullWidth multiline rows={3} size="small"
            value={flagReason} onChange={e => setFlagReason(e.target.value)}
            placeholder="e.g. Suspected duplicate, unusual amount, missing documentation…" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setFlagDialog(false)} variant="outlined" size="small">Cancel</Button>
          <Button onClick={handleFlagSubmit} variant="contained" size="small"
            sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' } }}>
            Flag Claim
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Documents Dialog */}
      <Dialog open={reqDocDialog} onClose={() => setReqDocDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Request Additional Documents</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#607D8B' }}>
            A notification will be sent to the policyholder requesting supplementary documentation.
          </Typography>
          <TextField label="Documents required / notes" fullWidth multiline rows={3} size="small"
            value={reqDocNote} onChange={e => setReqDocNote(e.target.value)}
            placeholder="e.g. Please provide original hospital receipts and doctor's memo…" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setReqDocDialog(false)} variant="outlined" size="small">Cancel</Button>
          <Button onClick={handleReqDocSubmit} variant="contained" size="small"
            startIcon={<SendIcon sx={{ fontSize: 14 }} />} sx={{ bgcolor: '#E65100', '&:hover': { bgcolor: '#BF360C' } }}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}
          onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
