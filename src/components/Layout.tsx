
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Plus, User, Settings, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut, sessionLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90">
      {/* Glassmorphism header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Arvyax Wellness
                </h1>
              </div>
              
              {/* Navigation - Hidden on mobile, shown on tablet+ */}
              <nav className="hidden md:flex space-x-1">
                <Button
                  variant={location.pathname === '/' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 backdrop-blur-sm bg-background/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
                <Button
                  variant={location.pathname === '/my-sessions' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/my-sessions')}
                  className="flex items-center space-x-2 backdrop-blur-sm bg-background/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">My Sessions</span>
                </Button>
                <Button
                  variant={location.pathname === '/editor' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/editor')}
                  className="flex items-center space-x-2 backdrop-blur-sm bg-background/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">New Session</span>
                </Button>
              </nav>
            </div>

            {/* Right side - User info and controls */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative backdrop-blur-md bg-background/50 hover:bg-background/80 border border-border/50 transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
              </Button>
              
              <ThemeToggle />
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full backdrop-blur-md bg-background/50 hover:bg-background/80 border border-border/50 transition-all duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 backdrop-blur-md bg-background/95 border border-border/50" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    disabled={sessionLoading}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile logout button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                disabled={sessionLoading}
                className="sm:hidden backdrop-blur-sm bg-background/50 hover:bg-destructive/10 hover:text-destructive border-border/50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-around py-2">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/')}
                className="flex-1 flex flex-col items-center space-y-1 h-auto py-2"
              >
                <Home className="h-4 w-4" />
                <span className="text-xs">Dashboard</span>
              </Button>
              <Button
                variant={location.pathname === '/my-sessions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/my-sessions')}
                className="flex-1 flex flex-col items-center space-y-1 h-auto py-2"
              >
                <User className="h-4 w-4" />
                <span className="text-xs">Sessions</span>
              </Button>
              <Button
                variant={location.pathname === '/editor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/editor')}
                className="flex-1 flex flex-col items-center space-y-1 h-auto py-2"
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs">Create</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with glassmorphism effect */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="backdrop-blur-sm bg-background/30 rounded-xl sm:rounded-2xl border border-border/50 shadow-xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-200px)]">
          {children}
        </div>
      </main>
    </div>
  );
};
