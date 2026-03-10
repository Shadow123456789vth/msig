import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import theme from './theme/theme';
import { ClaimProvider, useClaim } from './context/ClaimContext';
import Header from './components/Layout/Header';
import Sidebar, { DRAWER_WIDTH, COLLAPSED_WIDTH } from './components/Layout/Sidebar';
import LoginPage from './components/Auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClaimsListPage from './pages/ClaimsListPage';
import ClaimDetailPage from './pages/ClaimDetailPage';
import ClaimFormPage from './pages/ClaimFormPage';
import WorkbenchPage from './pages/WorkbenchPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { auth, currentPage } = useClaim();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!auth.authenticated) return <LoginPage />;

  // Full-screen pages (own layout)
  if (currentPage === 'new-claim') return <ClaimFormPage />;

  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':     return <DashboardPage />;
      case 'claims-list':   return <ClaimsListPage />;
      case 'claim-detail':  return <ClaimDetailPage />;
      case 'workbench':     return <WorkbenchPage />;
      case 'analytics':     return <AnalyticsPage />;
      case 'admin':         return <AdminPage />;
      default:              return <DashboardPage />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      {/* Permanent sidebar (desktop) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar
          variant="permanent"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(prev => !prev)}
        />
      </Box>

      {/* Temporary sidebar (mobile) */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Sidebar variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </Box>

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, transition: 'margin 0.22s cubic-bezier(0.4,0,0.6,1)' }}>
        <Header onMenuClick={() => setMobileOpen(true)} sidebarWidth={sidebarWidth} />
        <Toolbar /> {/* spacer for fixed AppBar */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {renderPage()}
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClaimProvider>
        <AppContent />
      </ClaimProvider>
    </ThemeProvider>
  );
}
