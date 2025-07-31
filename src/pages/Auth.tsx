
import React, { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { sessionLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {sessionLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Authenticating...</span>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Arvyax Wellness</h1>
          <p className="text-muted-foreground">Your wellness journey starts here</p>
        </div>
        
        <AuthForm mode={mode} />
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            disabled={sessionLoading}
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
