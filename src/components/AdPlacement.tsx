
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AdPlacementProps {
  position: 'top' | 'sidebar' | 'middle' | 'bottom';
  adSlot?: string; // Google AdSense ad slot ID
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ position, adSlot }) => {
  const getAdDimensions = () => {
    switch (position) {
      case 'top':
        return 'h-24 w-full max-w-4xl mx-auto';
      case 'sidebar':
        return 'h-64 w-full mt-6';
      case 'middle':
        return 'h-32 w-full max-w-4xl mx-auto';
      case 'bottom':
        return 'h-24 w-full max-w-4xl mx-auto';
      default:
        return 'h-24 w-full';
    }
  };

  const getAdFormat = () => {
    switch (position) {
      case 'top':
      case 'middle':
      case 'bottom':
        return 'auto'; // Responsive banner
      case 'sidebar':
        return 'rectangle'; // 300x250
      default:
        return 'auto';
    }
  };

  useEffect(() => {
    // Initialize Google AdSense when component mounts
    if (adSlot && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adSlot]);

  // If adSlot is provided, render actual Google AdSense ad
  if (adSlot) {
    return (
      <div className={`${position === 'top' || position === 'middle' || position === 'bottom' ? 'container mx-auto px-4 py-4' : ''}`}>
        <ins
          className={`adsbygoogle ${getAdDimensions()}`}
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXX" // Replace with your AdSense publisher ID
          data-ad-slot={adSlot}
          data-ad-format={getAdFormat()}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback: Show placeholder for development
  return (
    <div className={`${position === 'top' || position === 'middle' || position === 'bottom' ? 'container mx-auto px-4 py-4' : ''}`}>
      <Card className={`${getAdDimensions()} border-dashed border-2 border-[#E5E7EB]`}>
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-[#9CA3AF]">
            <p className="font-inter text-sm">Advertisement Space</p>
            <p className="font-inter text-xs mt-1">
              {position === 'top' && 'Banner Ad (728x90)'}
              {position === 'sidebar' && 'Rectangle Ad (300x250)'}
              {position === 'middle' && 'Leaderboard Ad (728x90)'}
              {position === 'bottom' && 'Footer Ad (728x90)'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: any;
  }
}
