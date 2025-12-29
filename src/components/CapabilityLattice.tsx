import { useState } from 'react';
import { useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { StackTelemetry } from '@/components/StackTelemetry';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import builderBackground from '@/assets/builder-background.jpg';
import { 
  Mail, 
  MessageCircle, 
  Smartphone, 
  Hash,
  Users,
  Send,
  MessageSquare,
  Headphones,
  Cloud,
  Target,
  GitBranch,
  Database,
  LayoutGrid,
  Table,
  FileText,
  BarChart,
  Snowflake,
  Zap,
  CreditCard,
  DollarSign,
  Calculator,
  TrendingUp,
  Square,
  Brain,
  Cpu,
  Sparkles,
  Smile,
  Workflow,
  Layers,
  CheckSquare,
  Clipboard,
  Calendar,
  Bell
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'mail': Mail,
  'message-circle': MessageCircle,
  'smartphone': Smartphone,
  'hash': Hash,
  'users': Users,
  'send': Send,
  'message-square': MessageSquare,
  'headphones': Headphones,
  'cloud': Cloud,
  'target': Target,
  'git-branch': GitBranch,
  'database': Database,
  'layout-grid': LayoutGrid,
  'table': Table,
  'file-text': FileText,
  'sheet': Table,
  'bar-chart': BarChart,
  'snowflake': Snowflake,
  'zap': Zap,
  'credit-card': CreditCard,
  'dollar-sign': DollarSign,
  'calculator': Calculator,
  'trending-up': TrendingUp,
  'square': Square,
  'brain': Brain,
  'cpu': Cpu,
  'sparkles': Sparkles,
  'smile': Smile,
  'workflow': Workflow,
  'layers': Layers,
  'check-square': CheckSquare,
  'clipboard': Clipboard,
  'calendar': Calendar,
  'bell': Bell,
};

export function CapabilityLattice() {
  const { integrations, toggleApp, isAppSelected, stack } = useStack();
  const { t } = useLocale();
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const layers = Object.entries(integrations.layers);

  return (
    <div className="relative">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${builderBackground})` }}
      />
      
      <div className="relative grid lg:grid-cols-4 gap-6">
        {/* Layer Navigation */}
        <aside className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t.marketplace.layers}
          </h3>
          <div className="space-y-2">
            {layers.map(([key, layer]) => (
              <Button
                key={key}
                variant={activeLayer === key ? 'control' : 'ghost'}
                className={`w-full justify-start gap-3 ${activeLayer === key ? 'border-primary/30' : ''}`}
                onClick={() => setActiveLayer(activeLayer === key ? null : key)}
              >
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  {iconMap[layer.apps[0]?.icon] && 
                    (() => {
                      const Icon = iconMap[layer.apps[0]?.icon];
                      return <Icon className="w-4 h-4 text-primary" />;
                    })()
                  }
                </div>
                <div className="text-left">
                  <span className="block text-sm">{layer.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {layer.apps.length} apps
                  </span>
                </div>
              </Button>
            ))}
          </div>

          {/* Selected Apps */}
          {stack.selectedApps.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {t.builder.selectedApps} ({stack.selectedApps.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {stack.selectedApps.slice(0, 10).map((appId) => (
                  <Badge key={appId} variant="layer" className="text-[10px]">
                    {appId}
                  </Badge>
                ))}
                {stack.selectedApps.length > 10 && (
                  <Badge variant="outline" className="text-[10px]">
                    +{stack.selectedApps.length - 10}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Telemetry */}
          <div className="pt-4 border-t border-border">
            <StackTelemetry />
          </div>
        </aside>

        {/* App Lattice */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t.builder.title}</h2>
            <p className="text-muted-foreground text-sm">{t.builder.subtitle}</p>
          </div>

          <div className="space-y-8">
            {layers.map(([key, layer]) => {
              if (activeLayer && activeLayer !== key) return null;
              
              return (
                <div key={key} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{layer.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {layer.apps.length} integrations
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                    {layer.apps.map((app, index) => {
                      const isSelected = isAppSelected(app.id);
                      const Icon = iconMap[app.icon] || Cpu;
                      
                      return (
                        <Card
                          key={app.id}
                          variant="glass"
                          className={`p-3 cursor-pointer transition-all duration-200 fade-in ${
                            isSelected
                              ? 'border-primary/50 bg-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.1)]'
                              : 'hover:border-primary/30'
                          }`}
                          style={{ animationDelay: `${index * 0.02}s` }}
                          onClick={() => toggleApp(app.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-primary/20 border border-primary/30'
                                  : 'bg-secondary/50 border border-border'
                              }`}
                            >
                              <Icon
                                className={`w-5 h-5 ${
                                  isSelected ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                isSelected ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {app.name}
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
