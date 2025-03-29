
import { supabase } from '@/integrations/supabase/client';
import { Waitlist, WaitlistEntry } from '@/integrations/supabase/types.custom';

// Define types with required fields for creation operations
type CreateWaitlistData = {
  business_id: string;
  name: string;
  description?: string;
  max_capacity?: number;
  is_active?: boolean;
};

type CreateWaitlistEntryData = {
  waitlist_id: string;
  user_id: string;
  notes?: string;
  status?: 'waiting' | 'notified' | 'seated' | 'cancelled';
  estimated_wait_time?: number;
};

// Waitlist management functions for business owners
export const createWaitlist = async (waitlistData: CreateWaitlistData) => {
  const { data, error } = await supabase
    .from('waitlists')
    .insert(waitlistData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateWaitlist = async (id: string, waitlistData: Partial<Waitlist>) => {
  const { data, error } = await supabase
    .from('waitlists')
    .update(waitlistData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteWaitlist = async (id: string) => {
  const { error } = await supabase
    .from('waitlists')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

export const getBusinessWaitlists = async (businessId: string) => {
  const { data, error } = await supabase
    .from('waitlists')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Waitlist entry functions for customers and businesses
export const addToWaitlist = async (entryData: CreateWaitlistEntryData) => {
  // First, get the current highest position
  const { data: positionData, error: positionError } = await supabase
    .from('waitlist_entries')
    .select('position')
    .eq('waitlist_id', entryData.waitlist_id)
    .order('position', { ascending: false })
    .limit(1);
  
  if (positionError) throw positionError;
  
  // Determine the next position
  const nextPosition = positionData && positionData.length > 0 
    ? positionData[0].position + 1 
    : 1;
  
  // Add the entry with the next position
  const { data, error } = await supabase
    .from('waitlist_entries')
    .insert({ 
      ...entryData, 
      position: nextPosition 
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateWaitlistEntry = async (id: string, entryData: Partial<WaitlistEntry>) => {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .update(entryData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const removeFromWaitlist = async (id: string) => {
  const { error } = await supabase
    .from('waitlist_entries')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

export const getWaitlistEntries = async (waitlistId: string) => {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select(`
      *,
      profiles:user_id (
        username,
        first_name,
        last_name,
        phone_number
      )
    `)
    .eq('waitlist_id', waitlistId)
    .order('position', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getUserWaitlistEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select(`
      *,
      waitlists:waitlist_id (
        name,
        description,
        business_id,
        profiles:business_id (
          business_name
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get available waitlists for customers to join
export const getAvailableWaitlists = async () => {
  const { data, error } = await supabase
    .from('waitlists')
    .select(`
      *,
      profiles:business_id (
        business_name,
        business_type
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
