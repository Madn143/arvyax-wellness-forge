
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
</ov-write>

<lov-write file_path="src/components/SessionCard.tsx">
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Session {
  id: string;
  title: string;
  tags: string[];
  json_file_url?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

interface SessionCardProps {
  session: Session;
  isOwner?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, isOwner = false }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{session.title}</CardTitle>
            <CardDescription>
              {session.status === 'draft' ? 'Updated' : 'Published'} on {formatDate(session.updated_at)}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={session.status === 'published' ? 'default' : 'secondary'}>
              {session.status}
            </Badge>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/editor/${session.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {session.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {session.json_file_url && (
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => window.open(session.json_file_url, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Session Data
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
