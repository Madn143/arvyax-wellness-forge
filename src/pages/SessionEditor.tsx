
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Send, ArrowLeft } from 'lucide-react';
import { useAutoSave } from '@/hooks/useAutoSave';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SessionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  
  const { triggerAutoSave, saveDraft } = useAutoSave(id);

  // Load existing session if editing
  useEffect(() => {
    if (id) {
      loadSession();
    }
  }, [id]);

  const loadSession = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load session",
        variant: "destructive",
      });
      navigate('/my-sessions');
      return;
    }

    if (data) {
      setTitle(data.title);
      setTagsInput(data.tags?.join(', ') || '');
      setJsonFileUrl(data.json_file_url || '');
      setStatus(data.status);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (title.trim() || tagsInput.trim() || jsonFileUrl.trim()) {
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      triggerAutoSave({
        title: title.trim() || 'Untitled Session',
        tags,
        json_file_url: jsonFileUrl.trim(),
      });
    }
  }, [title, tagsInput, jsonFileUrl, triggerAutoSave]);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your session",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    await saveDraft({
      title: title.trim(),
      tags,
      json_file_url: jsonFileUrl.trim(),
    });
    
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    try {
      if (id) {
        // Update existing session
        const { error } = await supabase
          .from('sessions')
          .update({
            title: title.trim(),
            tags,
            json_file_url: jsonFileUrl.trim(),
            status: 'published',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new published session
        const { error } = await supabase
          .from('sessions')
          .insert({
            title: title.trim(),
            tags,
            json_file_url: jsonFileUrl.trim(),
            status: 'published',
          });

        if (error) throw error;
      }

      toast({
        title: "Published!",
        description: "Your wellness session has been published successfully",
      });

      navigate('/my-sessions');
    } catch (error) {
      console.error('Publish error:', error);
      toast({
        title: "Publish Failed",
        description: "Failed to publish session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/my-sessions')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {id ? 'Edit Session' : 'New Wellness Session'}
            </h1>
            {status && (
              <Badge variant={status === 'published' ? 'default' : 'secondary'} className="mt-1">
                {status}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
            <Save className="h-4 w-4 mr-1" />
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={loading}>
            <Send className="h-4 w-4 mr-1" />
            Publish
          </Button>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title (e.g., Morning Yoga Flow)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Enter tags separated by commas (e.g., yoga, meditation, relaxation)"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jsonUrl">Session Data URL</Label>
            <Input
              id="jsonUrl"
              value={jsonFileUrl}
              onChange={(e) => setJsonFileUrl(e.target.value)}
              placeholder="Enter URL to session data file (optional)"
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Link to your session data file (JSON, etc.)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
        💡 Your work is automatically saved as a draft every 5 seconds while you type.
      </div>
    </div>
  );
};

export default SessionEditor;
