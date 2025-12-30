import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Linkedin, Twitter } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import sachidaxLogo from '@/assets/sachidax-logo.png';

export function Footer() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: t.nav.capabilities, path: '/' },
    { label: t.nav.marketplace, path: '/marketplace' },
    { label: t.nav.builder, path: '/builder' },
    { label: 'Manifest', path: '/manifest' },
  ];

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                <img src={sachidaxLogo} alt="SACHIDAX Logo" className="w-8 h-8 object-contain invert" />
              </div>
              <span className="font-semibold text-lg">SACHIDAX-AI-AutoStack</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              {t.footer.poweredBy}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@sachidax.com"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  contact@sachidax.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} SACHIDAX-AI-AutoStack. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
