import { useMemo } from 'react';
import { useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Link } from 'react-router-dom';
import { ChevronRight, Briefcase, Users, Headphones, Settings, DollarSign, ShoppingCart, Home, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Category icons mapping
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Recruitment': Users,
  'Sales': Briefcase,
  'Support': Headphones,
  'Operations': Settings,
  'Finance': DollarSign,
  'E-commerce': ShoppingCart,
  'Real Estate': Home,
  'Healthcare': Stethoscope,
};

// Category colors for visual distinction
const categoryColors: Record<string, string> = {
  'Recruitment': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'Sales': 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
  'Support': 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  'Operations': 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  'Finance': 'from-yellow-500/20 to-lime-500/20 border-yellow-500/30',
  'E-commerce': 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  'Real Estate': 'from-teal-500/20 to-emerald-500/20 border-teal-500/30',
  'Healthcare': 'from-red-500/20 to-pink-500/20 border-red-500/30',
};

interface TemplateCardMiniProps {
  template: {
    id: string;
    name: string;
    what_it_automates: string;
    starting_price_usd: number;
    capability_layers: string[];
  };
}

function TemplateCardMini({ template }: TemplateCardMiniProps) {
  return (
    <div className="glass-panel rounded-xl p-4 h-full hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
      <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {template.name}
      </h4>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {template.what_it_automates}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-primary">
          ${template.starting_price_usd}
        </span>
        <div className="flex gap-1">
          {template.capability_layers.slice(0, 2).map((layer) => (
            <span
              key={layer}
              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {layer}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryTemplateSliders() {
  const { templates } = useStack();
  const { t } = useLocale();

  // Group templates by category
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, typeof templates> = {};
    
    templates.forEach((template) => {
      const category = template.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(template);
    });

    // Only return categories with templates
    return Object.entries(grouped).filter(([_, items]) => items.length > 0);
  }, [templates]);

  if (templatesByCategory.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 schematic-grid opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Explore by Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our automation templates organized by industry and use case
          </p>
        </div>

        <div className="space-y-12">
          {templatesByCategory.map(([category, categoryTemplates]) => {
            const Icon = categoryIcons[category] || Settings;
            const colorClass = categoryColors[category] || 'from-primary/20 to-accent/20 border-primary/30';
            
            return (
              <div key={category} className="fade-in">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold">{category}</h3>
                      <span className="text-xs text-muted-foreground font-mono">
                        {categoryTemplates.length} templates
                      </span>
                    </div>
                  </div>
                  <Link to={`/marketplace?category=${encodeURIComponent(category)}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Templates Carousel */}
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {categoryTemplates.slice(0, 10).map((template) => (
                      <CarouselItem 
                        key={template.id} 
                        className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                      >
                        <Link to={`/marketplace?template=${template.id}`}>
                          <TemplateCardMini template={template} />
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex -left-4 bg-background/80 backdrop-blur-sm" />
                  <CarouselNext className="hidden md:flex -right-4 bg-background/80 backdrop-blur-sm" />
                </Carousel>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
