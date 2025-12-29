import { useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileJson,
  Copy,
  Download,
  MessageSquare,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  Shield,
  ClipboardList,
  Gauge,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export function ManifestView() {
  const { stack, templates, getTotalPrice, removeTemplate } = useStack();
  const { t, formatPrice } = useLocale();

  const manifest = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    complexity_tier: stack.complexityTier,
    templates: stack.templates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      starting_price_usd: t.starting_price_usd,
      agent_involvement: t.agent_involvement,
      slo_tier: t.slo_tier,
    })),
    integrations: stack.selectedApps,
    agents_enabled: stack.agentsEnabled,
    estimated_price_floor_usd: getTotalPrice(),
  };

  const readinessChecks = [
    {
      name: t.manifest.governance,
      status: stack.templates.some((t) => t.slo_tier === 'Enterprise') ? 'required' : 'optional',
      icon: Shield,
    },
    {
      name: t.manifest.audit,
      status: stack.templates.some((t) => t.tags.includes('audit')) ? 'included' : 'optional',
      icon: ClipboardList,
    },
    {
      name: t.manifest.reliability,
      status: stack.templates.length > 5 ? 'recommended' : 'optional',
      icon: Gauge,
    },
  ];

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    toast.success('Manifest copied to clipboard');
  };

  const handleCopyMessage = () => {
    const message = `
Automation Stack Request

Templates (${stack.templates.length}):
${stack.templates.map((t) => `- ${t.name} (${t.category})`).join('\n')}

Integrations: ${stack.selectedApps.join(', ')}
Complexity Tier: ${stack.complexityTier}
AI Agents: ${stack.agentsEnabled}
Estimated Price Floor: ${formatPrice(getTotalPrice())}

Please contact us to discuss deployment.
    `.trim();

    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stack-manifest-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Manifest downloaded');
  };

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    `Stack Request: ${stack.templates.length} templates, ${stack.selectedApps.length} integrations. Tier: ${stack.complexityTier}`
  )}`;

  const emailLink = `mailto:?subject=Automation Stack Request&body=${encodeURIComponent(
    JSON.stringify(manifest, null, 2)
  )}`;

  if (stack.templates.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card variant="glass" className="max-w-md w-full p-8 text-center">
          <FileJson className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Templates Selected</h2>
          <p className="text-muted-foreground mb-6">
            Add templates to your stack to generate a deployment manifest.
          </p>
          <Button variant="hero" asChild>
            <a href="/marketplace">Browse Templates</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Manifest */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t.manifest.title}</h1>
            <p className="text-muted-foreground">{t.manifest.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="control" size="sm" onClick={handleCopyManifest}>
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </Button>
            <Button variant="control" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Templates List */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Selected Templates ({stack.templates.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stack.templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{template.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="layer" className="text-[9px]">
                      {template.category}
                    </Badge>
                    <Badge
                      variant={
                        template.slo_tier === 'Enterprise'
                          ? 'enterprise'
                          : template.slo_tier === 'Pro'
                          ? 'pro'
                          : 'standard'
                      }
                    >
                      {template.slo_tier}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-primary">
                    {formatPrice(template.starting_price_usd)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeTemplate(template.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* JSON Preview */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Manifest JSON
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded-lg bg-background/50 border border-border overflow-x-auto text-xs font-mono text-muted-foreground">
              {JSON.stringify(manifest, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Readiness Checks */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">{t.manifest.readinessChecks}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {readinessChecks.map((check) => {
              const Icon = check.icon;
              const statusIcon =
                check.status === 'included' ? (
                  <CheckCircle className="w-4 h-4 text-status-active" />
                ) : check.status === 'required' ? (
                  <AlertCircle className="w-4 h-4 text-tier-enterprise" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                );

              return (
                <div key={check.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon}
                    <span className="text-xs text-muted-foreground capitalize">{check.status}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Contact Actions */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">{t.cta.contact}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="hero" className="w-full gap-2" onClick={handleCopyMessage}>
              <Copy className="w-4 h-4" />
              Copy Message
            </Button>
            <Button variant="glass" className="w-full gap-2" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </Button>
            <Button variant="glass" className="w-full gap-2" asChild>
              <a href={emailLink}>
                <Mail className="w-4 h-4" />
                Email
              </a>
            </Button>
            <Button variant="glass" className="w-full gap-2">
              <Calendar className="w-4 h-4" />
              Book Consultation
            </Button>
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card variant="telemetry">
          <CardContent className="p-4 space-y-4">
            <div className="text-center">
              <span className="text-xs text-muted-foreground block mb-1">
                {t.pricing.startingFrom}
              </span>
              <span className="text-3xl font-bold text-primary font-mono">
                {formatPrice(getTotalPrice())}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">/month</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t.pricing.disclaimer}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
