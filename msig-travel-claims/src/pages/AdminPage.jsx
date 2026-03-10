import { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Switch,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, Button,
  TextField, Tabs, Tab, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Divider, Tooltip, IconButton,
  List, ListItem, ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Visibility';
import PublishIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import RestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import { STP_RULES, AUTHORITY_TIERS, DOC_REQUIREMENTS } from '../data/demoData';

// ── Template Variables catalogue ──────────────────────────────────────────────
const TEMPLATE_VARS = [
  { key: '{{claimRef}}',      label: 'Claim Reference',   example: 'CLM-2024-100291' },
  { key: '{{insuredName}}',   label: 'Insured Name',      example: 'John Tan Wei Ming' },
  { key: '{{policyNumber}}',  label: 'Policy Number',     example: 'TRV-2024-001234' },
  { key: '{{amountClaimed}}', label: 'Amount Claimed',    example: 'SGD 3,850.00' },
  { key: '{{amountApproved}}',label: 'Amount Approved',   example: 'SGD 3,200.00' },
  { key: '{{submittedDate}}', label: 'Submission Date',   example: '10 Nov 2024' },
  { key: '{{settledDate}}',   label: 'Settlement Date',   example: '13 Nov 2024' },
  { key: '{{paymentRef}}',    label: 'Payment Reference', example: 'PAY-2024-001234' },
  { key: '{{claimOfficer}}',  label: 'Claims Officer',    example: 'Officer Priya Sharma' },
  { key: '{{portalLink}}',    label: 'Portal Link',       example: 'https://claims.msig.com.sg' },
  { key: '{{contactEmail}}',  label: 'Contact Email',     example: 'claims@msig.com.sg' },
  { key: '{{contactPhone}}',  label: 'Contact Phone',     example: '1800-MSIG-123' },
];

const VALID_KEYS = new Set(TEMPLATE_VARS.map(v => v.key));

// ── Initial template data ─────────────────────────────────────────────────────
const INITIAL_TEMPLATES = [
  {
    id: 'T001',
    name: 'Claim Acknowledgement',
    trigger: 'On Submission',
    channel: 'Email + SMS',
    status: 'Published',
    currentVersion: 3,
    subject: 'MSIG Travel Claims – Claim {{claimRef}} Received',
    body: `Dear {{insuredName}},

Thank you for submitting your MSIG travel insurance claim.

Your claim has been registered with the following details:
  • Claim Reference : {{claimRef}}
  • Policy Number   : {{policyNumber}}
  • Date Submitted  : {{submittedDate}}
  • Amount Claimed  : {{amountClaimed}}

Our claims team will review your submission within 3–5 working days. You may track your claim status at any time by visiting: {{portalLink}}

For assistance, contact us at {{contactEmail}} or call {{contactPhone}}.

Yours sincerely,
MSIG Insurance – Claims Team`,
    versions: [
      { v: 1, date: '2024-01-15', author: 'Admin Lee Boon Hwa', note: 'Initial template — basic acknowledgement',
        subject: 'MSIG – Claim Received',
        body: 'Dear {{insuredName}},\n\nYour claim {{claimRef}} has been received. We will be in touch shortly.\n\nMSIG Claims Team' },
      { v: 2, date: '2024-06-01', author: 'Admin Priya Sharma', note: 'Added portal link and policy details',
        subject: 'MSIG Travel Claims – {{claimRef}} Received',
        body: 'Dear {{insuredName}},\n\nClaim {{claimRef}} received for policy {{policyNumber}}.\nAmount Claimed: {{amountClaimed}}\n\nTrack your claim at: {{portalLink}}\n\nMSIG Claims Team' },
      { v: 3, date: '2024-11-20', author: 'Admin Lee Boon Hwa', note: 'Current version — full formatting, contact details added',
        subject: 'MSIG Travel Claims – Claim {{claimRef}} Received',
        body: `Dear {{insuredName}},\n\nThank you for submitting your MSIG travel insurance claim.\n\nYour claim has been registered with the following details:\n  • Claim Reference : {{claimRef}}\n  • Policy Number   : {{policyNumber}}\n  • Date Submitted  : {{submittedDate}}\n  • Amount Claimed  : {{amountClaimed}}\n\nOur claims team will review your submission within 3–5 working days. You may track your claim status at any time by visiting: {{portalLink}}\n\nFor assistance, contact us at {{contactEmail}} or call {{contactPhone}}.\n\nYours sincerely,\nMSIG Insurance – Claims Team` },
    ],
  },
  {
    id: 'T002',
    name: 'Assessment Outcome',
    trigger: 'On Assessment Complete',
    channel: 'Email',
    status: 'Published',
    currentVersion: 2,
    subject: 'MSIG Travel Claims – Assessment Outcome for {{claimRef}}',
    body: `Dear {{insuredName}},

We have completed the assessment of your travel insurance claim.

Claim Reference  : {{claimRef}}
Policy Number    : {{policyNumber}}
Amount Claimed   : {{amountClaimed}}
Amount Approved  : {{amountApproved}}
Assessed By      : {{claimOfficer}}

If your claim has been approved, payment will be processed to your registered PayNow account within 3–5 working days. You will receive a separate Payment Advice once the transfer is initiated.

If you disagree with the outcome, you may lodge a formal review request within 30 days by contacting us at {{contactEmail}}.

Log in to the claims portal to view the full assessment report: {{portalLink}}

Yours sincerely,
MSIG Insurance – Claims Team`,
    versions: [
      { v: 1, date: '2024-01-15', author: 'Admin Lee Boon Hwa', note: 'Initial assessment outcome template',
        subject: 'MSIG – Claim Assessment Complete',
        body: 'Dear {{insuredName}},\n\nYour claim {{claimRef}} has been assessed.\nApproved Amount: {{amountApproved}}\n\nMSIG Claims Team' },
      { v: 2, date: '2024-09-10', author: 'Admin Priya Sharma', note: 'Added dispute process and payment timeline',
        subject: 'MSIG Travel Claims – Assessment Outcome for {{claimRef}}',
        body: `Dear {{insuredName}},\n\nWe have completed the assessment of your travel insurance claim.\n\nClaim Reference  : {{claimRef}}\nPolicy Number    : {{policyNumber}}\nAmount Claimed   : {{amountClaimed}}\nAmount Approved  : {{amountApproved}}\nAssessed By      : {{claimOfficer}}\n\nIf your claim has been approved, payment will be processed to your registered PayNow account within 3–5 working days.\n\nYours sincerely,\nMSIG Insurance – Claims Team` },
    ],
  },
  {
    id: 'T003',
    name: 'Payment Advice',
    trigger: 'On Payment Triggered',
    channel: 'Email + SMS',
    status: 'Published',
    currentVersion: 2,
    subject: 'MSIG Travel Claims – Payment Confirmation {{paymentRef}}',
    body: `Dear {{insuredName}},

We are pleased to confirm that payment for your travel insurance claim has been processed.

Claim Reference  : {{claimRef}}
Policy Number    : {{policyNumber}}
Payment Reference: {{paymentRef}}
Amount Paid      : {{amountApproved}}
Settlement Date  : {{settledDate}}

Payment has been credited via PayNow to your registered mobile number / NRIC. Please allow up to 1 working day for funds to appear in your account.

Please retain this email as your official Payment Advice.

Should you have any queries, please contact us at {{contactEmail}} or call {{contactPhone}}.

Log in to your claims portal to download your full settlement letter: {{portalLink}}

Yours sincerely,
MSIG Insurance – Claims Team`,
    versions: [
      { v: 1, date: '2024-01-15', author: 'Admin Lee Boon Hwa', note: 'Initial payment advice template',
        subject: 'MSIG – Payment Processed',
        body: 'Dear {{insuredName}},\n\nPayment of {{amountApproved}} for claim {{claimRef}} has been processed.\nRef: {{paymentRef}}\n\nMSIG Claims Team' },
      { v: 2, date: '2024-09-10', author: 'Admin Priya Sharma', note: 'Added PayNow details and settlement date',
        subject: 'MSIG Travel Claims – Payment Confirmation {{paymentRef}}',
        body: `Dear {{insuredName}},\n\nWe are pleased to confirm that payment for your travel insurance claim has been processed.\n\nClaim Reference  : {{claimRef}}\nPayment Reference: {{paymentRef}}\nAmount Paid      : {{amountApproved}}\nSettlement Date  : {{settledDate}}\n\nYours sincerely,\nMSIG Insurance – Claims Team` },
    ],
  },
];

// ── Validation helper ─────────────────────────────────────────────────────────
function validateTemplate(subject, body) {
  const allText = subject + ' ' + body;
  const found = [...allText.matchAll(/\{\{[^}]+\}\}/g)].map(m => m[0]);
  const invalid = found.filter(k => !VALID_KEYS.has(k));
  const used = [...new Set(found.filter(k => VALID_KEYS.has(k)))];
  return { invalid, used, ok: invalid.length === 0 };
}

