import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import ScrollToTop from '../components/layout/ScrollToTop.jsx';
import { AppProviders } from './providers.jsx';
import { AppRoutes } from './routes.jsx';
import SplashScreen from '../components/ui/SplashScreen.jsx';

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-slate-100">
      
      {/* Decorative ambient background glows (hidden on landing since it has its own) */}
      {!isLanding && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] glow-primary rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] glow-accent rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[10%] left-1/3 w-[600px] h-[600px] glow-primary rounded-full blur-[150px] pointer-events-none z-0"></div>
        </>
      )}

      <Navbar />
      
      <main className={`flex-grow z-10 relative ${isLanding ? '' : 'pt-20'}`}>
        <AppRoutes />
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <AppProviders>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AppProviders>
  );
}

export default App;
