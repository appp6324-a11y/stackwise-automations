import React, { createContext, useContext, useState, ReactNode } from 'react';
import templatesData from '@/data/templates.en.json';
import integrationsData from '@/data/integrations.json';

export interface Template {
  id: string;
  name: string;
  category: string;
  industry: string[];
  what_it_automates: string;
  starting_price_usd: number;
  agent_involvement: 'Required' | 'Optional' | 'None';
  capability_layers: string[];
  integration_suggestions: string[];
  inputs: string[];
  outputs: string[];
  slo_tier: 'Standard' | 'Pro' | 'Enterprise';
  deployment_eta_hours: [number, number];
  image_key: string;
  tags: string[];
}

export interface StackState {
  templates: Template[];
  selectedApps: string[];
  agentsEnabled: number;
  complexityTier: 'Basic' | 'Standard' | 'Pro' | 'Enterprise';
}

interface StackContextType {
  stack: StackState;
  templates: Template[];
  integrations: typeof integrationsData;
  addTemplate: (template: Template) => void;
  removeTemplate: (templateId: string) => void;
  toggleApp: (appId: string) => void;
  clearStack: () => void;
  isTemplateInStack: (templateId: string) => boolean;
  isAppSelected: (appId: string) => boolean;
  getTotalPrice: () => number;
  getAgentCount: () => number;
}

const StackContext = createContext<StackContextType | undefined>(undefined);

function calculateComplexity(templates: Template[], apps: string[]): StackState['complexityTier'] {
  const templateCount = templates.length;
  const appCount = apps.length;
  const hasEnterprise = templates.some(t => t.slo_tier === 'Enterprise');
  const hasPro = templates.some(t => t.slo_tier === 'Pro');
  const hasAI = templates.some(t => t.agent_involvement === 'Required');

  if (hasEnterprise || (templateCount > 10 && appCount > 15)) return 'Enterprise';
  if (hasPro || (templateCount > 5 && appCount > 8) || hasAI) return 'Pro';
  if (templateCount > 2 || appCount > 3) return 'Standard';
  return 'Basic';
}

export function StackProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<StackState>({
    templates: [],
    selectedApps: [],
    agentsEnabled: 0,
    complexityTier: 'Basic',
  });

  const templates = templatesData as Template[];
  const integrations = integrationsData;

  const updateStack = (newTemplates: Template[], newApps: string[]) => {
    const agentsEnabled = newTemplates.filter(t => t.agent_involvement === 'Required').length;
    const complexityTier = calculateComplexity(newTemplates, newApps);
    
    setStack({
      templates: newTemplates,
      selectedApps: newApps,
      agentsEnabled,
      complexityTier,
    });
  };

  const addTemplate = (template: Template) => {
    if (!stack.templates.find(t => t.id === template.id)) {
      const newTemplates = [...stack.templates, template];
      // Auto-add suggested integrations
      const newApps = [...new Set([...stack.selectedApps, ...template.integration_suggestions.map(i => i.toLowerCase().replace(/\s+/g, '-'))])];
      updateStack(newTemplates, newApps);
    }
  };

  const removeTemplate = (templateId: string) => {
    const newTemplates = stack.templates.filter(t => t.id !== templateId);
    updateStack(newTemplates, stack.selectedApps);
  };

  const toggleApp = (appId: string) => {
    const newApps = stack.selectedApps.includes(appId)
      ? stack.selectedApps.filter(id => id !== appId)
      : [...stack.selectedApps, appId];
    updateStack(stack.templates, newApps);
  };

  const clearStack = () => {
    setStack({
      templates: [],
      selectedApps: [],
      agentsEnabled: 0,
      complexityTier: 'Basic',
    });
  };

  const isTemplateInStack = (templateId: string) => stack.templates.some(t => t.id === templateId);
  const isAppSelected = (appId: string) => stack.selectedApps.includes(appId);
  
  const getTotalPrice = () => stack.templates.reduce((sum, t) => sum + t.starting_price_usd, 0);
  const getAgentCount = () => stack.templates.filter(t => t.agent_involvement === 'Required').length;

  return (
    <StackContext.Provider
      value={{
        stack,
        templates,
        integrations,
        addTemplate,
        removeTemplate,
        toggleApp,
        clearStack,
        isTemplateInStack,
        isAppSelected,
        getTotalPrice,
        getAgentCount,
      }}
    >
      {children}
    </StackContext.Provider>
  );
}

export function useStack() {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error('useStack must be used within a StackProvider');
  }
  return context;
}
