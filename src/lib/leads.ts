import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  stack_manifest?: Json;
  source?: 'contact_form' | 'deployment_request' | 'whatsapp' | 'email';
  session_id?: string;
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message || null,
        stack_manifest: data.stack_manifest || null,
        source: data.source || 'contact_form',
        session_id: data.session_id || null,
        status: 'new',
      }]);

    if (error) {
      console.error('Error submitting lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error submitting lead:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
