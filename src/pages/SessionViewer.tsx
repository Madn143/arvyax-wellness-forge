
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, ExternalLink, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Session {
  id: string;
  title: string;
  status: 'draft' | 'published';
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  json_file_url?: string;
}

const SessionViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSession();
    }
  }, [id]);

  const loadSession = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading session:', error);
        toast({
          title: "Error",
          description: "Failed to load session",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      if (data) {
        setSession(data as Session);
      }
    } catch (error) {
      console.error('Session loading error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">
          Session Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The session you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="backdrop-blur-md bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">{session.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-base">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created {formatDate(session.created_at)}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Session ID: {session.id.slice(0, 8)}
                </span>
              </CardDescription>
            </div>
            <Badge 
              variant={session.status === 'published' ? 'default' : 'secondary'}
              className="text-sm"
            >
              {session.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {session.tags && session.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {session.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {session.json_file_url && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Session Data</h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  This session includes external data from:
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(session.json_file_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Session Data File
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Session Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(session.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{formatDate(session.updated_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={session.status === 'published' ? 'default' : 'secondary'}>
                  {session.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Session Type</p>
                <p className="text-sm">Wellness Session</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionViewer;
