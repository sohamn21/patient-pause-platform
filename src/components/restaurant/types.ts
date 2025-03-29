
export interface TableType {
  id: string;
  name: string;
  capacity: number;
  width: number;
  height: number;
  shape?: 'rectangle' | 'circle';
  color?: string;
}

export interface FloorItem {
  id: string;
  type: 'table' | 'wall' | 'door' | 'decoration';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  tableType?: string;
  capacity?: number;
  number?: number;
  shape?: 'rectangle' | 'circle';
  status?: 'available' | 'occupied' | 'reserved';
  color?: string;
  label?: string;
  reservationId?: string;
}

export interface FloorPlanSettings {
  gridSize: number;
  showNumbers: boolean;
  showCapacity: boolean;
  snapToGrid: boolean;
}

export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  date: Date;
  time: string;
  partySize: number;
  notes?: string;
  createdAt: string;
  businessId: string;
}

export interface WaitlistEntryType {
  id: string;
  waitlist_id: string;
  user_id: string;
  position: number;
  status: 'waiting' | 'notified' | 'seated' | 'cancelled';
  estimated_wait_time?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
  };
}
