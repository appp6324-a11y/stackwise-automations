import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/contexts/LocaleContext';
import {
  Zap,
  Database,
  Mail,
  MessageSquare,
  CreditCard,
  Users,
  FileText,
  Calendar,
  ShoppingCart,
  BarChart3,
  Globe,
  Smartphone,
  Cloud,
  Lock,
  Cpu,
  Workflow,
  Bot,
  Layers,
  ArrowRight,
  Building2,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Factory,
  Plane,
  Store,
  Scale,
  Truck,
  Landmark,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Node types for the automation visualization
const nodeTypes = {
  trigger: { color: 'hsl(var(--tier-enterprise))', label: 'Trigger' },
  action: { color: 'hsl(var(--primary))', label: 'Action' },
  ai: { color: 'hsl(var(--tier-pro))', label: 'AI' },
  data: { color: 'hsl(var(--status-active))', label: 'Data' },
};

// App nodes representing various integrations
const appNodes = [
  { id: 'slack', icon: MessageSquare, name: 'Slack', type: 'trigger', x: 10, y: 20 },
  { id: 'gmail', icon: Mail, name: 'Gmail', type: 'trigger', x: 25, y: 35 },
  { id: 'salesforce', icon: Users, name: 'Salesforce', type: 'action', x: 40, y: 15 },
  { id: 'sheets', icon: FileText, name: 'Sheets', type: 'data', x: 55, y: 40 },
  { id: 'stripe', icon: CreditCard, name: 'Stripe', type: 'action', x: 70, y: 25 },
  { id: 'calendar', icon: Calendar, name: 'Calendar', type: 'trigger', x: 85, y: 45 },
  { id: 'shopify', icon: ShoppingCart, name: 'Shopify', type: 'trigger', x: 15, y: 55 },
  { id: 'analytics', icon: BarChart3, name: 'Analytics', type: 'data', x: 30, y: 70 },
  { id: 'webhook', icon: Globe, name: 'Webhook', type: 'trigger', x: 45, y: 60 },
  { id: 'twilio', icon: Smartphone, name: 'Twilio', type: 'action', x: 60, y: 75 },
  { id: 'aws', icon: Cloud, name: 'AWS', type: 'data', x: 75, y: 55 },
  { id: 'openai', icon: Bot, name: 'OpenAI', type: 'ai', x: 90, y: 70 },
  { id: 'database', icon: Database, name: 'Database', type: 'data', x: 20, y: 85 },
  { id: 'auth', icon: Lock, name: 'Auth', type: 'action', x: 50, y: 85 },
  { id: 'processor', icon: Cpu, name: 'Process', type: 'action', x: 80, y: 85 },
];

// Connection paths between nodes
const connections = [
  { from: 'slack', to: 'salesforce' },
  { from: 'gmail', to: 'sheets' },
  { from: 'salesforce', to: 'stripe' },
  { from: 'sheets', to: 'analytics' },
  { from: 'stripe', to: 'calendar' },
  { from: 'shopify', to: 'webhook' },
  { from: 'analytics', to: 'twilio' },
  { from: 'webhook', to: 'aws' },
  { from: 'twilio', to: 'openai' },
  { from: 'aws', to: 'processor' },
  { from: 'database', to: 'auth' },
  { from: 'auth', to: 'processor' },
  { from: 'gmail', to: 'openai' },
  { from: 'shopify', to: 'analytics' },
  { from: 'slack', to: 'database' },
];

// Industry sectors
const sectors = [
  { icon: Building2, name: 'Enterprise' },
  { icon: Stethoscope, name: 'Healthcare' },
  { icon: Briefcase, name: 'Finance' },
  { icon: GraduationCap, name: 'Education' },
  { icon: Factory, name: 'Manufacturing' },
  { icon: Plane, name: 'Travel' },
  { icon: Store, name: 'Retail' },
  { icon: Scale, name: 'Legal' },
  { icon: Truck, name: 'Logistics' },
  { icon: Landmark, name: 'Government' },
];

export function AutomationNodesHero() {
  const { t } = useLocale();
  const [activeConnections, setActiveConnections] = useState<number[]>([]);
  const [pulsingNodes, setPulsingNodes] = useState<string[]>([]);

  // Animate connections
  useEffect(() => {
    const interval = setInterval(() => {
      const randomConnections = connections
        .map((_, index) => index)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      setActiveConnections(randomConnections);

      const randomNodes = appNodes
        .map((node) => node.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setPulsingNodes(randomNodes);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (nodeId: string) => {
    const node = appNodes.find((n) => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <section className="relative min-h-screen pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 schematic-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[hsl(var(--tier-pro))]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="container relative mx-auto px-4">
        {/* Header Badge */}
        <div className="text-center mb-8 fade-in">
          <Badge variant="outline" className="font-mono text-xs px-4 py-2 border-primary/30 inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Powered by n8n • Zapier • Make • Custom APIs</span>
          </Badge>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12 space-y-4 fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span className="text-gradient">Automation Matrix</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect 300+ apps with intelligent workflows. One platform for every business sector.
          </p>
        </div>

        {/* Node Connection Visualization - 3D Perspective Container */}
        <div 
          className="relative w-full aspect-[16/9] md:aspect-[21/9] max-w-6xl mx-auto mb-12 fade-in"
          style={{ 
            animationDelay: '0.2s',
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* 3D Tilted Visualization Plane */}
          <div
            className="relative w-full h-full transition-transform duration-700 hover:scale-[1.02]"
            style={{
              transform: 'rotateX(12deg) rotateY(-3deg) rotateZ(1deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Depth Shadow Layer */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
              style={{
                transform: 'translateZ(-40px)',
                boxShadow: '0 40px 80px -20px hsl(var(--primary) / 0.15), 0 20px 40px -10px hsl(var(--background) / 0.8)',
              }}
            />
            
            {/* Main Visualization Surface */}
            <div 
              className="absolute inset-0 rounded-2xl glass-panel overflow-hidden"
              style={{
                transform: 'translateZ(0px)',
                boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.25), inset 0 1px 0 hsl(var(--foreground) / 0.05)',
              }}
            >
              {/* Inner Grid Pattern */}
              <div className="absolute inset-0 schematic-grid opacity-20" />
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {connections.map((conn, index) => {
              const from = getNodePosition(conn.from);
              const to = getNodePosition(conn.to);
              const isActive = activeConnections.includes(index);
              
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={isActive ? '0' : '4 4'}
                    className="transition-all duration-500"
                    filter={isActive ? 'url(#glow)' : ''}
                    opacity={isActive ? 1 : 0.3}
                  />
                  {isActive && (
                    <circle r="4" fill="hsl(var(--primary))">
                      <animateMotion
                        dur="1s"
                        repeatCount="1"
                        path={`M${from.x * 10},${from.y * 10} L${to.x * 10},${to.y * 10}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node Icons */}
          {appNodes.map((node) => {
            const Icon = node.icon;
            const isPulsing = pulsingNodes.includes(node.id);
            const nodeColor = nodeTypes[node.type as keyof typeof nodeTypes].color;
            
            return (
              <div
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isPulsing ? 'scale-125 z-20' : 'scale-100 z-10'
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
              >
                <div
                  className={`relative w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                    isPulsing ? 'shadow-lg' : ''
                  }`}
                  style={{
                    backgroundColor: `${nodeColor}20`,
                    borderColor: isPulsing ? nodeColor : `${nodeColor}50`,
                    boxShadow: isPulsing ? `0 0 20px ${nodeColor}50` : 'none',
                  }}
                >
                  <Icon
                    className="w-5 h-5 md:w-7 md:h-7"
                    style={{ color: nodeColor }}
                  />
                  {isPulsing && (
                    <div
                      className="absolute inset-0 rounded-xl animate-ping"
                      style={{ backgroundColor: `${nodeColor}20` }}
                    />
                  )}
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-mono text-muted-foreground whitespace-nowrap hidden md:block">
                  {node.name}
                </span>
              </div>
            );
          })}

          {/* Central Hub */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="relative">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/50 flex items-center justify-center data-glow">
                <Workflow className="w-10 h-10 md:w-14 md:h-14 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse" />
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Industry Sectors Grid */}
        <div className="mb-12 fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-center text-sm text-muted-foreground mb-6 font-mono">
            WORKS WITH EVERY SECTOR
          </p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4 max-w-4xl mx-auto">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.name}
                  className="flex flex-col items-center gap-2 group"
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg glass-panel flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[10px] md:text-xs text-muted-foreground font-medium text-center">
                    {sector.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12 fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '300+', label: 'Integrations' },
            { value: '180+', label: 'Templates' },
            { value: '10+', label: 'Sectors' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-lg p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in" style={{ animationDelay: '0.5s' }}>
          <Link to="/marketplace">
            <Button variant="hero" size="xl" className="gap-2 group w-full sm:w-auto">
              {t.cta.explore}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/builder">
            <Button variant="glass" size="xl" className="gap-2 w-full sm:w-auto">
              <Layers className="w-5 h-5" />
              {t.cta.build}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
