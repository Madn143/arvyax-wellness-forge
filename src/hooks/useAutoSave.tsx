
import { useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SessionData {
  title: string;
  tags: string[];
  json_file_url: string;
}

export const useAutoSave = (sessionId?: string) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  const saveDraft = useCallback(async (data: SessionData) => {
    const dataString = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (dataString === lastSavedRef.current) return;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        return;
      }

      if (sessionId) {
        // Update existing session
        const { error } = await supabase
          .from('sessions')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', sessionId);

        if (error) throw error;
      } else {
        // Create new session
        const { data: newSession, error } = await supabase
          .from('sessions')
          .insert({
            ...data,
            user_id: user.id,
            status: 'draft',
          })
          .select()
          .single();

        if (error) throw error;
        
        // Update the URL to include the new session ID
        window.history.replaceState(null, '', `/editor/${newSession.id}`);
      }

      lastSavedRef.current = dataString;
      
      // Show subtle save confirmation
      toast({
        title: "Draft saved",
        description: "Your changes have been automatically saved",
      });
    } catch (error) {
      console.error('Auto-save error:', error);
      toast({
        title: "Save failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  }, [sessionId]);

  const triggerAutoSave = useCallback((data: SessionData) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for 5 seconds
    timeoutRef.current = setTimeout(() => {
      saveDraft(data);
    }, 5000);
  }, [saveDraft]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { triggerAutoSave, saveDraft };
};
