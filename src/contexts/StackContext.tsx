import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import templatesData from '@/data/templates.en.json';
import integrationsData from '@/data/integrations.json';
import { supabase } from '@/integrations/supabase/client';

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
  isLoading: boolean;
  isSaving: boolean;
}

const StackContext = createContext<StackContextType | undefined>(undefined);

const SESSION_KEY = 'sachidax_session_id';

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [stackId, setStackId] = useState<string | null>(null);

  const templates = templatesData as Template[];
  const integrations = integrationsData;

  // Load stack from database on mount
  useEffect(() => {
    const loadStack = async () => {
      const sessionId = getSessionId();
      
      try {
        const { data, error } = await supabase
          .from('stacks')
          .select('*')
          .eq('session_id', sessionId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error loading stack:', error);
          setIsLoading(false);
          return;
        }

        if (data) {
          setStackId(data.id);
          
          // Reconstruct templates from stored template IDs
          const storedTemplates = (data.templates as { id: string }[]) || [];
          const templateIds = storedTemplates.map(t => t.id);
          const loadedTemplates = templates.filter(t => templateIds.includes(t.id));
          
          const agentsEnabled = loadedTemplates.filter(t => t.agent_involvement === 'Required').length;
          const complexityTier = calculateComplexity(loadedTemplates, data.selected_apps || []);

          setStack({
            templates: loadedTemplates,
            selectedApps: data.selected_apps || [],
            agentsEnabled,
            complexityTier,
          });
        }
      } catch (err) {
        console.error('Unexpected error loading stack:', err);
      }
      
      setIsLoading(false);
    };

    loadStack();
  }, []);

  // Save stack to database whenever it changes
  const saveStack = useCallback(async (newStack: StackState) => {
    const sessionId = getSessionId();
    setIsSaving(true);

    try {
      const stackData = {
        session_id: sessionId,
        templates: newStack.templates.map(t => ({ id: t.id, name: t.name })),
        selected_apps: newStack.selectedApps,
        agents_enabled: newStack.agentsEnabled,
        complexity_tier: newStack.complexityTier,
      };

      if (stackId) {
        // Update existing stack
        await supabase
          .from('stacks')
          .update(stackData)
          .eq('id', stackId);
      } else if (newStack.templates.length > 0 || newStack.selectedApps.length > 0) {
        // Create new stack only if there's content
        const { data } = await supabase
          .from('stacks')
          .insert([stackData])
          .select('id')
          .single();
        
        if (data) {
          setStackId(data.id);
        }
      }
    } catch (err) {
      console.error('Error saving stack:', err);
    }

    setIsSaving(false);
  }, [stackId]);

  const updateStack = useCallback((newTemplates: Template[], newApps: string[]) => {
    const agentsEnabled = newTemplates.filter(t => t.agent_involvement === 'Required').length;
    const complexityTier = calculateComplexity(newTemplates, newApps);
    
    const newStack = {
      templates: newTemplates,
      selectedApps: newApps,
      agentsEnabled,
      complexityTier,
    };

    setStack(newStack);
    saveStack(newStack);
  }, [saveStack]);

  const addTemplate = useCallback((template: Template) => {
    if (!stack.templates.find(t => t.id === template.id)) {
      const newTemplates = [...stack.templates, template];
      // Auto-add suggested integrations
      const newApps = [...new Set([...stack.selectedApps, ...template.integration_suggestions.map(i => i.toLowerCase().replace(/\s+/g, '-'))])];
      updateStack(newTemplates, newApps);
    }
  }, [stack.templates, stack.selectedApps, updateStack]);

  const removeTemplate = useCallback((templateId: string) => {
    const newTemplates = stack.templates.filter(t => t.id !== templateId);
    updateStack(newTemplates, stack.selectedApps);
  }, [stack.templates, stack.selectedApps, updateStack]);

  const toggleApp = useCallback((appId: string) => {
    const newApps = stack.selectedApps.includes(appId)
      ? stack.selectedApps.filter(id => id !== appId)
      : [...stack.selectedApps, appId];
    updateStack(stack.templates, newApps);
  }, [stack.templates, stack.selectedApps, updateStack]);

  const clearStack = useCallback(async () => {
    const newStack = {
      templates: [],
      selectedApps: [],
      agentsEnabled: 0,
      complexityTier: 'Basic' as const,
    };
    
    setStack(newStack);
    
    // Delete from database if exists
    if (stackId) {
      try {
        await supabase
          .from('stacks')
          .delete()
          .eq('id', stackId);
        setStackId(null);
      } catch (err) {
        console.error('Error clearing stack:', err);
      }
    }
  }, [stackId]);

  const isTemplateInStack = useCallback((templateId: string) => 
    stack.templates.some(t => t.id === templateId), [stack.templates]);
  
  const isAppSelected = useCallback((appId: string) => 
    stack.selectedApps.includes(appId), [stack.selectedApps]);
  
  const getTotalPrice = useCallback(() => 
    stack.templates.reduce((sum, t) => sum + t.starting_price_usd, 0), [stack.templates]);
  
  const getAgentCount = useCallback(() => 
    stack.templates.filter(t => t.agent_involvement === 'Required').length, [stack.templates]);

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
        isLoading,
        isSaving,
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
