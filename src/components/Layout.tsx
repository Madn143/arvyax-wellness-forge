
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Plus, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">Arvyax Wellness</h1>
            <nav className="flex space-x-2">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={location.pathname === '/my-sessions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/my-sessions')}
                className="flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>My Sessions</span>
              </Button>
              <Button
                variant={location.pathname === '/editor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/editor')}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>New Session</span>
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
