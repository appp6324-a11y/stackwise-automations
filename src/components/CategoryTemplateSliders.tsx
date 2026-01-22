import { useMemo, useState } from 'react';
import { useStack, Template } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Link } from 'react-router-dom';
import { ChevronRight, Briefcase, Users, Headphones, Settings, DollarSign, ShoppingCart, Home, Stethoscope, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TemplatePreviewModal } from './TemplatePreviewModal';

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
  template: Template;
  onClick: () => void;
}

function TemplateCardMini({ template, onClick }: TemplateCardMiniProps) {
  return (
    <div 
      className="glass-panel rounded-xl p-4 h-full hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
      onClick={onClick}
    >
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

// Mobile compact card for 4-tile grid
function TemplateCardCompact({ template, onClick }: TemplateCardMiniProps) {
  return (
    <div 
      className="glass-panel rounded-lg p-3 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <h4 className="font-semibold text-xs line-clamp-2 mb-1 group-hover:text-primary transition-colors">
        {template.name}
      </h4>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-primary">
          ${template.starting_price_usd}
        </span>
        <span className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
          {template.capability_layers[0]}
        </span>
      </div>
    </div>
  );
}

export function CategoryTemplateSliders() {
  const { templates } = useStack();
  const { t } = useLocale();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, number>>({});

  const INITIAL_MOBILE_COUNT = 4;
  const LOAD_MORE_COUNT = 4;

  const getVisibleCount = (category: string) => {
    return expandedCategories[category] || INITIAL_MOBILE_COUNT;
  };

  const handleLoadMore = (category: string, totalCount: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: Math.min((prev[category] || INITIAL_MOBILE_COUNT) + LOAD_MORE_COUNT, totalCount)
    }));
  };

  // Get featured templates (top rated / most used - using price as proxy for "premium")
  const featuredTemplates = useMemo(() => {
    return [...templates]
      .filter(t => t.slo_tier === 'Pro' || t.slo_tier === 'Enterprise' || t.agent_involvement === 'Required')
      .slice(0, 12);
  }, [templates]);

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

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  if (templatesByCategory.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 schematic-grid opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        {/* Featured Templates Section */}
        {featuredTemplates.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Featured Templates
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    Most popular automations
                  </span>
                </div>
              </div>
              <Link to="/marketplace">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Desktop: Carousel, Mobile: 4-tile grid */}
            <div className="hidden md:block">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {featuredTemplates.map((template) => (
                    <CarouselItem 
                      key={template.id} 
                      className="pl-4 basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <TemplateCardMini template={template} onClick={() => handleTemplateClick(template)} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 bg-background/80 backdrop-blur-sm" />
                <CarouselNext className="-right-4 bg-background/80 backdrop-blur-sm" />
              </Carousel>
            </div>

            {/* Mobile: 4-tile grid */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              {featuredTemplates.slice(0, 4).map((template) => (
                <TemplateCardCompact 
                  key={template.id} 
                  template={template} 
                  onClick={() => handleTemplateClick(template)} 
                />
              ))}
            </div>
          </div>
        )}

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

                {/* Desktop: Templates Carousel */}
                <div className="hidden md:block">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: false,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {categoryTemplates.slice(0, 10).map((template) => (
                        <CarouselItem 
                          key={template.id} 
                          className="pl-4 basis-1/3 lg:basis-1/4 xl:basis-1/5"
                        >
                          <TemplateCardMini template={template} onClick={() => handleTemplateClick(template)} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 bg-background/80 backdrop-blur-sm" />
                    <CarouselNext className="-right-4 bg-background/80 backdrop-blur-sm" />
                  </Carousel>
                </div>

                {/* Mobile: 4-tile grid per category with Load More */}
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-3">
                    {categoryTemplates.slice(0, getVisibleCount(category)).map((template) => (
                      <TemplateCardCompact 
                        key={template.id} 
                        template={template} 
                        onClick={() => handleTemplateClick(template)} 
                      />
                    ))}
                  </div>
                  {getVisibleCount(category) < categoryTemplates.length && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLoadMore(category, categoryTemplates.length)}
                      className="w-full mt-4 text-xs text-muted-foreground hover:text-primary"
                    >
                      Load More ({categoryTemplates.length - getVisibleCount(category)} remaining)
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal 
        template={selectedTemplate}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}