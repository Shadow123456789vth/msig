import { createContext, useContext, useState } from 'react';
import { DEMO_CLAIMS, DEMO_NOTIFICATIONS, POLICIES } from '../data/demoData';

const ClaimContext = createContext(null);

export function ClaimProvider({ children }) {
  const [auth, setAuth] = useState({ authenticated: false, policy: null, user: null });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [claims, setClaims] = useState(DEMO_CLAIMS);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [claimData, setClaimData] = useState({
    sectionA: {},
    sectionB: { enabled: false, data: {} },
    sectionC: { enabled: false, data: {} },
    sectionD: { enabled: false, data: {} },
    sectionE: { enabled: false, data: {} },
    documents: {},
  });
  const [activeStep, setActiveStep] = useState(0);

  const updateSection = (section, data) => {
    setClaimData(prev => ({
      ...prev,
      [section]: typeof data === 'function' ? data(prev[section]) : { ...prev[section], ...data },
    }));
  };

  const resetClaimForm = () => {
    setClaimData({
      sectionA: {},
      sectionB: { enabled: false, data: {} },
      sectionC: { enabled: false, data: {} },
      sectionD: { enabled: false, data: {} },
      sectionE: { enabled: false, data: {} },
      documents: {},
    });
    setActiveStep(0);
  };

  const submitClaim = (claimRef) => {
    const newClaim = {
      id: claimRef,
      policyNumber: auth.policy?.policyNumber,
      insuredName: auth.policy?.insuredPersons?.[0] || auth.user?.name,
      claimType: [
        claimData.sectionB?.enabled && 'Personal Accident',
        claimData.sectionC?.enabled && 'Travel Inconvenience',
        claimData.sectionD?.enabled && 'Personal Liability',
        claimData.sectionE?.enabled && 'COVID-19',
      ].filter(Boolean),
      status: 'Submitted',
      stpStatus: 'Processing',
      submittedDate: new Date().toISOString().split('T')[0],
      registeredDate: null,
      assessedDate: null,
      settledDate: null,
      countryOfLoss: claimData.sectionA?.countryOfLoss || '',
      lossDescription: claimData.sectionA?.lossDescription || '',
      amountClaimed: 0,
      amountApproved: null,
      paymentRef: null,
      claimOfficer: null,
      documents: [],
      timeline: [
        { stage: 'Submitted', date: new Date().toLocaleString(), note: 'Claim submitted via portal. STP validation in progress...' },
      ],
      sectionA: claimData.sectionA,
      sectionB: claimData.sectionB,
      sectionC: claimData.sectionC,
      sectionD: claimData.sectionD,
      sectionE: claimData.sectionE,
    };
    setClaims(prev => [newClaim, ...prev]);
    const notif = {
      id: Date.now(),
      type: 'info',
      message: `Claim ${claimRef} submitted successfully. STP processing in progress.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      claimId: claimRef,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const login = (policyData, userInfo) => {
    setAuth({ authenticated: true, policy: policyData, user: userInfo });
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setAuth({ authenticated: false, policy: null, user: null });
    setCurrentPage('dashboard');
    resetClaimForm();
  };

  const navigateTo = (page, claimId = null) => {
    setCurrentPage(page);
    if (claimId) setSelectedClaimId(claimId);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ClaimContext.Provider value={{
      auth, login, logout,
      currentPage, navigateTo,
      selectedClaimId, setSelectedClaimId,
      claims, setClaims,
      notifications, markNotificationRead, markAllRead, unreadCount,
      claimData, updateSection, resetClaimForm, submitClaim,
      activeStep, setActiveStep,
    }}>
      {children}
    </ClaimContext.Provider>
  );
}

export const useClaim = () => useContext(ClaimContext);
