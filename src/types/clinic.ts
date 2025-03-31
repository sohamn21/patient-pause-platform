
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
  } | null | any; // Add 'any' to handle JSON from database
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
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    email?: string;
  };
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
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show' | string; // Add general string to handle database values
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  patient?: Patient;
  practitioner?: Practitioner;
  service?: Service;
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
