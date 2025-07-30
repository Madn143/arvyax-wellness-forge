
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Share, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '@/hooks/useSessions';
import { Session } from '@/integrations/supabase/types';

interface SessionCardProps {
  session: Session;
  isOwner?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, isOwner = false }) => {
  const navigate = useNavigate();
  const { deleteSession, toggleSessionStatus } = useSessions();

  const handleEdit = () => {
    navigate(`/editor/${session.id}`);
  };

  const handleView = () => {
    // Navigate to session view page (to be implemented)
    console.log('View session:', session.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      await deleteSession(session.id);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = session.status === 'draft' ? 'published' : 'draft';
    await toggleSessionStatus(session.id, newStatus);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="group relative overflow-hidden backdrop-blur-md bg-card/50 hover:bg-card/70 border-border/50 hover:border-border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {session.title}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Badge
              variant={session.status === 'published' ? 'default' : 'secondary'}
              className="text-xs backdrop-blur-sm bg-background/80"
            >
              {session.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Updated {formatDate(session.updated_at)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pb-4">
        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <Tag className="h-3 w-3 text-muted-foreground mr-1" />
            {session.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0 backdrop-blur-sm bg-background/50 border-border/50"
              >
                {tag}
              </Badge>
            ))}
            {session.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0 backdrop-blur-sm bg-background/50 border-border/50"
              >
                +{session.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="relative z-10 pt-0 flex flex-wrap gap-2">
        <Button
          onClick={handleView}
          size="sm"
          variant="outline"
          className="flex-1 min-w-0 backdrop-blur-sm bg-background/50 hover:bg-accent/50 border-border/50 transition-all duration-200"
        >
          <Eye className="h-3 w-3 mr-1" />
          <span className="truncate">View</span>
        </Button>
        
        {isOwner && (
          <>
            <Button
              onClick={handleEdit}
              size="sm"
              variant="outline"
              className="flex-1 min-w-0 backdrop-blur-sm bg-background/50 hover:bg-primary/10 hover:text-primary border-border/50 transition-all duration-200"
            >
              <Edit className="h-3 w-3 mr-1" />
              <span className="truncate">Edit</span>
            </Button>
            
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button
                onClick={handleToggleStatus}
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none backdrop-blur-sm bg-background/50 hover:bg-accent/50 border-border/50 transition-all duration-200"
              >
                <Share className="h-3 w-3 mr-1" />
                {session.status === 'draft' ? 'Publish' : 'Unpublish'}
              </Button>
              
              <Button
                onClick={handleDelete}
                size="sm"
                variant="outline"
                className="backdrop-blur-sm bg-background/50 hover:bg-destructive/10 hover:text-destructive border-border/50 transition-all duration-200"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
