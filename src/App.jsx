import { useEffect, useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Login from './pages/Login';
import Contact from './pages/Contact';

import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState('overview');
  const [selectedLead, setSelectedLead] = useState(null);

  const isContactPage =
    window.location.pathname === '/contact';

  useEffect(() => {
    const getSession = async () => {
      const { data } =
        await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setCurrentPage('lead-details');
  };

  const handleBackToLeads = () => {
    setSelectedLead(null);
    setCurrentPage('leads');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setSelectedLead(null);
    setCurrentPage('overview');
  };

  const handleSettings = () => {
    alert(
      'Settings are managed through the Supabase admin configuration.'
    );
  };

  /*
    Public Contact Page

    Anyone can access:
    http://localhost:5173/contact

    Login is not required for this page.
  */
  if (isContactPage) {
    return <Contact />;
  }

  /*
    Show loading screen while checking
    whether the admin is already logged in.
  */
  if (loading) {
    return (
      <div className="loading-screen">
        Loading LeadEase...
      </div>
    );
  }

  /*
    If there is no logged-in admin,
    show the Login page.
  */
  if (!session) {
    return <Login onLogin={setSession} />;
  }

  /*
    Admin CRM
  */
  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        onSettings={handleSettings}
      />

      <main className="main-content">
        <Topbar />

        {currentPage === 'overview' && (
          <Dashboard />
        )}

        {currentPage === 'leads' && (
          <Leads
            onViewLead={handleViewLead}
          />
        )}

        {currentPage === 'lead-details' &&
          selectedLead && (
            <LeadDetails
              lead={selectedLead}
              onBack={handleBackToLeads}
            />
          )}
      </main>
    </div>
  );
}

export default App;