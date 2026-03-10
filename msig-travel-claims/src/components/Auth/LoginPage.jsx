import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
  CircularProgress, Divider, InputAdornment, Stepper, Step, StepLabel, Chip
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PolicyIcon from '@mui/icons-material/Policy';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import bloomLogo from '../../assets/Bloom_logo.jpg';
import { useClaim } from '../../context/ClaimContext';

// Mock policy data
const MOCK_POLICIES = {
  'TRV-2024-001234': {
    policyNumber: 'TRV-2024-001234',
    status: 'Active',
    planType: 'Travel Easy Plus',
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    insuredPersons: ['John Tan', 'Mary Tan'],
    covers: ['Personal Accident', 'Travel Inconvenience', 'Personal Liability', 'COVID-19'],
    sumInsured: 500000,
    mobile: '91234567',
    email: 'john.tan@email.com',
  },
  'TRV-2024-005678': {
    policyNumber: 'TRV-2024-005678',
    status: 'Active',
    planType: 'Travel Easy Basic',
    effectiveFrom: '2024-03-01',
    effectiveTo: '2025-02-28',
    insuredPersons: ['Sarah Lim'],
    covers: ['Personal Accident', 'Travel Inconvenience'],
    sumInsured: 250000,
    mobile: '98765432',
    email: 'sarah.lim@email.com',
  },
};

const MOCK_OTP = '123456';

export default function LoginPage() {
  const { login } = useClaim();
  const [step, setStep] = useState(0); // 0=identifier, 1=otp, 2=policy validated
  const [identifier, setIdentifier] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [validatedPolicy, setValidatedPolicy] = useState(null);

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!policyNumber.trim() || !identifier.trim()) {
      setError('Please enter your policy number and mobile/email.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setOtpSent(true);
    setStep(1);
    startResendTimer();
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) { setError('Please enter the OTP.'); return; }
    // Any OTP is accepted
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    // Use matching policy or fall back to a default policy for any credentials
    const policy = MOCK_POLICIES[policyNumber.toUpperCase()] || {
      policyNumber: policyNumber.toUpperCase(),
      status: 'Active',
      planType: 'Travel Easy Plus',
      effectiveFrom: '2024-01-01',
      effectiveTo: '2025-12-31',
      insuredPersons: ['Policyholder'],
      covers: ['Personal Accident', 'Travel Inconvenience', 'Personal Liability', 'COVID-19'],
      sumInsured: 500000,
      mobile: identifier,
      email: identifier,
    };
    setValidatedPolicy(policy);
    setStep(2);
  };

  const handleProceed = () => {
    login(validatedPolicy, { name: validatedPolicy.insuredPersons[0], mobile: identifier });
  };

  const identifierIcon = identifier.includes('@') ? <EmailIcon sx={{ color: '#aaa' }} /> : <PhoneIcon sx={{ color: '#aaa' }} />;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #1B75BB 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}>
      <Card sx={{ width: '100%', maxWidth: 460, borderRadius: 3, overflow: 'visible' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img src={bloomLogo} alt="Bloom" style={{ height: 56, objectFit: 'contain', marginBottom: 8 }} />
            <Typography variant="h5" sx={{ color: '#1B75BB', fontWeight: 700 }}>
              MSIG Travel Claims
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Secure Portal Access
            </Typography>
          </Box>

          <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
            {['Identify', 'Verify OTP', 'Confirm Policy'].map(label => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

          {/* Step 0: Enter credentials */}
          {step === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Policy Number"
                placeholder="e.g. TRV-2024-001234"
                value={policyNumber}
                onChange={e => setPolicyNumber(e.target.value)}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><PolicyIcon sx={{ color: '#aaa' }} /></InputAdornment> }}
                helperText="Try: TRV-2024-001234"
              />
              <TextField
                label="Mobile Number or Email"
                placeholder="e.g. 91234567 or john@email.com"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start">{identifierIcon}</InputAdornment> }}
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSendOTP}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                sx={{ mt: 1, py: 1.5 }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Box>
          )}

          {/* Step 1: OTP Verification */}
          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="success" icon={<CheckCircleIcon />}>
                OTP sent to <strong>{identifier}</strong>
              </Alert>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Enter the 6-digit OTP. It expires in 5 minutes.
              </Typography>
              <TextField
                label="One-Time Password (OTP)"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                fullWidth
                inputProps={{ maxLength: 6, style: { letterSpacing: 8, fontSize: 22, textAlign: 'center', fontWeight: 700 } }}
                placeholder="• • • • • •"
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleVerifyOTP}
                disabled={loading || attempts >= 3}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                {resendTimer > 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    Resend OTP in {resendTimer}s
                  </Typography>
                ) : (
                  <Button size="small" onClick={handleSendOTP} sx={{ color: '#1B75BB' }}>
                    Resend OTP
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* Step 2: Policy Confirmed */}
          {step === 2 && validatedPolicy && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="success" icon={<CheckCircleIcon />}>
                Policy validated successfully!
              </Alert>
              <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#1B75BB', mb: 1 }}>
                  Policy Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Row label="Policy No." value={validatedPolicy.policyNumber} />
                  <Row label="Plan" value={validatedPolicy.planType} />
                  <Row label="Valid Until" value={validatedPolicy.effectiveTo} />
                  <Row label="Insured" value={validatedPolicy.insuredPersons.join(', ')} />
                </Box>
                <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {validatedPolicy.covers.map(c => (
                    <Chip key={c} label={c} size="small" sx={{ bgcolor: '#1B75BB10', color: '#1B75BB', fontSize: '0.7rem' }} />
                  ))}
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleProceed}
                sx={{ py: 1.5 }}
              >
                Proceed to File Claim
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            Need help? Call 1800-MSIG-123 | Powered by DXC Technology
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function Row({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="caption" fontWeight={600}>{value}</Typography>
    </Box>
  );
}
