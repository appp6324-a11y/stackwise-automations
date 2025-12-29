import { Globe, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/contexts/LocaleContext';
import localeConfig from '@/data/locale.config.json';

export function LocaleSelector() {
  const { locale, setLocale, currency, setCurrency } = useLocale();

  const currentLocale = localeConfig.supportedLocales.find(l => l.code === locale);

  return (
    <div className="flex items-center gap-2">
      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 font-mono text-xs">
            <Globe className="h-4 w-4 text-primary" />
            {currentLocale?.code.toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-panel">
          {localeConfig.supportedLocales.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => setLocale(l.code as any)}
              className={locale === l.code ? 'bg-primary/10 text-primary' : ''}
            >
              <span className="font-mono text-xs w-8">{l.code.toUpperCase()}</span>
              <span className="text-muted-foreground">{l.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Currency Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 font-mono text-xs">
            <DollarSign className="h-4 w-4 text-primary" />
            {currency}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-panel">
          {localeConfig.currencyOptions.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => setCurrency(c.code as any)}
              className={currency === c.code ? 'bg-primary/10 text-primary' : ''}
            >
              <span className="font-mono text-xs w-12">{c.code}</span>
              <span className="text-muted-foreground">{c.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
