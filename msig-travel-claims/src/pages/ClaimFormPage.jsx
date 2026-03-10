import { useState } from 'react';
import {
  Box, Stepper, Step, StepLabel, Button, Typography, Container,
  CircularProgress, Card, CardContent, Chip, LinearProgress,
  Alert
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useClaim } from '../context/ClaimContext';
import SectionA from '../components/claims/SectionA/SectionA';
import SectionB from '../components/claims/SectionB/SectionB';
import SectionC from '../components/claims/SectionC/SectionC';
import SectionD from '../components/claims/SectionD/SectionD';
import SectionE from '../components/claims/SectionE/SectionE';
import DocumentUpload from '../components/documents/DocumentUpload';

function ReviewSummary({ claimData, auth }) {
  const enabledSections = ['sectionB', 'sectionC', 'sectionD', 'sectionE'].filter(s => claimData[s]?.enabled);
  const LABELS = {
    sectionB: 'Personal Accident (Section B)',
    sectionC: 'Travel Inconvenience (Section C)',
    sectionD: 'Personal Liability (Section D)',
    sectionE: 'COVID-19 (Section E)',
  };
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#1B75BB' }}>Review & Submit</Typography>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Policy Information</Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[['Policy No.', auth.policy?.policyNumber], ['Plan', auth.policy?.planType], ['Insured', auth.policy?.insuredPersons?.join(', ')]].map(([l, v]) => (
              <Box key={l}><Typography variant="caption" color="text.secondary">{l}</Typography><Typography variant="body2" fontWeight={600}>{v}</Typography></Box>
            ))}
          </Box>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1565C0' }}>Section A – Shared Details</Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              ['Travel Period', `${claimData.sectionA?.travelFrom || '—'} → ${claimData.sectionA?.travelTo || '—'}`],
              ['Country of Loss', claimData.sectionA?.countryOfLoss || '—'],
              ['Location', claimData.sectionA?.accidentLocation || '—'],
              ['PayNow', claimData.sectionA?.payNowNumber || '—'],
            ].map(([l, v]) => (
              <Box key={l}><Typography variant="caption" color="text.secondary">{l}</Typography><Typography variant="body2" fontWeight={600}>{v}</Typography></Box>
            ))}
          </Box>
          {claimData.sectionA?.lossDescription && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">Description: </Typography>
              <Typography variant="caption">{claimData.sectionA.lossDescription}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      {enabledSections.length === 0 && (
        <Alert severity="warning">No risk sections selected. Please go back to Section A and select at least one cover.</Alert>
      )}
      {enabledSections.map(s => (
        <Card variant="outlined" sx={{ mb: 2 }} key={s}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={700}>{LABELS[s]}</Typography>
              <Chip label="Included" size="small" color="success" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Data captured. Documents uploaded: {(claimData.documents?.[s] || []).length} file(s).
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Alert severity="info" sx={{ mt: 2 }}>
        By submitting, you confirm all information is accurate and complete. Your claim will be processed via MSIG's STP automation pipeline.
      </Alert>
    </Box>
  );
}

function SubmittedPage({ claimRef, onNewClaim, onViewClaim }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: '#2E7D32', mb: 2 }} />
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>Claim Submitted!</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>Your claim reference number:</Typography>
      <Chip label={claimRef} sx={{ fontSize: '1.2rem', height: 48, px: 3, bgcolor: '#1B75BB', color: 'white', fontWeight: 700, mb: 4 }} />
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: 500, mx: 'auto' }}>
        Confirmation email/SMS sent. STP automation will process your claim within minutes.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Stages: Submitted → Registered → Assessment → Payment Approved → Settled
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={onViewClaim}>View Claim Status</Button>
        <Button variant="outlined" onClick={onNewClaim} sx={{ color: '#1B75BB', borderColor: '#1B75BB' }}>Submit Another Claim</Button>
      </Box>
    </Box>
  );
}

