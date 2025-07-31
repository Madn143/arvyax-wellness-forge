import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth redirect on mount
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('OAuth redirect error:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
      
      if (data.session) {
        setUser(data.session.user);
        // Clean up URL parameters after successful OAuth
        const url = new URL(window.location.href);
        if (url.searchParams.has('access_token') || url.searchParams.has('refresh_token')) {
          window.history.replaceState({}, document.title, url.pathname);
          navigate('/', { replace: true });
        }
      }
      
      setLoading(false);
    };

    // Check if this is an OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('access_token') || urlParams.has('refresh_token')) {
      handleOAuthRedirect();
    } else {
      // Normal session check
      const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      };
      getSession();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "Successfully signed in to Arvyax Wellness Sessions",
          });
          // Redirect to dashboard after successful sign in
          navigate('/', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Goodbye!",
            description: "Successfully signed out",
          });
          navigate('/auth', { replace: true });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password Reset",
            description: "Check your email for password reset instructions",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, rememberMe: boolean = false) => {
    setSessionLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          remember_me: rememberMe
        }
      }
    });

    if (error) {
      setSessionLoading(false);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Registration Successful",
      description: "Welcome to Arvyax Wellness Sessions!",
    });

    setSessionLoading(false);
    return { data };
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    setSessionLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setSessionLoading(false);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem('arvyax_remember_me', 'true');
    } else {
      localStorage.removeItem('arvyax_remember_me');
    }

    setSessionLoading(false);
    return { data };
  };

  const signOut = async () => {
    setSessionLoading(true);
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    
    // Clear remember me preference
    localStorage.removeItem('arvyax_remember_me');
    setSessionLoading(false);
  };

  const signInWithGoogle = async () => {
    setSessionLoading(true);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });

    if (error) {
      setSessionLoading(false);
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    setSessionLoading(false);
    return { data };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Reset Email Sent",
      description: "Check your email for password reset instructions",
    });
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated",
    });
  };

  return {
    user,
    loading,
    sessionLoading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
  };
};
