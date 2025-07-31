
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
    setLoading(true);
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

    // Type cast the data to ensure status is properly typed
    const typedData = (data || []).map(session => ({
      ...session,
      status: session.status as 'draft' | 'published'
    }));

    setSessions(typedData);
    setLoading(false);
  };

  const fetchMySessions = async () => {
    setLoading(true);
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

    // Type cast the data to ensure status is properly typed
    const typedData = (data || []).map(session => ({
      ...session,
      status: session.status as 'draft' | 'published'
    }));

    setSessions(typedData);
    setLoading(false);
  };

  const deleteSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Session deleted successfully",
    });

    // Refresh sessions
    fetchMySessions();
  };

  const toggleSessionStatus = async (sessionId: string, newStatus: 'draft' | 'published') => {
    const { error } = await supabase
      .from('sessions')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'} session`,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: `Session ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
    });

    // Refresh sessions
    fetchMySessions();
  };
  return {
    sessions,
    loading,
    fetchPublicSessions,
    fetchMySessions,
    deleteSession,
    toggleSessionStatus,
  };
};
