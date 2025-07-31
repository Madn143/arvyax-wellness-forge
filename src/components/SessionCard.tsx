
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, Eye, Tag } from 'lucide-react';

// Define the Session type locally since it's not exported from Supabase types
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

interface SessionCardProps {
  session: Session;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onEdit, onView }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-card/50 border-border/50 hover:border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
              {session.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Updated {formatDate(session.updated_at)}
            </CardDescription>
          </div>
          <Badge 
            variant={session.status === 'published' ? 'default' : 'secondary'}
            className="ml-2 capitalize backdrop-blur-sm"
          >
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Tag className="h-3 w-3 text-muted-foreground mt-1" />
            {session.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs backdrop-blur-sm bg-background/50">
                {tag}
              </Badge>
            ))}
            {session.tags.length > 3 && (
              <Badge variant="outline" className="text-xs backdrop-blur-sm bg-background/50">
                +{session.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(session.id)}
            className="flex-1 backdrop-blur-sm bg-background/50 hover:bg-accent/50 transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit(session.id)}
            className="flex-1 backdrop-blur-sm transition-all duration-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
