
import React from 'react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-br from-[#F5F5F5] to-[#D1FAE5] py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#111827] mb-6 font-dm-sans">
          LinkedIn Content
          <span className="text-[#17B978]"> Generator</span>
        </h1>
        <p className="text-xl text-[#111827] mb-8 max-w-3xl mx-auto font-inter">
          Create engaging LinkedIn posts with AI-powered hooks, compelling content, and effective CTAs. 
          Transform your ideas into viral-worthy posts that drive engagement and build your professional brand.
        </p>
        <Button 
          onClick={scrollToGenerator}
          className="bg-[#17B978] hover:bg-[#129b65] text-white px-8 py-4 text-lg font-dm-sans"
        >
          Start Generating 🚀
        </Button>
      </div>
    </section>
  );
};
