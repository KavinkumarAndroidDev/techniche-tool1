import React, { useEffect, useState } from 'react';

interface AdComponentProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  style?: React.CSSProperties;
}

export const AdComponent: React.FC<AdComponentProps> = ({ slot, format = 'auto', style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setIsLoaded(true);
    } catch (err) {
      console.error('AdSense error:', err);
      setError('Failed to load advertisement');
    }
  }, []);

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className="ad-container" style={{ minHeight: isLoaded ? 'auto' : '100px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-6442174528661612"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Pre-configured ad components for specific positions
export const TopAd = () => (
  <AdComponent 
    slot="9830748782"
    style={{ marginBottom: '20px' }}
  />
);

export const BottomAd = () => (
  <AdComponent 
    slot="3997560492"
    style={{ marginTop: '20px' }}
  />
);

export const ThirdAd = () => (
  <AdComponent 
    slot="5316195804"
    style={{ margin: '20px 0' }}
  />
);

export const FourthAd = () => (
  <AdComponent 
    slot="4003114131"
    style={{ margin: '20px 0' }}
  />
); 