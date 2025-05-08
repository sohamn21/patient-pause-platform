export interface Practitioner {
  id: string;
  business_id: string;
  name: string;
  specialization: string | null;
  bio: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
  created_at: string;
  updated_at: string;
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
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  practitioner?: Practitioner;
  service?: Service;
}

export interface Patient {
  id: string;
  created_at: string;
  updated_at: string;
  medical_history: string | null;
  allergies: string | null;
  emergency_contact: string | null;
  preferred_practitioner_id: string | null;
  date_of_birth: string | null;
  notes: string | null;
  profile?: Profile;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
}

export interface AppointmentFormData {
  business_id?: string;
  patient_id?: string;
  practitioner_id: string;
  service_id: string;
  date: Date;
  start_time: string;
  end_time?: string;
  notes?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
}

export interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: Date | null;
  phone_number?: string | null;
  medical_history?: string | null;
  allergies?: string | null;
  emergency_contact?: string | null;
  preferred_practitioner_id?: string | null;
  notes?: string | null;
}