// ── Preview renderer ──────────────────────────────────────────────────────────
function renderPreview(text) {
  let out = text;
  TEMPLATE_VARS.forEach(v => { out = out.split(v.key).join(`<strong>${v.example}</strong>`); });
  return out.replace(/\n/g, '<br/>');
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState(0);

  // STP Rules state
  const [rules, setRules] = useState(STP_RULES);
  const [editDialog, setEditDialog] = useState({ open: false, rule: null });
  const [editLimit, setEditLimit] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  // Template state
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [editingId, setEditingId] = useState(null);
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [publishNote, setPublishNote] = useState('');
  const [validation, setValidation] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState({ open: false, tmpl: null });
  const [publishOpen, setPublishOpen] = useState(false);
  const bodyRef = useRef(null);

  // ── STP helpers ──────────────────────────────────────────────────────────
  const toggleRule = id => setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const openEdit = rule => { setEditDialog({ open: true, rule }); setEditLimit(String(rule.limit)); };
  const saveEdit = () => {
    setRules(prev => prev.map(r => r.id === editDialog.rule.id ? { ...r, limit: parseFloat(editLimit) } : r));
    setEditDialog({ open: false, rule: null });
    setSavedMsg('Rule updated successfully. Changes versioned and effective immediately.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  // ── Template helpers ──────────────────────────────────────────────────────
  const startEdit = (tmpl) => {
    setEditingId(tmpl.id);
    setDraftSubject(tmpl.subject);
    setDraftBody(tmpl.body);
    setValidation(null);
    setPublishNote('');
  };

  const cancelEdit = () => { setEditingId(null); setValidation(null); };

  const insertVariable = (varKey) => {
    const el = bodyRef.current;
    if (!el) { setDraftBody(prev => prev + varKey); return; }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = draftBody.slice(0, start) + varKey + draftBody.slice(end);
    setDraftBody(next);
    setTimeout(() => { el.focus(); el.setSelectionRange(start + varKey.length, start + varKey.length); }, 0);
  };

  const handleValidate = () => {
    const result = validateTemplate(draftSubject, draftBody);
    setValidation(result);
  };

  const handlePublish = () => {
    const result = validateTemplate(draftSubject, draftBody);
    if (!result.ok) { setValidation(result); return; }
    setPublishOpen(true);
  };

  const confirmPublish = () => {
    const now = new Date().toISOString().split('T')[0];
    setTemplates(prev => prev.map(t => {
      if (t.id !== editingId) return t;
      const newV = t.currentVersion + 1;
      return {
        ...t,
        subject: draftSubject,
        body: draftBody,
        currentVersion: newV,
        status: 'Published',
        versions: [...t.versions, { v: newV, date: now, author: 'Admin (You)', note: publishNote || 'Template updated', subject: draftSubject, body: draftBody }],
      };
    }));
    setPublishOpen(false);
    setEditingId(null);
    setValidation(null);
    setSavedMsg('Template published successfully. New version is now live.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleRollback = (tmpl, version) => {
    setTemplates(prev => prev.map(t => {
      if (t.id !== tmpl.id) return t;
      return { ...t, subject: version.subject, body: version.body, currentVersion: version.v, status: 'Published' };
    }));
    setHistoryOpen({ open: false, tmpl: null });
    setSavedMsg(`Template "${tmpl.name}" rolled back to v${version.v} successfully.`);
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const currentEditing = templates.find(t => t.id === editingId);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon sx={{ color: '#1B75BB' }} /> System Administration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure STP rules, authority limits, document requirements, and notification templates
        </Typography>
      </Box>

      {savedMsg && <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>{savedMsg}</Alert>}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} textColor="primary" indicatorColor="primary" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
        <Tab label="STP Rules" />
        <Tab label="Authority Limits" />
        <Tab label="Document Requirements" />
        <Tab label="Notification Templates" />
      </Tabs>

      {/* ── STP Rules ─────────────────────────────────────────────────────── */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Configure STP rules without developer involvement. Changes take effect immediately.
            </Typography>
            <Button variant="outlined" size="small" sx={{ color: '#1B75BB', borderColor: '#1B75BB' }}>
              View Change History
            </Button>
          </Box>
          <Card variant="outlined">
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    {['Rule ID', 'Rule Name', 'Risk Type', 'Threshold (SGD)', 'Description', 'Active', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules.map(rule => (
                    <TableRow key={rule.id} hover>
                      <TableCell><Chip label={rule.id} size="small" sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.7rem' }} /></TableCell>
                      <TableCell><Typography variant="body2" fontWeight={600}>{rule.name}</Typography></TableCell>
                      <TableCell><Chip label={rule.riskType} size="small" sx={{ bgcolor: '#1B75BB10', color: '#1B75BB', fontSize: '0.68rem', height: 20 }} /></TableCell>
                      <TableCell><Typography variant="body2" fontWeight={700} sx={{ color: '#1B75BB' }}>{rule.limit > 0 ? `SGD ${rule.limit.toLocaleString()}` : 'All'}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{rule.description}</Typography></TableCell>
                      <TableCell><Switch checked={rule.active} onChange={() => toggleRule(rule.id)} color="primary" size="small" /></TableCell>
                      <TableCell><Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(rule)} sx={{ color: '#555', fontSize: '0.72rem' }}>Edit</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Test Mode available — validate rule changes before go-live. All changes are versioned with effective date.
          </Typography>
        </Box>
      )}

      {/* ── Authority Limits ──────────────────────────────────────────────── */}
      {tab === 1 && (
        <Card variant="outlined">
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Authority Limit Tiers</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    {['Tier', 'Role', 'Min Amount (SGD)', 'Max Amount (SGD)'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {AUTHORITY_TIERS.map(t => (
                    <TableRow key={t.tier} hover>
                      <TableCell><Typography variant="body2" fontWeight={700}>{t.tier}</Typography></TableCell>
                      <TableCell><Chip label={t.role} size="small" sx={{ bgcolor: '#6A1B9A20', color: '#6A1B9A', fontSize: '0.68rem' }} /></TableCell>
                      <TableCell>SGD {t.minAmount.toLocaleString()}</TableCell>
                      <TableCell>{t.maxAmount ? `SGD ${t.maxAmount.toLocaleString()}` : 'Unlimited'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ── Document Requirements ─────────────────────────────────────────── */}
      {tab === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2,
          '@media (max-width:899px)': { gridTemplateColumns: '1fr' } }}>
          {Object.entries(DOC_REQUIREMENTS).map(([riskType, docs]) => (
            <Card variant="outlined" key={riskType}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#1B75BB' }}>{riskType}</Typography>
                {docs.map(doc => (
                  <Box key={doc.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.7, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="body2">{doc.name}</Typography>
                    <Chip label={doc.type} size="small" sx={{
                      height: 18, fontSize: '0.62rem', fontWeight: 700,
                      bgcolor: doc.type === 'Mandatory' ? '#1B75BB20' : doc.type === 'Optional' ? '#2E7D3220' : '#ED6C0220',
                      color:   doc.type === 'Mandatory' ? '#1B75BB'   : doc.type === 'Optional' ? '#2E7D32'   : '#ED6C02',
                    }} />
                  </Box>
                ))}
                <Button size="small" startIcon={<EditIcon />} sx={{ mt: 1.5, color: '#555', fontSize: '0.72rem' }}>Edit Requirements</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* ── Notification Templates ────────────────────────────────────────── */}
      {tab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>Email / Letter Templates</Typography>
              <Typography variant="caption" color="text.secondary">
                3 in-scope templates · Variables validated on save · Full version history with rollback
              </Typography>
            </Box>
          </Box>

          {/* Template List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {templates.map(tmpl => (
              <Card key={tmpl.id} variant="outlined"
                sx={{ borderLeft: editingId === tmpl.id ? '4px solid #1B75BB' : '4px solid transparent' }}>
                <CardContent sx={{ p: 2.5 }}>

                  {/* Header row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: editingId === tmpl.id ? 2 : 0 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                        <EmailIcon sx={{ color: '#1B75BB', fontSize: 18 }} />
                        <Chip label={tmpl.id} size="small" sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.68rem' }} />
                        <Typography variant="subtitle2" fontWeight={700}>{tmpl.name}</Typography>
                        <Chip label={`v${tmpl.currentVersion}`} size="small" sx={{ bgcolor: '#1B75BB15', color: '#1B75BB', fontSize: '0.65rem', fontWeight: 700, height: 18 }} />
                        <Chip label={tmpl.status} size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Trigger: <strong>{tmpl.trigger}</strong> · Channel: <strong>{tmpl.channel}</strong>
                      </Typography>
                    </Box>
                    {editingId !== tmpl.id && (
                      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                        <Button size="small" variant="outlined" startIcon={<HistoryIcon />}
                          onClick={() => setHistoryOpen({ open: true, tmpl })}
                          sx={{ color: '#607D8B', borderColor: '#ddd', fontSize: '0.72rem' }}>
                          History
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<PreviewIcon />}
                          onClick={() => { startEdit(tmpl); setTimeout(() => setPreviewOpen(true), 50); }}
                          sx={{ color: '#555', borderColor: '#ddd', fontSize: '0.72rem' }}>
                          Preview
                        </Button>
                        <Button size="small" variant="contained" startIcon={<EditIcon />}
                          onClick={() => startEdit(tmpl)}
                          sx={{ fontSize: '0.72rem' }}>
                          Edit
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* ── Inline Editor ── */}
                  {editingId === tmpl.id && (
                    <Box>
                      <Divider sx={{ mb: 2 }} />

                      {/* Variable chips */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.8 }}>
                          INSERT VARIABLE — click to insert at cursor position in body
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                          {TEMPLATE_VARS.map(v => (
                            <Tooltip key={v.key} title={`Example: ${v.example}`} arrow>
                              <Chip
                                label={v.label}
                                size="small"
                                icon={<AddIcon sx={{ fontSize: '12px !important' }} />}
                                onClick={() => insertVariable(v.key)}
                                sx={{ cursor: 'pointer', bgcolor: '#1B75BB10', color: '#1B75BB', fontWeight: 600,
                                  fontSize: '0.68rem', height: 22,
                                  '&:hover': { bgcolor: '#1B75BB25' },
                                  '& .MuiChip-icon': { color: '#1B75BB' } }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>

                      {/* Subject */}
                      <TextField
                        label="Email Subject"
                        fullWidth
                        value={draftSubject}
                        onChange={e => { setDraftSubject(e.target.value); setValidation(null); }}
                        sx={{ mb: 2 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Typography variant="caption" color="text.secondary">Subject:</Typography></InputAdornment> }}
                      />

                      {/* Body */}
                      <TextField
                        label="Email / Letter Body"
                        fullWidth
                        multiline
                        rows={14}
                        value={draftBody}
                        onChange={e => { setDraftBody(e.target.value); setValidation(null); }}
                        inputRef={bodyRef}
                        sx={{ mb: 2, fontFamily: 'monospace',
                          '& .MuiInputBase-input': { fontFamily: '"Roboto Mono", monospace', fontSize: '0.82rem', lineHeight: 1.6 } }}
                        placeholder="Type your template body here. Use {{variableName}} placeholders."
                      />

                      {/* Validation result */}
                      {validation && (
                        <Box sx={{ mb: 2 }}>
                          {validation.ok ? (
                            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ py: 0.5 }}>
                              <Typography variant="caption">
                                <strong>Validation passed.</strong> {validation.used.length} variable(s) used: {validation.used.join(', ')}
                              </Typography>
                            </Alert>
                          ) : (
                            <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ py: 0.5 }}>
                              <Typography variant="caption">
                                <strong>Unknown variable(s): </strong>{validation.invalid.join(', ')}<br />
                                Check spelling — all variables must be from the approved list above.
                              </Typography>
                            </Alert>
                          )}
                        </Box>
                      )}

                      {/* Action buttons */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button size="small" variant="outlined" startIcon={<CheckCircleIcon />}
                          onClick={handleValidate}
                          sx={{ borderColor: '#2E7D32', color: '#2E7D32', '&:hover': { borderColor: '#2E7D32' } }}>
                          Validate Variables
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<PreviewIcon />}
                          onClick={() => setPreviewOpen(true)}
                          sx={{ borderColor: '#1565C0', color: '#1565C0' }}>
                          Preview
                        </Button>
                        <Box sx={{ flex: 1 }} />
                        <Button size="small" variant="outlined" onClick={cancelEdit} sx={{ color: '#888', borderColor: '#ddd' }}>
                          Cancel
                        </Button>
                        <Button size="small" variant="contained" startIcon={<PublishIcon />}
                          onClick={handlePublish}>
                          Publish as New Version
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Variable Reference Table */}
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Template Variable Reference</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.8,
                '@media (max-width:899px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
                '@media (max-width:599px)': { gridTemplateColumns: '1fr' },
              }}>
                {TEMPLATE_VARS.map(v => (
                  <Box key={v.key} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1, bgcolor: '#f9f9fb', borderRadius: 1 }}>
                    <Chip label={v.key} size="small" sx={{ bgcolor: '#1B75BB10', color: '#1B75BB', fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace', flexShrink: 0, height: 20 }} />
                    <Box>
                      <Typography variant="caption" fontWeight={600} sx={{ display: 'block', lineHeight: 1.3 }}>{v.label}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>e.g. {v.example}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ── Edit STP Rule Dialog ──────────────────────────────────────────── */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, rule: null })} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Edit Rule – {editDialog.rule?.id}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{editDialog.rule?.name}</Typography>
          <TextField label="Threshold Amount (SGD)" type="number" fullWidth value={editLimit}
            onChange={e => setEditLimit(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start">SGD</InputAdornment> }} />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Changes are versioned with effective date and can be rolled back.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, rule: null })}>Cancel</Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={saveEdit}>Save Rule</Button>
        </DialogActions>
      </Dialog>

      {/* ── Preview Dialog ────────────────────────────────────────────────── */}
      <Dialog open={previewOpen && !!editingId} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
          <PreviewIcon sx={{ color: '#1B75BB' }} />
          Preview – {currentEditing?.name}
          <Chip label="Sample Data" size="small" sx={{ bgcolor: '#ED6C0220', color: '#ED6C02', ml: 1, fontSize: '0.68rem' }} />
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: 1.5, mb: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>SUBJECT</Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.3 }}
              dangerouslySetInnerHTML={{ __html: renderPreview(draftSubject) }} />
          </Box>
          <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>EMAIL BODY</Typography>
            <Box sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.83rem', lineHeight: 1.8, color: '#1A252F',
              whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: renderPreview(draftBody) }} />
          </Box>
          <Alert severity="info" sx={{ mt: 2, py: 0.5 }}>
            <Typography variant="caption">
              Values shown in <strong>bold</strong> are sample data. Actual values are injected at send time from the claim record.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
          <Button variant="contained" startIcon={<PublishIcon />} onClick={() => { setPreviewOpen(false); handlePublish(); }}>
            Publish as New Version
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Publish Confirmation Dialog ───────────────────────────────────── */}
      <Dialog open={publishOpen} onClose={() => setPublishOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>
          <PublishIcon sx={{ color: '#1B75BB', mr: 1, verticalAlign: 'middle' }} />
          Publish New Version
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Publishing will create <strong>v{(currentEditing?.currentVersion || 0) + 1}</strong> of <strong>{currentEditing?.name}</strong> and make it the live template immediately.
          </Typography>
          <TextField
            label="Version Note (optional)"
            fullWidth
            value={publishNote}
            onChange={e => setPublishNote(e.target.value)}
            placeholder="e.g. Updated contact details, added PayNow instruction..."
          />
          <Alert severity="warning" sx={{ mt: 2, py: 0.5 }}>
            <Typography variant="caption">
              Previous versions are retained and can be rolled back at any time from Version History.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<PublishIcon />} onClick={confirmPublish}>
            Confirm Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Version History Dialog ────────────────────────────────────────── */}
      <Dialog open={historyOpen.open} onClose={() => setHistoryOpen({ open: false, tmpl: null })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: '#1B75BB' }} />
          Version History — {historyOpen.tmpl?.name}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {historyOpen.tmpl && [...historyOpen.tmpl.versions].reverse().map((ver, idx) => {
            const isCurrent = ver.v === historyOpen.tmpl.currentVersion;
            return (
              <Box key={ver.v} sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0', bgcolor: isCurrent ? '#f0f7ff' : 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={`v${ver.v}`} size="small"
                      sx={{ bgcolor: isCurrent ? '#1B75BB' : '#f5f5f5', color: isCurrent ? 'white' : '#333', fontWeight: 700, fontSize: '0.72rem' }} />
                    {isCurrent && <Chip label="Current Live" size="small" color="success" sx={{ fontSize: '0.65rem', height: 18 }} />}
                    <Typography variant="caption" color="text.secondary">{ver.date} · {ver.author}</Typography>
                  </Box>
                  {!isCurrent && (
                    <Button size="small" variant="outlined" startIcon={<RestoreIcon />}
                      onClick={() => handleRollback(historyOpen.tmpl, ver)}
                      sx={{ color: '#ED6C02', borderColor: '#ED6C0240', fontSize: '0.72rem',
                        '&:hover': { borderColor: '#ED6C02', bgcolor: '#ED6C0208' } }}>
                      Rollback to v{ver.v}
                    </Button>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                  "{ver.note}"
                </Typography>
                <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 1, p: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>SUBJECT</Typography>
                  <Typography variant="body2" sx={{ mt: 0.2, mb: 1 }}>{ver.subject}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>BODY PREVIEW</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.2, fontFamily: 'monospace', lineHeight: 1.6, color: '#333',
                    whiteSpace: 'pre-wrap', maxHeight: 80, overflow: 'hidden' }}>
                    {ver.body.slice(0, 200)}{ver.body.length > 200 ? '…' : ''}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen({ open: false, tmpl: null })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
