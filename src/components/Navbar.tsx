
import React from 'react';

export const Navbar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/5960232f-73d4-438a-a96d-31b26aea576d.png" 
              alt="Techniche Logo" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold font-dm-sans text-[#111827]">
              Techniche
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('generator')}
              className="text-[#111827] hover:text-[#17B978] font-inter transition-colors"
            >
              Generator
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#111827] hover:text-[#17B978] font-inter transition-colors"
            >
              About
            </button>
            <a
              href="https://techniche.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#17B978] hover:bg-[#129b65] text-white px-4 py-2 rounded-lg font-dm-sans transition-colors"
            >
              Visit Website
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-[#111827] hover:text-[#17B978]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
