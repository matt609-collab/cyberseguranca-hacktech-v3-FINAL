import React, { useState, useEffect } from 'react';
import { CommandCenter } from './components/CommandCenter';
import { PlansPage } from './components/PlansPage';
import { CreditsPage } from './components/CreditsPage';
import { LoginPage } from './components/LoginPage';
import { DolmayanChat } from './components/PitAiChat';

type PageType = 'command' | 'plans' | 'credits' | 'login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('authenticated') === 'true';
    }
    return false;
  });

  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('planos')) return 'plans';
      if (hash.includes('creditos') || hash.includes('especificacoes')) return 'credits';
      if (hash.includes('login')) return 'login';
    }
    return 'command';
  });

  // Keep hash in sync with current page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('planos')) setCurrentPage('plans');
      else if (hash.includes('creditos') || hash.includes('especificacoes')) setCurrentPage('credits');
      else if (hash.includes('login')) setCurrentPage('login');
      else setCurrentPage('command');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    if (page === 'plans') window.location.hash = '#/planos';
    else if (page === 'credits') window.location.hash = '#/creditos';
    else if (page === 'login') window.location.hash = '#/login';
    else window.location.hash = '#/';
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigateTo('command');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated');
    setIsAuthenticated(false);
    navigateTo('login');
  };

  // If not authenticated, enforce Login
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <DolmayanChat />
      </>
    );
  }

  // Authenticated Views
  return (
    <>
      {currentPage === 'plans' && <PlansPage onBack={() => navigateTo('command')} />}
      {currentPage === 'credits' && <CreditsPage onBack={() => navigateTo('command')} />}
      {currentPage === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'command' && (
        <CommandCenter
          onNavigate={(page) => navigateTo(page)}
          onLogout={handleLogout}
        />
      )}
      <DolmayanChat />
    </>
  );
}

