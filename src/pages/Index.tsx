
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { GeneratorForm } from '@/components/GeneratorForm';
import { OutputDisplay } from '@/components/OutputDisplay';
import { AboutSection } from '@/components/AboutSection';
import { AdPlacement } from '@/components/AdPlacement';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePostGenerated = (post: string) => {
    setGeneratedPost(post);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      
      {/* Top Ad Placement */}
      <AdPlacement position="top" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <GeneratorForm 
              onPostGenerated={handlePostGenerated}
              onLoadingChange={handleLoadingChange}
              isLoading={isLoading}
            />
          </div>
          <div>
            <OutputDisplay 
              generatedPost={generatedPost}
              isLoading={isLoading}
            />
            
            {/* Side Ad Placement */}
            <AdPlacement position="sidebar" />
          </div>
        </div>
      </div>
      
      {/* Middle Ad Placement */}
      <AdPlacement position="middle" />
      
      <AboutSection />
      
      {/* Bottom Ad Placement */}
      <AdPlacement position="bottom" />
      
      <Footer />
    </div>
  );
};

export default Index;
