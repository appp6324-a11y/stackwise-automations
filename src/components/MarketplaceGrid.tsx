import { useState, useMemo } from 'react';
import { useStack } from '@/contexts/StackContext';
import { useLocale } from '@/contexts/LocaleContext';
import { TemplateCard } from '@/components/TemplateCard';
import { StackTelemetry } from '@/components/StackTelemetry';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, LayoutGrid, List, X } from 'lucide-react';
import integrationsData from '@/data/integrations.json';

export function MarketplaceGrid() {
  const { templates } = useStack();
  const { t } = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const layers = ['AI', 'Data', 'CRM', 'Ops', 'Channels', 'Payments'];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          template.name.toLowerCase().includes(query) ||
          template.what_it_automates.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category
      if (selectedCategory !== 'all' && template.category !== selectedCategory) {
        return false;
      }

      // Industry
      if (selectedIndustry !== 'all' && !template.industry.includes(selectedIndustry)) {
        return false;
      }

      // Layers
      if (selectedLayers.length > 0) {
        const hasLayers = selectedLayers.some((layer) =>
          template.capability_layers.includes(layer)
        );
        if (!hasLayers) return false;
      }

      // Agent
      if (selectedAgent !== 'all' && template.agent_involvement !== selectedAgent) {
        return false;
      }

      return true;
    });
  }, [templates, searchQuery, selectedCategory, selectedIndustry, selectedLayers, selectedAgent]);

  const toggleLayer = (layer: string) => {
    setSelectedLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedIndustry('all');
    setSelectedLayers([]);
    setSelectedAgent('all');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedIndustry !== 'all' ||
    selectedLayers.length > 0 ||
    selectedAgent !== 'all';

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.marketplace.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.marketplace.category}
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue placeholder={t.marketplace.allCategories} />
            </SelectTrigger>
            <SelectContent className="glass-panel">
              <SelectItem value="all">{t.marketplace.allCategories}</SelectItem>
              {integrationsData.categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.marketplace.industry}
          </label>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue placeholder={t.marketplace.allIndustries} />
            </SelectTrigger>
            <SelectContent className="glass-panel">
              <SelectItem value="all">{t.marketplace.allIndustries}</SelectItem>
              {integrationsData.industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Capability Layers */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.marketplace.layers}
          </label>
          <div className="flex flex-wrap gap-2">
            {layers.map((layer) => (
              <Badge
                key={layer}
                variant={selectedLayers.includes(layer) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => toggleLayer(layer)}
              >
                {layer}
              </Badge>
            ))}
          </div>
        </div>

        {/* Agent Involvement */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.marketplace.agentInvolvement}
          </label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-panel">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Required">Required</SelectItem>
              <SelectItem value="Optional">Optional</SelectItem>
              <SelectItem value="None">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full gap-2 text-muted-foreground"
          >
            <X className="w-4 h-4" />
            {t.common.clear}
          </Button>
        )}

        {/* Telemetry */}
        <div className="hidden lg:block pt-4 border-t border-border">
          <StackTelemetry />
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t.marketplace.title}</h2>
            <p className="text-sm text-muted-foreground">
              {t.marketplace.resultsCount.replace('{{count}}', filteredTemplates.length.toString())}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'control' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'control' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {filteredTemplates.map((template, index) => (
            <div
              key={template.id}
              className="fade-in"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <TemplateCard template={template} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="glass-panel rounded-lg p-12 text-center">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No templates found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
