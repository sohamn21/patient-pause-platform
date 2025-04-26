
import { supabase } from '@/integrations/supabase/client';
import { Patient, PatientFormData, Practitioner, Service, AppointmentFormData, Appointment, ServiceFormData, PractitionerFormData, Invoice } from '@/types/clinic';

// Get all patients for a business
export const getPatients = async (businessId: string = '') => {
  try {
    console.log('Fetching patients for business:', businessId);
    
    // First get all patients regardless of business ID
    // We'll filter on the front-end if needed
    const { data, error } = await supabase
      .from('patients')
      .select(`
        id,
        created_at,
        updated_at,
        medical_history,
        allergies,
        emergency_contact,
        preferred_practitioner_id,
        date_of_birth,
        notes
      `);
    
    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
    
    // Get profiles for all patients
    if (data && data.length > 0) {
      const patientIds = data.map(patient => patient.id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone_number');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Combine patient data with profile data
      const patientsWithProfiles = data.map(patient => {
        const profile = profilesData?.find(p => p.id === patient.id);
        return {
          ...patient,
          profile: profile || null
        };
      });
      
      console.log('Patients fetched:', patientsWithProfiles);
      return patientsWithProfiles;
    }
    
    console.log('No patients found');
    return [];
  } catch (error) {
    console.error('Failed to get patients:', error);
    throw error;
  }
};

// Get a specific patient
export const getPatient = async (patientId: string) => {
  try {
    console.log('Fetching patient details for ID:', patientId);
    
    const { data, error } = await supabase
      .from('patients')
      .select(`
        id,
        created_at,
        updated_at,
        medical_history,
        allergies,
        emergency_contact, 
        preferred_practitioner_id,
        date_of_birth,
        notes,
        profile:id (
          id,
          first_name,
          last_name,
          phone_number
        )
      `)
      .eq('id', patientId)
      .single();
    
    if (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
    
    console.log('Patient fetched:', data);
    return data;
  } catch (error) {
    console.error('Failed to get patient details:', error);
    throw error;
  }
};

// Create a new patient profile
export const createPatientProfile = async (userId: string, formData: PatientFormData) => {
  console.log('Creating patient profile for user ID:', userId, 'with data:', formData);
  
  try {
    // First, check if a profile entry already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId);

    // Convert date to string format for database storage
    const dateOfBirth = formData.date_of_birth 
      ? formData.date_of_birth.toISOString().split('T')[0] 
      : null;
    
    // Insert the patient record first
    const { error: patientError } = await supabase
      .from('patients')
      .insert({
        id: userId, // Use the userId directly as the patient ID
        date_of_birth: dateOfBirth,
        medical_history: formData.medical_history || null,
        allergies: formData.allergies || null,
        emergency_contact: formData.emergency_contact || null,
        preferred_practitioner_id: formData.preferred_practitioner_id || null,
        notes: formData.notes || null,
      });
    
    if (patientError) {
      console.error('Error creating patient:', patientError);
      throw patientError;
    }
    
    // Now update the profile information
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number || null,
      });
    
    if (profileError) {
      console.error('Error updating profile:', profileError);
      throw profileError;
    }
    
    console.log('Patient profile created successfully with ID:', userId);
    return true;
  } catch (error) {
    console.error('Failed to create patient profile:', error);
    return false;
  }
};

