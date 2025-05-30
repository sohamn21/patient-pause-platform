
import { supabase } from './client';

export interface ProfileUpdate {
  id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  business_name?: string;
  business_type?: string;
  updated_at?: string;
}

export const updateProfile = async (userId: string, updates: ProfileUpdate) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
