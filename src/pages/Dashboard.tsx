
import React, { useEffect } from 'react';
import { SessionCard } from '@/components/SessionCard';
import { useSessions } from '@/hooks/useSessions';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { sessions, loading, fetchPublicSessions } = useSessions();

  useEffect(() => {
    fetchPublicSessions();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Public Wellness Sessions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Public Wellness Sessions</h1>
        <p className="text-muted-foreground mt-2">
          Discover wellness sessions shared by our community
        </p>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No sessions yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Be the first to publish a wellness session!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
