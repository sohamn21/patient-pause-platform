
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/integrations/supabase/types.custom';

// Define type with required fields for notification creation
type CreateNotificationData = {
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read?: boolean;
};

export const createNotification = async (notificationData: CreateNotificationData) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateNotification = async (id: string, notificationData: Partial<Notification>) => {
  const { data, error } = await supabase
    .from('notifications')
    .update(notificationData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (id: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteNotification = async (id: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getUnreadNotificationsCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) throw error;
  return count || 0;
};
