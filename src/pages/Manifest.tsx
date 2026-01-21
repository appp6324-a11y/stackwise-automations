import { Navigation } from '@/components/Navigation';
import { ManifestView } from '@/components/ManifestView';

const Manifest = () => {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ManifestView />
        </div>
      </main>
    </>
  );
};

export default Manifest;
