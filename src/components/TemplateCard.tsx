import { Template, useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Check, Bot, Clock, ArrowRight } from 'lucide-react';

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

  return (
    <Card 
      variant="template" 
      className={`group ${isInStack ? 'border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.15)]' : ''}`}
      onClick={onViewDetails}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {template.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {template.category}
            </p>
          </div>
          <Badge variant={tierVariant[template.slo_tier]}>
            {template.slo_tier}
          </Badge>
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
