export interface Practitioner {
  id: string;
  business_id: string;
  name: string;
  specialization: string | null;
  bio: string | null;
  availability: {
    [day: string]: {
      start: string;
      end: string;
      isAvailable: boolean;
    }
  } | null | any; // Support JSON data from database
  created_at: string | null;
  updated_at: string | null;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Patient {
  id: string;
  medical_history: string | null;
  allergies: string | null;
  emergency_contact: string | null;
  preferred_practitioner_id: string | null;
  notes: string | null;
  date_of_birth: string | null;
  created_at: string | null;
  updated_at: string | null;
  profile?: {
    id?: string;
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
  } | null;
}

export interface Appointment {
  id: string;
  business_id: string;
  patient_id: string;
  practitioner_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show' | string;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  patient?: Patient;
  practitioner?: Practitioner | any; // Support for JSON data from database
  service?: Service;
}

export interface Invoice {
  id?: string;
  patient_id: string;
  patient_name: string;
  invoice_date: string;
  due_date: string | null;
  items: { description: string; amount: number }[];
  total_amount: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled' | string;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export type AppointmentFormData = {
  patient_id?: string;
  practitioner_id: string;
  service_id: string;
  date: Date;
  start_time: string;
  end_time?: string;
  notes?: string;
};

export type PatientFormData = {
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: Date;
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
  preferred_practitioner_id?: string;
  notes?: string;
};

export type PractitionerFormData = {
  name: string;
  specialization?: string;
  bio?: string;
  availability?: {
    [day: string]: {
      start: string;
      end: string;
      isAvailable: boolean;
    }
  };
};

export type ServiceFormData = {
  name: string;
  description?: string;
  duration: number;
  price?: number;
};
