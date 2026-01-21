import { Navigation } from '@/components/Navigation';
import { MarketplaceGrid } from '@/components/MarketplaceGrid';

const Marketplace = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <MarketplaceGrid />
        </div>
      </main>
    </>
  );
};

export default Marketplace;
