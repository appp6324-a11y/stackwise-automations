import { Template, useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Check, Bot, Clock, Zap, ArrowRight } from 'lucide-react';
import { getCategoryImage, aiAgentImage } from '@/lib/images';
import { Link } from 'react-router-dom';

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewModal({ template, open, onOpenChange }: TemplatePreviewModalProps) {
  const { addTemplate, removeTemplate, isTemplateInStack } = useStack();
  const { t, formatPrice } = useLocale();

  if (!template) return null;

  const isInStack = isTemplateInStack(template.id);
  const categoryImage = getCategoryImage(template.category);
  const showAgentImage = template.agent_involvement === 'Required';

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

  const handleToggle = () => {
    if (isInStack) {
      removeTemplate(template.id);
    } else {
      addTemplate(template);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-panel border-primary/20 p-0 overflow-hidden">
        {/* Image Header */}
        <div className="relative h-40 overflow-hidden">
          <img 
            src={showAgentImage ? aiAgentImage : categoryImage}
            alt={template.category}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          {/* Tier Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant={tierVariant[template.slo_tier]} className="text-xs">
              {template.slo_tier}
            </Badge>
          </div>

          {/* Agent Indicator */}
          {template.agent_involvement === 'Required' && (
            <div className="absolute top-4 left-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5 text-accent" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">{template.name}</DialogTitle>
            <p className="text-sm text-muted-foreground">{template.category}</p>
          </DialogHeader>

          {/* What it automates */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-primary flex items-center gap-1">
              <Zap className="w-3 h-3" /> What it automates
            </h4>
            <p className="text-sm text-muted-foreground">
              {template.what_it_automates}
            </p>
          </div>

          {/* Capability Layers */}
          <div className="flex flex-wrap gap-1.5">
            {template.capability_layers.map((layer) => (
              <Badge key={layer} variant="layer" className="text-[10px]">
                {layer}
              </Badge>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between py-3 border-y border-border/50">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {template.agent_involvement === 'Required' && (
                <Bot className="w-4 h-4 text-accent" />
              )}
              <span>{agentLabel[template.agent_involvement]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{template.deployment_eta_hours[0]}-{template.deployment_eta_hours[1]}h deployment</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">
                {t.template.startingFrom}
              </span>
              <span className="font-mono text-2xl font-bold text-primary">
                {formatPrice(template.starting_price_usd)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isInStack ? 'default' : 'control'}
                size="sm"
                onClick={handleToggle}
                className="gap-1"
              >
                {isInStack ? (
                  <>
                    <Check className="w-4 h-4" />
                    {t.common.selected}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {t.cta.addToStack}
                  </>
                )}
              </Button>
              <Link to={`/marketplace?template=${template.id}`} onClick={() => onOpenChange(false)}>
                <Button variant="ghost" size="sm" className="gap-1">
                  Details <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}