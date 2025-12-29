import { Navigation } from '@/components/Navigation';
import { CapabilityLattice } from '@/components/CapabilityLattice';
import { useLocale } from '@/contexts/LocaleContext';

const Builder = () => {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <CapabilityLattice />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t.footer.poweredBy}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Builder;
