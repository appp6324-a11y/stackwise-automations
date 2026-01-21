import { Navigation } from '@/components/Navigation';
import { CapabilityLattice } from '@/components/CapabilityLattice';

const Builder = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <CapabilityLattice />
        </div>
      </main>
    </>
  );
};

export default Builder;
