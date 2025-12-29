import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { useLocale } from '@/contexts/LocaleContext';

const Index = () => {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        
        {/* Footer */}
        <footer className="border-t border-border/50 py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t.footer.poweredBy}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
