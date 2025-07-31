import React, { useEffect } from 'react';
import { SessionCard } from '@/components/SessionCard';
import { useSessions } from '@/hooks/useSessions';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { sessions, loading, fetchPublicSessions } = useSessions();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicSessions();
  }, []);

  const handleEdit = (sessionId: string) => {
    navigate(`/editor/${sessionId}`);
  };

  const handleView = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  const stats = [
    {
      title: "Total Sessions",
      value: sessions.length,
      icon: Calendar,
      description: "Published wellness sessions"
    },
    {
      title: "Active Users",
      value: "1.2K+",
      icon: Users,
      description: "Community members"
    },
    {
      title: "Growth",
      value: "+12%",
      icon: TrendingUp,
      description: "This month"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-2">
              Discover wellness sessions shared by our community
            </p>
          </div>
          <Button onClick={() => navigate('/editor')}>
            <Plus className="h-4 w-4 mr-1" />
            Create Session
          </Button>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover wellness sessions shared by our community
            </p>
          </div>
          <Button onClick={() => navigate('/editor')}>
            <Plus className="h-4 w-4 mr-1" />
            Create Session
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="backdrop-blur-md bg-card/50 hover:bg-card/70 border-border/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Public Wellness Sessions</h2>
        <p className="text-muted-foreground mt-2">
          Explore sessions created by our wellness community
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
            <SessionCard 
              key={session.id} 
              session={session} 
              onEdit={handleEdit}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
