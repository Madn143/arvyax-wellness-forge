
import React, { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
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
