
import { supabase } from '@/integrations/supabase/client';
import { Waitlist, WaitlistEntry } from '@/integrations/supabase/types.custom';
import { WaitlistEntryType } from '@/components/restaurant/types';

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
  user_id?: string; // Make user_id optional for guest entries
  notes?: string;
  status?: 'waiting' | 'notified' | 'seated' | 'cancelled';
  estimated_wait_time?: number;
  guest_name?: string; // Add guest information fields
  guest_phone?: string;
  guest_email?: string;
  guest_party_size?: number;
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
  
  // Add the entry with the next position - explicitly cast to any to handle flexible schema
  const { data, error } = await supabase
    .from('waitlist_entries')
    .insert({ 
      ...entryData, 
      position: nextPosition 
    } as any)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// New function specifically for guest entries
export const addGuestToWaitlist = async (waitlistId: string, guestData: {
  name: string;
  phone?: string;
  email?: string;
  party_size?: number;
  notes?: string;
}) => {
  // Get the current highest position
  const { data: positionData, error: positionError } = await supabase
    .from('waitlist_entries')
    .select('position')
    .eq('waitlist_id', waitlistId)
    .order('position', { ascending: false })
    .limit(1);
  
  if (positionError) throw positionError;
  
  // Determine the next position
  const nextPosition = positionData && positionData.length > 0 
    ? positionData[0].position + 1 
    : 1;
  
  // Create the entry data - explicitly cast to any to handle flexible schema
  const entryData = {
    waitlist_id: waitlistId,
    position: nextPosition,
    guest_name: guestData.name,
    guest_phone: guestData.phone,
    guest_email: guestData.email,
    guest_party_size: guestData.party_size || 1,
    notes: guestData.notes || 'Guest entry',
    status: 'waiting' as const,
    user_id: null // Explicitly set to null for guest entries
  };
  
  const { data, error } = await supabase
    .from('waitlist_entries')
    .insert(entryData as any)
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

export const getWaitlistEntries = async (waitlistId: string): Promise<WaitlistEntryType[]> => {
  // Using the join syntax with the profiles table, but without requesting the email field
  // since it doesn't exist in the profiles table
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select(`
      id,
      waitlist_id,
      user_id,
      position,
      status,
      estimated_wait_time,
      notes,
      created_at,
      updated_at,
      guest_name,
      guest_phone,
      guest_email,
      guest_party_size,
      profiles(
        username,
        first_name,
        last_name,
        phone_number
      )
    `)
    .eq('waitlist_id', waitlistId)
    .order('position', { ascending: true });
  
  if (error) throw error;
  
  // Convert the raw data to the expected WaitlistEntryType format
  return data.map(entry => {
    return {
      id: entry.id,
      waitlist_id: entry.waitlist_id,
      user_id: entry.user_id,
      position: entry.position,
      status: entry.status as "waiting" | "notified" | "seated" | "cancelled",
      estimated_wait_time: entry.estimated_wait_time,
      notes: entry.notes,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      guest_name: entry.guest_name,
      guest_phone: entry.guest_phone,
      guest_email: entry.guest_email,
      guest_party_size: entry.guest_party_size,
      profiles: entry.profiles ? {
        username: entry.profiles.username || null,
        first_name: entry.profiles.first_name || null,
        last_name: entry.profiles.last_name || null,
        phone_number: entry.profiles.phone_number || null,
        email: null // Set email to null since it doesn't exist in the profiles table
      } : null
    };
  });
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
