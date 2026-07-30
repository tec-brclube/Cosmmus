import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ServicePage from './components/ServicePage';
import CasePage from './components/CasePage';
import Methodology from './components/Methodology';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cases from './components/Cases';
import Blog from './components/Blog';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { ContentProvider } from './context/ContentContext';
import SpaceBackground from './components/SpaceBackground';
import WhatsAppButton from './components/WhatsAppButton';
import CtaSection from './components/CtaSection';
import ApplicationForm from './components/aplicacao/ApplicationForm';
import Team from './components/equipe/Team';
import MemberPage from './components/equipe/MemberPage';
import { getMemberBySlug } from './components/equipe/teamData';

/** Views com URL própria (as demais são navegadas por estado, na raiz). */
const ROUTES: Partial<Record<ViewState, string>> = {
  aplicacao: '/aplicacaocosmmus',
  equipe: '/equipe',
};

/** Prefixo das páginas individuais da equipe: /equipe/<slug> */
const MEMBER_PREFIX = '/equipe/';

interface Route {
  view: ViewState;
  memberSlug?: string;
}

const routeFromPath = (pathname: string): Route | null => {
  const normalized = pathname.replace(/\/+$/, '').toLowerCase() || '/';

  if (normalized.startsWith(MEMBER_PREFIX)) {
    const slug = normalized.slice(MEMBER_PREFIX.length);
    // Slug desconhecido cai na listagem, evitando uma página vazia
    return getMemberBySlug(slug) ? { view: 'equipe-detalhe', memberSlug: slug } : { view: 'equipe' };
  }

  const entry = Object.entries(ROUTES).find(([, path]) => path === normalized);
  return entry ? { view: entry[0] as ViewState } : null;
};

/** Endereço correspondente ao estado atual da navegação. */
const pathFromView = (view: ViewState, memberSlug: string | null): string => {
  if (view === 'equipe-detalhe' && memberSlug) return `${MEMBER_PREFIX}${memberSlug}`;
  return ROUTES[view] || '/';
};

const AppContent: React.FC = () => {
  const initialRoute = routeFromPath(window.location.pathname);
  const [currentView, setCurrentView] = useState<ViewState>(initialRoute?.view || 'home');
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [currentMemberSlug, setCurrentMemberSlug] = useState<string | null>(initialRoute?.memberSlug || null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, currentMemberSlug]);

  // Mantém a URL sincronizada com as views que possuem endereço próprio
  useEffect(() => {
    const desired = pathFromView(currentView, currentMemberSlug);
    if (window.location.pathname.replace(/\/+$/, '') !== desired.replace(/\/+$/, '')) {
      window.history.pushState({}, '', desired);
    }
  }, [currentView, currentMemberSlug]);

  // Botões voltar/avançar do navegador
  useEffect(() => {
    const handlePopState = () => {
      const route = routeFromPath(window.location.pathname);
      setCurrentView(route?.view || 'home');
      setCurrentMemberSlug(route?.memberSlug || null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleViewMember = (slug: string) => {
    setCurrentMemberSlug(slug);
    setCurrentView('equipe-detalhe');
  };

  const handleViewService = (serviceId: string) => {
    setCurrentServiceId(serviceId);
    setCurrentView('service-details');
  };

  const handleViewCase = (caseId: string) => {
    setCurrentCaseId(caseId);
    setCurrentView('case-details');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onCtaClick={() => setCurrentView('contact')} />
            <div className="py-12">
                <Services limit={3} onViewAll={() => setCurrentView('services')} onViewService={handleViewService} />
            </div>
            <Methodology preview />
            <CtaSection onCtaClick={() => setCurrentView('contact')} />
          </>
        );
      case 'about':
        return <About />;
      case 'services':
        return <Services onViewService={handleViewService} />;
      case 'service-details':
        return <ServicePage serviceId={currentServiceId || ''} onBack={() => setCurrentView('services')} />;
      case 'methodology':
        return <Methodology />;
      case 'cases':
        return <Cases onViewCase={handleViewCase} />;
      case 'case-details':
        return <CasePage caseId={currentCaseId || ''} onBack={() => setCurrentView('cases')} />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      case 'equipe':
        return <Team onViewMember={handleViewMember} onCtaClick={() => setCurrentView('contact')} />;
      case 'equipe-detalhe':
        return (
          <MemberPage
            slug={currentMemberSlug || ''}
            onBack={() => setCurrentView('equipe')}
            onViewMember={handleViewMember}
            onCtaClick={() => setCurrentView('contact')}
          />
        );
      case 'aplicacao':
        return <ApplicationForm />;
      default:
        return <Hero onCtaClick={() => setCurrentView('contact')} />;
    }
  };

  const renderMainContent = () => {
    if (currentView === 'admin') {
      if (!isAdminAuthenticated) {
        return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} onCancel={() => setCurrentView('home')} />;
      }
      return <AdminPanel onLogout={() => setIsAdminAuthenticated(false)} onExit={() => setCurrentView('home')} />;
    }

    return (
      <>
        <Navbar currentView={currentView} onChangeView={setCurrentView} />
        <main className="flex-grow pt-20 relative z-10">
          {renderContent()}
        </main>
        <Footer onViewChange={setCurrentView} />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white selection:bg-brand-pink selection:text-white relative">
      <SpaceBackground />
      {renderMainContent()}
      <WhatsAppButton />
    </div>
  );
};

const App: React.FC = () => {
    return (
        <ContentProvider>
            <AppContent />
        </ContentProvider>
    );
}

export default App;
