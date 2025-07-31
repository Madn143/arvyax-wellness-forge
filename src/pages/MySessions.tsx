
import React, { useEffect } from 'react';
import { SessionCard } from '@/components/SessionCard';
import { useSessions } from '@/hooks/useSessions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const MySessions = () => {
  const { sessions, loading, fetchMySessions } = useSessions();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySessions();
  }, []);

  const handleEdit = (sessionId: string) => {
    navigate(`/editor/${sessionId}`);
  };

  const handleView = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  const draftSessions = sessions.filter(s => s.status === 'draft');
  const publishedSessions = sessions.filter(s => s.status === 'published');

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Sessions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Sessions</h1>
        <Button onClick={() => navigate('/editor')}>
          <Plus className="h-4 w-4 mr-1" />
          New Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No sessions yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first wellness session to get started
          </p>
          <Button onClick={() => navigate('/editor')}>
            <Plus className="h-4 w-4 mr-1" />
            Create Session
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {draftSessions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Drafts ({draftSessions.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftSessions.map((session) => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onEdit={handleEdit}
                    onView={handleView}
                  />
                ))}
              </div>
            </div>
          )}

          {publishedSessions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Published ({publishedSessions.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedSessions.map((session) => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onEdit={handleEdit}
                    onView={handleView}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MySessions;
