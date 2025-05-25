
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Users, Rocket, Target } from 'lucide-react';

export const AboutSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-[#17B978]" />,
      title: "AI-Powered Content",
      description: "Generate high-performing LinkedIn posts using advanced AI technology and proven psychological triggers."
    },
    {
      icon: <Target className="w-8 h-8 text-[#17B978]" />,
      title: "Strategic Frameworks",
      description: "Built on 12 proven hook templates that drive engagement and maximize your professional reach."
    },
    {
      icon: <Users className="w-8 h-8 text-[#17B978]" />,
      title: "Career Growth",
      description: "Designed to help professionals, students, and job seekers build their personal brand on LinkedIn."
    },
    {
      icon: <Rocket className="w-8 h-8 text-[#17B978]" />,
      title: "Free Tool",
      description: "Part of Techniche's mission to make career-building tools accessible to everyone in the tech community."
    }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#111827] mb-4 font-dm-sans">
            About This <span className="text-[#17B978]">Tool</span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto font-inter">
            Our LinkedIn Content Generator is designed to help professionals create engaging, 
            high-performing posts that drive meaningful connections and career opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-dm-sans font-semibold text-[#111827] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] text-sm font-inter">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-[#F5F5F5] rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-[#111827] mb-4 font-dm-sans">
            About Techniche
          </h3>
          <p className="text-[#6B7280] font-inter mb-6 max-w-4xl mx-auto">
            We're a tech-driven startup focused on building innovative AI/ML, Data Science, 
            and Cloud-based solutions while empowering students and job seekers with career-oriented 
            mentorship, hands-on projects, and real-world exposure. Our mission is to bridge the gap 
            between education and employment through accessible, value-first products.
          </p>
          <a
            href="https://techniche.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#17B978] hover:bg-[#129b65] text-white px-6 py-3 rounded-lg font-dm-sans transition-colors inline-block"
          >
            Learn More About Techniche
          </a>
        </div>
      </div>
    </section>
  );
};
