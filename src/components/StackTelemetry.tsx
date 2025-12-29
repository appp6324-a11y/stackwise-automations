import { useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Layers, 
  Cpu, 
  Bot, 
  Gauge, 
  DollarSign,
  FileJson,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StackTelemetry() {
  const { stack, getTotalPrice, clearStack } = useStack();
  const { t, formatPrice } = useLocale();

  const tierVariant = {
    Basic: 'standard',
    Standard: 'standard',
    Pro: 'pro',
    Enterprise: 'enterprise',
  } as const;

  return (
    <Card variant="telemetry" className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary" />
          {t.telemetry.title}
        </h3>
        {stack.templates.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearStack}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {/* Templates */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <Layers className="w-3 h-3" />
            {t.telemetry.templates}
          </span>
          <span className="font-mono text-sm text-foreground">
            {stack.templates.length}
          </span>
        </div>

        {/* Integrations */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            {t.telemetry.integrations}
          </span>
          <span className="font-mono text-sm text-foreground">
            {stack.selectedApps.length}
          </span>
        </div>

        {/* Agents */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <Bot className="w-3 h-3" />
            {t.telemetry.agents}
          </span>
          <span className="font-mono text-sm text-foreground">
            {stack.agentsEnabled}
          </span>
        </div>

        {/* Complexity */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t.telemetry.complexity}
          </span>
          <Badge variant={tierVariant[stack.complexityTier]}>
            {stack.complexityTier}
          </Badge>
        </div>

        {/* Price Floor */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-3 h-3" />
            {t.telemetry.priceFloor}
          </span>
          <span className="font-mono text-sm text-primary font-semibold">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
      </div>

      {/* Export Button */}
      {stack.templates.length > 0 && (
        <Link to="/manifest" className="block mt-4">
          <Button variant="glass" size="sm" className="w-full gap-2">
            <FileJson className="w-4 h-4" />
            {t.cta.exportManifest}
          </Button>
        </Link>
      )}
    </Card>
  );
}
