
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
