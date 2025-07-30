
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Session {
  id: string;
  title: string;
  tags: string[];
  json_file_url?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicSessions = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive",
      });
      return;
    }

    setSessions(data || []);
    setLoading(false);
  };

  const fetchMySessions = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching my sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your sessions",
        variant: "destructive",
      });
      return;
    }

    setSessions(data || []);
    setLoading(false);
  };

  return {
    sessions,
    loading,
    fetchPublicSessions,
    fetchMySessions,
  };
};
