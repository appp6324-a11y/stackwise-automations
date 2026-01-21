import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';

const Index = () => {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <HeroSection />
      </main>
    </>
  );
};

export default Index;
