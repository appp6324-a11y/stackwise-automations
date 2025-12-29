import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StackTelemetry } from '@/components/StackTelemetry';
import { useLocale } from '@/contexts/LocaleContext';
import heroBackground from '@/assets/hero-background.jpg';
import { 
  ArrowRight, 
  Layers, 
  Cpu,
  Workflow,
  Bot,
  Shield,
  BarChart3
} from 'lucide-react';

export function HeroSection() {
  const { t } = useLocale();

  const capabilities = [
    { icon: Bot, label: 'AI Agents', description: 'Intelligent automation' },
    { icon: Workflow, label: 'Orchestration', description: 'Multi-step workflows' },
    { icon: Layers, label: 'Integrations', description: '300+ connectors' },
    { icon: Shield, label: 'Governance', description: 'Audit & compliance' },
    { icon: BarChart3, label: 'Analytics', description: 'Real-time insights' },
    { icon: Cpu, label: 'Edge Logic', description: 'Custom processing' },
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Background Grid */}
      <div className="absolute inset-0 schematic-grid opacity-20" />
      
      {/* Animated Scan Line */}
      <div className="scan-line" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Badge */}
            <div className="fade-in" style={{ animationDelay: '0.1s' }}>
              <Badge variant="outline" className="font-mono text-xs px-4 py-2 border-primary/30">
                <span className="w-2 h-2 rounded-full bg-primary mr-2 pulse-node" />
                {t.hero.badge}
              </Badge>
            </div>

            {/* Title */}
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">{t.hero.title}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {t.hero.subtitle}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/marketplace">
                <Button variant="hero" size="xl" className="gap-2 group">
                  {t.cta.explore}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/builder">
                <Button variant="glass" size="xl" className="gap-2">
                  <Layers className="w-5 h-5" />
                  {t.cta.build}
                </Button>
              </Link>
            </div>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 stagger-children">
              {capabilities.map((cap, index) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.label}
                    className="glass-panel rounded-lg p-4 hover:border-primary/30 transition-colors group"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">
                          {cap.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Telemetry Panel */}
          <div className="lg:sticky lg:top-24 fade-in" style={{ animationDelay: '0.5s' }}>
            <StackTelemetry />
          </div>
        </div>
      </div>
    </section>
  );
}
