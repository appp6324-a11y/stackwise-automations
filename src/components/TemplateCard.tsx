import { Template, useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Check, Bot, Clock } from 'lucide-react';
import { getCategoryImage, aiAgentImage } from '@/lib/images';

interface TemplateCardProps {
  template: Template;
  onViewDetails?: () => void;
}

export function TemplateCard({ template, onViewDetails }: TemplateCardProps) {
  const { addTemplate, removeTemplate, isTemplateInStack } = useStack();
  const { t, formatPrice } = useLocale();

  const isInStack = isTemplateInStack(template.id);

  const tierVariant = {
    Standard: 'standard',
    Pro: 'pro',
    Enterprise: 'enterprise',
  } as const;

  const agentLabel = {
    Required: t.template.agentRequired,
    Optional: t.template.agentOptional,
    None: t.template.noAgent,
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInStack) {
      removeTemplate(template.id);
    } else {
      addTemplate(template);
    }
  };

  const categoryImage = getCategoryImage(template.category);
  const showAgentImage = template.agent_involvement === 'Required';

  return (
    <Card 
      variant="template" 
      className={`group overflow-hidden ${isInStack ? 'border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.15)]' : ''}`}
      onClick={onViewDetails}
    >
      {/* Image Header */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={showAgentImage ? aiAgentImage : categoryImage}
          alt={template.category}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        
        {/* Tier Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={tierVariant[template.slo_tier]}>
            {template.slo_tier}
          </Badge>
        </div>

        {/* Agent Indicator */}
        {template.agent_involvement === 'Required' && (
          <div className="absolute top-3 left-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent" />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {template.category}
          </p>
        </div>

        {/* What it automates */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.what_it_automates}
        </p>

        {/* Layers */}
        <div className="flex flex-wrap gap-1">
          {template.capability_layers.slice(0, 4).map((layer) => (
            <Badge key={layer} variant="layer" className="text-[9px]">
              {layer}
            </Badge>
          ))}
        </div>

        {/* Agent & Deployment */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            {template.agent_involvement === 'Required' && (
              <Bot className="w-3 h-3 text-accent" />
            )}
            <span>{agentLabel[template.agent_involvement]}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{template.deployment_eta_hours[0]}-{template.deployment_eta_hours[1]}h</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <span className="text-[10px] text-muted-foreground block">
              {t.template.startingFrom}
            </span>
            <span className="font-mono text-sm font-semibold text-primary">
              {formatPrice(template.starting_price_usd)}
            </span>
          </div>
          <Button
            variant={isInStack ? 'default' : 'control'}
            size="sm"
            onClick={handleToggle}
            className="gap-1"
          >
            {isInStack ? (
              <>
                <Check className="w-3 h-3" />
                {t.common.selected}
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                {t.cta.addToStack}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
