import { useState, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Chip, LinearProgress,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
  IconButton, Alert, Grid
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import SectionHeader from '../common/SectionHeader';

const REQUIRED_DOCS = {
  sectionB: [
    { label: 'Medical Certificates / Doctor Reports', mandatory: true },
    { label: 'Hospital Discharge Summary', mandatory: true },
    { label: 'Original Medical Bills & Receipts', mandatory: true },
    { label: 'Police Report (if applicable)', mandatory: false },
  ],
  sectionC: [
    { label: 'Airline/Transport Delay Confirmation Letter', mandatory: true },
    { label: 'Original Receipts for Additional Expenses', mandatory: true },
    { label: 'Booking Confirmation & Cancellation Notice', mandatory: false },
    { label: 'Police Report (for baggage loss)', mandatory: false },
  ],
  sectionD: [
    { label: 'Third-Party Claim Notice / Legal Documents', mandatory: true },
    { label: 'Rental Vehicle Agreement', mandatory: false },
    { label: 'Repair Invoices', mandatory: false },
  ],
  sectionE: [
    { label: 'COVID-19 Positive Test Result (Official)', mandatory: true },
    { label: 'Medical Certificate confirming COVID-19 diagnosis', mandatory: true },
    { label: 'Hospital / Clinic Bills & Receipts', mandatory: true },
    { label: 'Quarantine Order (if applicable)', mandatory: false },
  ],
};

const SECTION_LABELS = {
  sectionB: 'Section B – Personal Accident',
  sectionC: 'Section C – Travel Inconvenience',
  sectionD: 'Section D – Personal Liability',
  sectionE: 'Section E – COVID-19',
};

const ACCEPTED_FORMATS = '.pdf,.jpg,.jpeg,.png,.tiff';
const MAX_FILE_SIZE_MB = 10;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return <PictureAsPdfIcon sx={{ color: '#e53935' }} />;
  return <ImageIcon sx={{ color: '#1565C0' }} />;
}

export default function DocumentUpload({ claimData, data, onChange }) {
  const [uploading, setUploading] = useState({});
  const inputRefs = {
    sectionB: useRef(),
    sectionC: useRef(),
    sectionD: useRef(),
    sectionE: useRef(),
  };

  const enabledSections = ['sectionB', 'sectionC', 'sectionD', 'sectionE'].filter(s => claimData[s]?.enabled);

  const handleFileSelect = async (section, files) => {
    const fileArray = Array.from(files);
    const errors = [];
    const validFiles = [];

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        continue;
      }
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'jpg', 'jpeg', 'png', 'tiff'].includes(ext)) {
        errors.push(`${file.name} is not a supported format.`);
        continue;
      }
      validFiles.push(file);
    }

    if (errors.length) {
      alert(errors.join('\n'));
    }

    if (!validFiles.length) return;

    // Simulate upload progress
    setUploading(prev => ({ ...prev, [section]: true }));
    await new Promise(r => setTimeout(r, 1200));
    setUploading(prev => ({ ...prev, [section]: false }));

    const existing = data[section] || [];
    const newFiles = validFiles.map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
      status: 'Uploaded',
      uploadedAt: new Date().toLocaleTimeString(),
    }));
    onChange({ ...data, [section]: [...existing, ...newFiles] });
  };

  const removeFile = (section, id) => {
    const updated = (data[section] || []).filter(f => f.id !== id);
    onChange({ ...data, [section]: updated });
  };

  if (enabledSections.length === 0) {
    return (
      <Box>
        <SectionHeader icon={<UploadFileIcon />} title="Document Upload" subtitle="Upload supporting documents for your claim" />
        <Alert severity="warning">
          Please select at least one risk cover section in Section A before uploading documents.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <SectionHeader
        icon={<UploadFileIcon />}
        title="Document Upload"
        subtitle="Upload supporting documents for each selected risk cover"
      />

      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        Accepted formats: PDF, JPG, PNG, TIFF. Maximum file size: {MAX_FILE_SIZE_MB}MB per file.
        AI-powered IDP will automatically extract data from uploaded documents.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {enabledSections.map(section => {
          const sectionDocs = data[section] || [];
          const reqDocs = REQUIRED_DOCS[section] || [];
          const mandatoryCount = reqDocs.filter(d => d.mandatory).length;
          const uploadedCount = sectionDocs.length;

          return (
            <Card variant="outlined" key={section}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>{SECTION_LABELS[section]}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`${uploadedCount} file(s) uploaded`} size="small" color={uploadedCount >= mandatoryCount ? 'success' : 'default'} />
                  </Box>
                </Box>

                {/* Required documents checklist */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Documents Required
                  </Typography>
                  <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
                    {reqDocs.map(doc => (
                      <Grid item xs={12} sm={6} key={doc.label}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: doc.mandatory ? '#1B75BB' : '#aaa', flexShrink: 0 }} />
                          <Typography variant="caption" color={doc.mandatory ? 'text.primary' : 'text.secondary'}>
                            {doc.label}
                            {doc.mandatory && <span style={{ color: '#1B75BB' }}> *</span>}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Upload area */}
                <Box
                  onClick={() => inputRefs[section].current?.click()}
                  sx={{
                    border: '2px dashed #1B75BB50',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: '#1B75BB05',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#1B75BB', bgcolor: '#1B75BB10' },
                    mb: 2,
                  }}
                >
                  <UploadFileIcon sx={{ fontSize: 36, color: '#1B75BB80', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to upload or drag & drop files
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, JPG, PNG, TIFF up to {MAX_FILE_SIZE_MB}MB
                  </Typography>
                  <input
                    ref={inputRefs[section]}
                    type="file"
                    accept={ACCEPTED_FORMATS}
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect(section, e.target.files)}
                  />
                </Box>

                {uploading[section] && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Uploading...</Typography>
                    <LinearProgress sx={{ mt: 0.5, borderRadius: 1 }} color="primary" />
                  </Box>
                )}

                {/* Uploaded files list */}
                {sectionDocs.length > 0 && (
                  <List dense>
                    {sectionDocs.map(file => (
                      <ListItem
                        key={file.id}
                        sx={{ bgcolor: '#f9f9f9', borderRadius: 1, mb: 0.5, border: '1px solid #e0e0e0' }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getFileIcon(file.name)}
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={500}>{file.name}</Typography>}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">{formatBytes(file.size)}</Typography>
                              <Chip
                                icon={<CheckCircleIcon sx={{ fontSize: '12px !important' }} />}
                                label={file.status}
                                size="small"
                                color="success"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                              <Typography variant="caption" color="text.secondary">{file.uploadedAt}</Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => removeFile(section, file.id)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
