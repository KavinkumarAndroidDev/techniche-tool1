
import React from 'react';
import { Linkedin, Globe, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/5960232f-73d4-438a-a96d-31b26aea576d.png" 
                alt="Techniche Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold font-dm-sans">Techniche</span>
            </div>
            <p className="text-[#9CA3AF] font-inter text-sm">
              Empowering careers through AI-powered tools and innovative technology solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-dm-sans font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#generator" className="block text-[#9CA3AF] hover:text-[#17B978] transition-colors">
                LinkedIn Generator
              </a>
              <a href="#about" className="block text-[#9CA3AF] hover:text-[#17B978] transition-colors">
                About Us
              </a>
              <a 
                href="https://techniche.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-[#9CA3AF] hover:text-[#17B978] transition-colors"
              >
                Main Website
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-dm-sans font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/technicheofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#17B978] hover:bg-[#129b65] p-2 rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://techniche.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#17B978] hover:bg-[#129b65] p-2 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb5lgT9JuyAKN6ZIYH2w"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#17B978] hover:bg-[#129b65] p-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#374151] mt-8 pt-8 text-center">
          <p className="text-[#9CA3AF] text-sm font-inter">
            © 2024 Techniche. All rights reserved. | Built with ❤️ for the tech community
          </p>
        </div>
      </div>
    </footer>
  );
};
