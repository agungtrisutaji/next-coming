import AnimatedBackground from '@/components/AnimatedBackground';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import VisionSection from '@/components/VisionSection';
import SubscribeSection from '@/components/SubscribeSection';
import Footer from '@/components/Footer';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import SectionIndicator from '@/components/SectionIndicator';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Scroll progress indicator */}
      <ScrollProgressBar />
      
      {/* Section navigation dots */}
      <SectionIndicator />

      {/* Content sections */}
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <VisionSection />
        <SubscribeSection />
        <Footer />
      </div>
    </main>
  );
}
