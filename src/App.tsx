
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from './components/ui/sonner';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MySessions from './pages/MySessions';
import SessionEditor from './pages/SessionEditor';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="arvyax-theme">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-sessions" element={<MySessions />} />
              <Route path="/editor" element={<SessionEditor />} />
              <Route path="/editor/:id" element={<SessionEditor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
          <SonnerToaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