export default function ClaimFormPage() {
  const { auth, claimData, updateSection, resetClaimForm, submitClaim, activeStep, setActiveStep, navigateTo, setSelectedClaimId } = useClaim();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [claimRef, setClaimRef] = useState('');

  const enabledSections = ['sectionB', 'sectionC', 'sectionD', 'sectionE'].filter(s => claimData[s]?.enabled);

  const SECTION_LABELS = {
    sectionB: 'Section B\nPersonal Accident',
    sectionC: 'Section C\nTravel Inconvenience',
    sectionD: 'Section D\nPersonal Liability',
    sectionE: 'Section E\nCOVID-19',
  };

  const allSteps = [
    { key: 'sectionA', label: 'Section A\nShared Details' },
    ...enabledSections.map(s => ({ key: s, label: SECTION_LABELS[s] })),
    { key: 'documents', label: 'Documents\nUpload' },
    { key: 'review', label: 'Review &\nSubmit' },
  ];

  const totalSteps = allSteps.length;
  const currentStepKey = allSteps[activeStep]?.key;

  const handleNext = () => setActiveStep(prev => Math.min(prev + 1, totalSteps - 1));
  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    const ref = `CLM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    submitClaim(ref);
    setClaimRef(ref);
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleNewClaim = () => {
    resetClaimForm();
    setSubmitted(false);
    setActiveStep(0);
  };

  const handleViewClaim = () => {
    setSelectedClaimId(claimRef);
    navigateTo('claim-detail', claimRef);
  };

  if (submitted) {
    return (
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pt: 10, pb: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: 'white', borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <SubmittedPage claimRef={claimRef} onNewClaim={handleNewClaim} onViewClaim={handleViewClaim} />
          </Box>
        </Container>
      </Box>
    );
  }

  const renderSection = () => {
    switch (currentStepKey) {
      case 'sectionA':
        return <SectionA data={claimData.sectionA} onChange={d => updateSection('sectionA', d)} claimData={claimData} updateSection={updateSection} />;
      case 'sectionB':
        return <SectionB data={claimData.sectionB?.data || {}} onChange={d => updateSection('sectionB', prev => ({ ...prev, data: d }))} />;
      case 'sectionC':
        return <SectionC data={claimData.sectionC?.data || {}} onChange={d => updateSection('sectionC', prev => ({ ...prev, data: d }))} />;
      case 'sectionD':
        return <SectionD data={claimData.sectionD?.data || {}} onChange={d => updateSection('sectionD', prev => ({ ...prev, data: d }))} />;
      case 'sectionE':
        return <SectionE data={claimData.sectionE?.data || {}} onChange={d => updateSection('sectionE', prev => ({ ...prev, data: d }))} />;
      case 'documents':
        return <DocumentUpload claimData={claimData} data={claimData.documents || {}} onChange={d => updateSection('documents', d)} />;
      case 'review':
        return <ReviewSummary claimData={claimData} auth={auth} />;
      default:
        return null;
    }
  };

  const progress = ((activeStep + 1) / totalSteps) * 100;

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pt: 10, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigateTo('dashboard')}
            sx={{ color: '#607D8B', fontSize: '0.78rem', pl: 0, '&:hover': { bgcolor: 'transparent', color: '#1B75BB' } }}
          >
            Back to Dashboard
          </Button>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Claim Form Progress</Typography>
            <Typography variant="caption" color="text.secondary">{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} color="primary" />
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 0.8 }}>
            <Typography variant="caption" color="text.secondary">
              Step {activeStep + 1} of {totalSteps} — {allSteps[activeStep]?.label?.replace('\n', ': ')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: { xs: 'none', sm: 'block' } }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {allSteps.map((step, idx) => (
              <Step key={step.key} completed={idx < activeStep}>
                <StepLabel>
                  {step.label.split('\n').map((line, i) => (
                    <Typography key={i} variant="caption" display="block" sx={{ lineHeight: 1.3 }}>{line}</Typography>
                  ))}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', mb: 3 }}>
          {renderSection()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ borderColor: '#1B75BB', color: '#1B75BB', flex: { xs: 1, sm: 'none' } }}
          >
            Back
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>Step {activeStep + 1} of {totalSteps}</Typography>
          {activeStep < totalSteps - 1 ? (
            <Button variant="contained" endIcon={<NavigateNextIcon />} onClick={handleNext} sx={{ flex: { xs: 1, sm: 'none' } }}>Next</Button>
          ) : (
            <Button
              variant="contained"
              endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ minWidth: 160, bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, flex: { xs: 1, sm: 'none' } }}
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
