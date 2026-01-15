import { useState } from 'react';
import { useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useSession } from '@/hooks/useSession';
import { submitLead } from '@/lib/leads';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type LeadSource = 'contact_form' | 'deployment_request' | 'whatsapp' | 'email';

interface ContactFormProps {
  trigger?: React.ReactNode;
  source?: LeadSource;
  includeManifest?: boolean;
}

export function ContactForm({ trigger, source = 'contact_form', includeManifest = false }: ContactFormProps) {
  const { stack, getTotalPrice } = useStack();
  const { formatPrice } = useLocale();
  const { sessionId } = useSession();
  
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    let stackManifest: Json | undefined = undefined;
    
    if (includeManifest && stack.templates.length > 0) {
      stackManifest = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        complexity_tier: stack.complexityTier,
        templates: stack.templates.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category,
          starting_price_usd: t.starting_price_usd,
        })),
        integrations: stack.selectedApps,
        agents_enabled: stack.agentsEnabled,
        estimated_price_floor_usd: getTotalPrice(),
      };
    }

    const result = await submitLead({
      ...formData,
      source,
      session_id: sessionId,
      stack_manifest: stackManifest,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      toast.success('Your request has been submitted successfully!');
      
      // Reset form after delay
      setTimeout(() => {
        setOpen(false);
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
        });
      }, 2000);
    } else {
      toast.error(result.error || 'Failed to submit. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="glass" className="gap-2">
            <Send className="w-4 h-4" />
            Contact Us
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {source === 'deployment_request' ? 'Request Deployment' : 'Contact Us'}
          </DialogTitle>
          <DialogDescription>
            {source === 'deployment_request' 
              ? `Submit your automation stack for deployment review. Estimated price floor: ${formatPrice(getTotalPrice())}`
              : 'Get in touch with our automation experts to discuss your requirements.'
            }
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold">Thank You!</h3>
            <p className="text-muted-foreground">
              We've received your request and will be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {includeManifest && stack.templates.length > 0 && (
              <Card className="p-3 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <strong>{stack.templates.length}</strong> templates selected • 
                  <strong> {stack.selectedApps.length}</strong> integrations • 
                  <strong> {stack.complexityTier}</strong> tier
                </p>
              </Card>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9910710219"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Your company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your automation needs..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {source === 'deployment_request' ? 'Request Deployment' : 'Send Message'}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
