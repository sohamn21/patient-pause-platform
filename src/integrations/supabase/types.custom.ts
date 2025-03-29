
export interface Profile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  role: string;
  business_name: string | null;
  business_type: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Waitlist {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  max_capacity: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  waitlist_id: string;
  user_id: string;
  position: number;
  notes: string | null;
  status: 'waiting' | 'notified' | 'seated' | 'cancelled';
  estimated_wait_time: number | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
}
