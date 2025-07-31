
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { User, Moon, Sun, Monitor, LogOut, Shield, Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and application settings
        </p>
      </div>

      {/* Account Information */}
      <Card className="backdrop-blur-md bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your personal account details and authentication information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                {user?.email || 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                {user?.id?.slice(0, 8)}...
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Created</p>
              <p className="text-sm">
                {user?.created_at ? formatDate(user.created_at) : 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
              <p className="text-sm">
                {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Not available'}
              </p>
            </div>
          </div>
          
          {user?.user_metadata?.full_name && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p className="text-sm">{user.user_metadata.full_name}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">Authentication Provider</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {user?.app_metadata?.provider || 'Email'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="backdrop-blur-md bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Theme Preferences
          </CardTitle>
          <CardDescription>
            Choose your preferred color theme for the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                variant={theme === option.value ? 'default' : 'outline'}
                className="flex items-center gap-2 h-12"
                onClick={() => setTheme(option.value as any)}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Info */}
      <Card className="backdrop-blur-md bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Application Information
          </CardTitle>
          <CardDescription>
            Information about this Arvyax Wellness Sessions application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Application</p>
              <p className="text-sm">Arvyax Wellness Sessions</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="text-sm">1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Built with</p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="outline" className="text-xs">React</Badge>
                <Badge variant="outline" className="text-xs">TypeScript</Badge>
                <Badge variant="outline" className="text-xs">Supabase</Badge>
                <Badge variant="outline" className="text-xs">Tailwind CSS</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="backdrop-blur-md bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Actions
          </CardTitle>
          <CardDescription>
            Manage your account and session preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium">Sign Out</h3>
              <p className="text-sm text-muted-foreground">
                Sign out from your current session
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
