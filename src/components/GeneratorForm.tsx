import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLinkedInPost, testGeminiConnection } from '@/services/gemini';

interface GeneratorFormProps {
  onPostGenerated: (post: string) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onPostGenerated,
  onLoadingChange,
  isLoading
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    topic: '',
    postGoal: '',
    targetAudience: [] as string[],
    tone: 'professional',
    format: 'Hook + Body + CTA',
    includeEmojis: true,
    includeHashtags: true,
    content: '',
    length: 'medium',
    cta: '',
    avoid: '',
    references: ''
  });

  const [audienceInput, setAudienceInput] = useState('');
  const [charCount, setCharCount] = useState(0);

  const postGoalOptions = [
    'Build Brand',
    'Inspire',
    'Get Engagement',
    'Share Knowledge',
    'Network',
    'Promote Product',
    'Share Experience',
    'Start Discussion',
    'Showcase Expertise',
    'Drive Traffic'
  ];

  const targetAudienceOptions = [
    'Common',
    'Developers',
    'Designers',
    'Managers',
    'Entrepreneurs',
    'Students',
    'Professionals',
    'HR',
    'Marketing',
    'Sales',
    'Startups',
    'Enterprise'
  ];

  const toneOptions = [
    'Professional',
    'Casual',
    'Enthusiastic',
    'Informative',
    'Witty',
    'Inspirational',
    'Educational',
    'Conversational',
    'Authoritative',
    'Friendly',
    'Infotainment'
  ];

  const formatOptions = [
    'Hook + Body + CTA',
    'Story + Lesson',
    'Problem + Solution',
    'Question + Answer',
    'List + Summary'
  ];

  const handleAudienceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && audienceInput.trim()) {
      e.preventDefault();
      if (!formData.targetAudience.includes(audienceInput.trim())) {
        setFormData(prev => ({
          ...prev,
          targetAudience: [...prev.targetAudience, audienceInput.trim()]
        }));
      }
      setAudienceInput('');
    }
  };

  const removeAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter(a => a !== audience)
    }));
  };

  const updateCharCount = () => {
    const estimate = 
      formData.topic.length + 
      formData.content.length + 
      formData.cta.length + 
      200; // Base hook + body estimate
    setCharCount(estimate);
  };

  React.useEffect(() => {
    updateCharCount();
  }, [formData.topic, formData.content, formData.cta]);

  const handleGenerate = async () => {
    if (!formData.topic || !formData.postGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the topic and post goal.",
        variant: "destructive"
      });
      return;
    }

    onLoadingChange(true);
    
    try {
      const post = await generateLinkedInPost(
        formData.topic,
        formData.postGoal,
        formData.targetAudience,
        formData.tone,
        formData.format,
        formData.includeEmojis,
        formData.includeHashtags,
        formData.content,
        formData.length,
        formData.cta,
        formData.avoid,
        formData.references
      );
      onPostGenerated(post);
      toast({
        title: "Post Generated",
        description: "Your LinkedIn post has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating post:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate post. Please try again.",
        variant: "destructive",
      });
    } finally {
      onLoadingChange(false);
    }
  };

  const handleTestAPI = async () => {
    onLoadingChange(true);
    try {
      const result = await testGeminiConnection();
      if (result.success) {
        toast({
          title: "API Connection Test Successful",
          description: `Model: ${result.details.model}\nResponse: ${result.details.response}`,
          duration: 5000,
        });
      } else {
        // Handle rate limit error
        if (result.details?.isRateLimit) {
          toast({
            title: "Rate Limit Exceeded",
            description: "You've hit the rate limit. Please wait a few minutes before trying again.",
            variant: "destructive",
            duration: 5000,
          });
          return;
        }

        // Handle other errors
        toast({
          title: "API Connection Test Failed",
          description: result.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "API Test Error",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>LinkedIn Post Generator</CardTitle>
        <CardDescription>
          Generate professional LinkedIn posts with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="postGoal">Post Goal *</Label>
          <Select value={formData.postGoal} onValueChange={(value) => setFormData(prev => ({ ...prev, postGoal: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select post goal" />
            </SelectTrigger>
            <SelectContent>
              {postGoalOptions.map((goal) => (
                <SelectItem key={goal} value={goal}>{goal}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic *</Label>
          <Input
            id="topic"
            placeholder="e.g., AI in Business, Career Growth"
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Target Audience</Label>
          <Select 
            value={audienceInput} 
            onValueChange={(value) => {
              if (value === 'Common') {
                setFormData(prev => ({ ...prev, targetAudience: ['Common'] }));
              } else if (!formData.targetAudience.includes(value)) {
                setFormData(prev => ({
                  ...prev,
                  targetAudience: [...prev.targetAudience.filter(a => a !== 'Common'), value]
                }));
              }
              setAudienceInput('');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent>
              {targetAudienceOptions.map((audience) => (
                <SelectItem key={audience} value={audience}>{audience}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.targetAudience.map((audience) => (
              <div key={audience} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                <span>{audience}</span>
                <button
                  onClick={() => removeAudience(audience)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((tone) => (
                  <SelectItem key={tone} value={tone.toLowerCase()}>{tone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((format) => (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emojis"
                  checked={formData.includeEmojis}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeEmojis: checked }))}
                />
                <Label htmlFor="emojis">Emojis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="hashtags"
                  checked={formData.includeHashtags}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeHashtags: checked }))}
                />
                <Label htmlFor="hashtags">Hashtags</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Post Content / Details</Label>
          <Textarea
            id="content"
            placeholder="Share your post details, rough content, or key points you want to include. This helps in generating a more personalized and relevant post."
            value={formData.content}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, content: e.target.value }));
              setCharCount(e.target.value.length);
            }}
            className="min-h-[100px]"
          />
          <div className="text-sm text-muted-foreground">
            {charCount} characters
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta">Call to Action (Optional)</Label>
          <Input
            id="cta"
            placeholder="What action do you want readers to take?"
            value={formData.cta}
            onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avoid">What to Avoid (Optional)</Label>
          <Input
            id="avoid"
            placeholder="What topics or elements should be avoided?"
            value={formData.avoid}
            onChange={(e) => setFormData(prev => ({ ...prev, avoid: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="references">Reference Links (Optional)</Label>
          <Input
            id="references"
            placeholder="Add any reference links or sources"
            value={formData.references}
            onChange={(e) => setFormData(prev => ({ ...prev, references: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-[#6B7280] font-inter">
            Estimated characters: <span className={charCount > 2700 ? 'text-red-500' : 'text-[#17B978]'}>{charCount}</span>/2700
          </div>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${charCount < 900 ? 'bg-[#22C55E]' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${charCount >= 900 && charCount < 1800 ? 'bg-[#F59E0B]' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${charCount >= 1800 ? 'bg-[#EF4444]' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTestAPI}>
          Test API Connection
        </Button>
        <Button onClick={handleGenerate}>Generate Post</Button>
      </CardFooter>
    </Card>
  );
};
