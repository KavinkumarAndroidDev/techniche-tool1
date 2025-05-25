import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AdPlacementProps {
  position: 'top' | 'sidebar' | 'middle' | 'bottom';
  adSlot?: string; // Google AdSense ad slot ID
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ position }) => {
  const getAdSlot = () => {
    switch (position) {
      case 'top':
        return '9830748782';
      case 'sidebar':
        return '5316195804';
      case 'middle':
        return '4003114131';
      case 'bottom':
        return '3997560492';
      default:
        return '';
    }
  };

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
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`${position === 'top' || position === 'middle' || position === 'bottom' ? 'container mx-auto px-4 py-4' : ''}`}>
      <ins
        className={`adsbygoogle ${getAdDimensions()}`}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6442174528661612"
        data-ad-slot={getAdSlot()}
        data-ad-format={getAdFormat()}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: any;
  }
}
