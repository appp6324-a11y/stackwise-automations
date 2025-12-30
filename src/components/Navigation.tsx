import { Link, useLocation } from 'react-router-dom';
import { Cpu, LayoutGrid, Layers, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocaleSelector } from '@/components/LocaleSelector';
import { useLocale } from '@/contexts/LocaleContext';
import sachidaxLogo from '@/assets/sachidax-logo.png';

export function Navigation() {
  const { t } = useLocale();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.nav.capabilities, icon: Cpu },
    { path: '/marketplace', label: t.nav.marketplace, icon: LayoutGrid },
    { path: '/builder', label: t.nav.builder, icon: Layers },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-white border border-primary/30 flex items-center justify-center group-hover:bg-gray-100 transition-colors overflow-hidden">
            <img src={sachidaxLogo} alt="SACHIDAX Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-semibold text-lg hidden sm:block">
            SACHIDAX-AI-AutoStack
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'control' : 'ghost'}
                  size="sm"
                  className={`gap-2 ${isActive ? 'border-primary/30' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:block">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LocaleSelector />
          <Link to="/manifest">
            <Button variant="glass" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:block">Manifest</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