// Update an existing patient
export const updatePatient = async (patientId: string, formData: PatientFormData) => {
  console.log('Updating patient with ID:', patientId, 'with data:', formData);
  
  try {
    // Update profile information first
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
      })
      .eq('id', patientId);
    
    if (profileError) {
      console.error('Error updating profile:', profileError);
      throw profileError;
    }
    
    // Convert date to string format for database storage
    const dateOfBirth = formData.date_of_birth 
      ? formData.date_of_birth.toISOString().split('T')[0] 
      : null;
    
    // Update patient-specific information
    const { error } = await supabase
      .from('patients')
      .update({
        date_of_birth: dateOfBirth,
        medical_history: formData.medical_history,
        allergies: formData.allergies,
        emergency_contact: formData.emergency_contact,
        preferred_practitioner_id: formData.preferred_practitioner_id,
        notes: formData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', patientId);
    
    if (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
    
    console.log('Patient updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update patient:', error);
    return false;
  }
};

// Get all practitioners for a business
export const getPractitioners = async (businessId: string) => {
  try {
    console.log('Fetching practitioners for business:', businessId);
    
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('business_id', businessId);
    
    if (error) {
      console.error('Error fetching practitioners:', error);
      throw error;
    }
    
    console.log('Practitioners fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to get practitioners:', error);
    return [];
  }
};

// Check if a patient record exists
export const checkPatientExists = async (userId: string) => {
  try {
    console.log('Checking if patient exists for user ID:', userId);
    
    // Fixed approach: Use count instead of single to avoid content negotiation issues
    const { count, error } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('id', userId);
    
    if (error) {
      console.error('Error checking patient existence:', error);
      throw error;
    }
    
    const exists = count ? count > 0 : false;
    console.log('Patient exists:', exists);
    return exists;
  } catch (error) {
    console.error('Failed to check patient existence:', error);
    return false;
  }
};

// Get all services for a business
export const getServices = async (businessId: string) => {
  try {
    console.log('Fetching services for business:', businessId);
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    console.log('Services fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to get services:', error);
    return [];
  }
};

// Get a specific service
export const getService = async (id: string) => {
  try {
    console.log('Fetching service details for ID:', id);
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
    
    console.log('Service fetched:', data);
    return data;
  } catch (error) {
    console.error('Failed to get service details:', error);
    throw error;
  }
};

// Create a new service
export const createService = async (formData: ServiceFormData, businessId: string) => {
  try {
    console.log('Creating service with data:', formData);
    
    const { data, error } = await supabase
      .from('services')
      .insert({
        business_id: businessId,
        name: formData.name,
        description: formData.description || null,
        duration: formData.duration,
        price: formData.price || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    
    console.log('Service created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create service:', error);
    throw error;
  }
};

// Update an existing service
export const updateService = async (id: string, formData: ServiceFormData) => {
  try {
    console.log('Updating service with ID:', id, 'and data:', formData);
    
    const { data, error } = await supabase
      .from('services')
      .update({
        name: formData.name,
        description: formData.description || null,
        duration: formData.duration,
        price: formData.price || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }
    
    console.log('Service updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update service:', error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (id: string) => {
  try {
    console.log('Deleting service with ID:', id);
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
    
    console.log('Service deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete service:', error);
    return false;
  }
};

// Create a new practitioner
export const createPractitioner = async (formData: PractitionerFormData, businessId: string) => {
  try {
    console.log('Creating practitioner with data:', formData);
    
    const { data, error } = await supabase
      .from('practitioners')
      .insert({
        business_id: businessId,
        name: formData.name,
        specialization: formData.specialization || null,
        bio: formData.bio || null,
        availability: formData.availability || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating practitioner:', error);
      throw error;
    }
    
    console.log('Practitioner created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create practitioner:', error);
    throw error;
  }
};

// Update an existing practitioner
export const updatePractitioner = async (id: string, formData: PractitionerFormData) => {
  try {
    console.log('Updating practitioner with ID:', id, 'and data:', formData);
    
    const { data, error } = await supabase
      .from('practitioners')
      .update({
        name: formData.name,
        specialization: formData.specialization || null,
        bio: formData.bio || null,
        availability: formData.availability || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating practitioner:', error);
      throw error;
    }
    
    console.log('Practitioner updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update practitioner:', error);
    throw error;
  }
};

// Delete a practitioner
export const deletePractitioner = async (id: string) => {
  try {
    console.log('Deleting practitioner with ID:', id);
    
    const { error } = await supabase
      .from('practitioners')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting practitioner:', error);
      throw error;
    }
    
    console.log('Practitioner deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete practitioner:', error);
    return false;
  }
};

// Get all appointments for a business
export const getAppointments = async (userId: string) => {
  try {
    console.log('Fetching appointments for user ID:', userId);
    
    // Check if the user has any appointments as a patient first
    const { data: patientAppointments, error: patientError } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (
          *,
          profile:id (
            first_name,
            last_name,
            phone_number
          )
        ),
        practitioner:practitioner_id (*),
        service:service_id (*)
      `)
      .eq('patient_id', userId);
    
    if (patientError) {
      console.error('Error fetching patient appointments:', patientError);
      throw patientError;
    }
    
    // If we found appointments as a patient, return those
    if (patientAppointments && patientAppointments.length > 0) {
      console.log('Found appointments as a patient:', patientAppointments);
      return patientAppointments;
    }
    
    // If no appointments found as patient, try as a business owner
    const { data: businessAppointments, error: businessError } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (
          *,
          profile:id (
            first_name,
            last_name,
            phone_number
          )
        ),
        practitioner:practitioner_id (*),
        service:service_id (*)
      `)
      .eq('business_id', userId);
    
    if (businessError) {
      console.error('Error fetching business appointments:', businessError);
      throw businessError;
    }
    
    console.log('Appointments fetched:', businessAppointments || []);
    return businessAppointments || [];
  } catch (error) {
    console.error('Failed to get appointments:', error);
    throw error;
  }
};

// Get all appointments for a specific patient
export const getPatientAppointments = async (patientId: string) => {
  try {
    console.log('Fetching patient appointments for ID:', patientId);
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        practitioner:practitioner_id (*),
        service:service_id (*)
      `)
      .eq('patient_id', patientId);
    
    if (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
    
    console.log('Patient appointments fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to get patient appointments:', error);
    throw error;
  }
};

// Get a specific appointment
export const getAppointment = async (id: string) => {
  try {
    console.log('Fetching appointment details for ID:', id);
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (
          *,
          profile:id (
            first_name,
            last_name,
            phone_number
          )
        ),
        practitioner:practitioner_id (*),
        service:service_id (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
    
    console.log('Appointment fetched:', data);
    return data;
  } catch (error) {
    console.error('Failed to get appointment details:', error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (formData: AppointmentFormData, businessId: string) => {
  try {
    console.log('Creating appointment with data:', formData);
    
    const service = await getService(formData.service_id);
    if (!service) {
      throw new Error('Service not found');
    }
    
    const [hours, minutes] = formData.start_time.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + service.duration);
    
    const end_time = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
    
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        business_id: businessId,
        patient_id: formData.patient_id,
        practitioner_id: formData.practitioner_id,
        service_id: formData.service_id,
        date: formData.date.toISOString().split('T')[0],
        start_time: formData.start_time,
        end_time: formData.end_time || end_time,
        notes: formData.notes || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
    
    console.log('Appointment created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create appointment:', error);
    throw error;
  }
};

// Update an existing appointment
export const updateAppointment = async (id: string, formData: AppointmentFormData) => {
  try {
    let end_time = formData.end_time;
    if (!end_time) {
      const service = await getService(formData.service_id);
      if (service) {
        const [hours, minutes] = formData.start_time.split(':');
        const startDate = new Date();
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + service.duration);
        
        end_time = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      }
    }
    
    console.log('Updating appointment with ID:', id, 'and data:', formData);
    
    const { data, error } = await supabase
      .from('appointments')
      .update({
        patient_id: formData.patient_id,
        practitioner_id: formData.practitioner_id,
        service_id: formData.service_id,
        date: formData.date.toISOString().split('T')[0],
        start_time: formData.start_time,
        end_time: end_time,
        notes: formData.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
    
    console.log('Appointment updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update appointment:', error);
    throw error;
  }
};

// Update the status of an appointment
export const updateAppointmentStatus = async (id: string, status: string) => {
  try {
    console.log('Updating appointment status for ID:', id, 'to:', status);
    
    const { error } = await supabase
      .from('appointments')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
    
    console.log('Appointment status updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    return false;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: string) => {
  try {
    console.log('Deleting appointment with ID:', id);
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
    
    console.log('Appointment deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    return false;
  }
};

// Generate an invoice for a patient
export const generatePatientInvoice = async (
  patientId: string, 
  items: { description: string; amount: number }[], 
  invoiceDate: Date,
  dueDate?: Date | null
): Promise<Invoice> => {
  try {
    console.log('Generating invoice for patient:', patientId);
    
    // Get patient details to include in the invoice
    const patient = await getPatient(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    const patientName = `${patient.profile?.first_name || ''} ${patient.profile?.last_name || ''}`.trim();
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    
    // Create invoice object
    const invoiceData: Invoice = {
      patient_id: patientId,
      patient_name: patientName,
      invoice_date: invoiceDate.toISOString().split('T')[0],
      due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
      items: items,
      total_amount: totalAmount,
      status: 'unpaid',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // In a real application, you would save this to a database
    // For now, we'll just return the invoice object
    console.log('Invoice generated:', invoiceData);
    
    // Simulating database insertion with a fake ID
    invoiceData.id = `inv_${Date.now()}`;
    
    return invoiceData;
  } catch (error) {
    console.error('Failed to generate invoice:', error);
    throw error;
  }
};
