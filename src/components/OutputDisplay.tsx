
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutputDisplayProps {
  generatedPost: string;
  isLoading: boolean;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ generatedPost, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Post copied to clipboard successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const shareToWhatsApp = () => {
    const encodedText = encodeURIComponent(generatedPost);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <Card className="w-full sticky top-24">
      <CardHeader>
        <CardTitle className="text-2xl font-dm-sans text-[#111827]">
          Generated Post
        </CardTitle>
        <p className="text-[#6B7280] font-inter">
          Your AI-generated LinkedIn post will appear here
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#17B978]" />
              <p className="text-[#6B7280] font-inter">Generating your post...</p>
            </div>
          </div>
        ) : generatedPost ? (
          <div className="space-y-4">
            <div className="bg-[#F5F5F5] p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap font-inter text-[#111827] leading-relaxed">
                {generatedPost}
              </pre>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Post
                  </>
                )}
              </Button>
              
              <Button
                onClick={shareToWhatsApp}
                variant="outline"
                className="flex-1"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="text-sm text-[#6B7280] text-center font-inter">
              Characters: {generatedPost.length}/2700
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-[#6B7280] font-inter">
              Fill out the form and click "Generate Post" to create your LinkedIn content
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
