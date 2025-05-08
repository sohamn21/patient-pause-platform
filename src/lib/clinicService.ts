import { supabase } from "@/integrations/supabase/client";
import { 
  Practitioner, 
  Service, 
  Appointment, 
  Patient,
  AppointmentFormData,
  PatientFormData,
  ServiceFormData,
  PractitionerFormData
} from "@/types/clinic";
import { v4 as uuidv4 } from 'uuid';
import { mapToPractitioner, mapToService } from "./dataMappers";

// Interface for Invoice
export interface Invoice {
  id?: string;
  patient_id: string;
  patient_name: string;
  invoice_date: string;
  due_date: string | null;
  items: { description: string; amount: number }[];
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Check if a patient profile exists for a specific user
 */
export const checkPatientExists = async (userId: string): Promise<boolean> => {
  try {
    console.log("Checking if patient exists for user ID:", userId);
    
    if (!userId) {
      console.error("No user ID provided to checkPatientExists");
      return false;
    }
    
    const { data, error } = await supabase
      .from('patients')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned (patient doesn't exist)
        console.log(`Patient with user ID ${userId} not found`);
        return false;
      }
      
      console.error("Error checking patient existence:", error);
      throw error;
    }
    
    console.log("Patient exists:", !!data);
    return !!data;
  } catch (error) {
    console.error(`Error in checkPatientExists for user ${userId}:`, error);
    return false;
  }
};

/**
 * Fetch a business by ID from the profiles table
 */
export const getBusinessById = async (businessId: string) => {
  try {
    console.log("Fetching business details for ID:", businessId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', businessId)
      .single();
    
    if (error) throw error;
    
    console.log("Business data retrieved:", data);
    console.log("Business type:", data?.business_type);
    
    return data;
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
};

/**
 * Get all practitioners for a specific business
 */
export const getPractitioners = async (businessId: string) => {
  try {
    console.log("Fetching practitioners for business:", businessId);
    
    if (!businessId) {
      console.error("No business ID provided to getPractitioners");
      return [];
    }
    
    // Log the query we're about to make for debugging
    console.log(`Executing query: SELECT * FROM practitioners WHERE business_id = '${businessId}'`);
    
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('business_id', businessId);
    
    if (error) {
      console.error("Error fetching practitioners:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} practitioners for business ID: ${businessId}`);
    console.log("Raw practitioners data:", data);
    
    // If no practitioners found, check if any exist at all (debugging)
    if (!data || data.length === 0) {
      console.log("No practitioners found for business ID:", businessId);
      console.log("Checking database directly for all practitioners to debug:");
      
      const { data: allPractitioners, error: allError } = await supabase
        .from('practitioners')
        .select('*')
        .limit(10);
      
      if (allError) {
        console.error("Error fetching all practitioners:", allError);
      } else if (allPractitioners?.length) {
        console.log("Found practitioners in database but none for this business ID:", allPractitioners);
      } else {
        console.log("No practitioners found in database at all. Consider seeding some data.");
      }
    }
    
    // Map the data to ensure correct format and handle any inconsistencies
    const mappedData = Array.isArray(data) 
      ? data.map(item => mapToPractitioner(item))
      : [];
      
    console.log("Returning mapped practitioners:", mappedData);
    return mappedData;
  } catch (error) {
    console.error(`Error in getPractitioners for business ${businessId}:`, error);
    return [];
  }
};

/**
 * Create a new practitioner
 */
export const createPractitioner = async (practitionerData: PractitionerFormData, businessId: string): Promise<Practitioner | null> => {
  try {
    console.log("Creating new practitioner with data:", practitionerData);
    
    // Convert availability object to string if it exists
    const availabilityString = practitionerData.availability 
      ? JSON.stringify(practitionerData.availability) 
      : null;
    
    const { data, error } = await supabase
      .from('practitioners')
      .insert({
        name: practitionerData.name,
        specialization: practitionerData.specialization || null,
        bio: practitionerData.bio || null,
        availability: availabilityString,
        business_id: businessId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating practitioner:", error);
      throw error;
    }
    
    console.log("Practitioner created successfully:", data);
    return mapToPractitioner(data);
  } catch (error) {
    console.error("Failed to create practitioner:", error);
    return null;
  }
};

/**
 * Update an existing practitioner
 */
export const updatePractitioner = async (id: string, practitionerData: Partial<PractitionerFormData>): Promise<Practitioner | null> => {
  try {
    console.log("Updating practitioner with ID:", id, "and data:", practitionerData);
    
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    
    if (practitionerData.name !== undefined) updateData.name = practitionerData.name;
    if (practitionerData.specialization !== undefined) updateData.specialization = practitionerData.specialization;
    if (practitionerData.bio !== undefined) updateData.bio = practitionerData.bio;
    
    // Convert availability object to string if it exists
    if (practitionerData.availability !== undefined) {
      updateData.availability = practitionerData.availability 
        ? JSON.stringify(practitionerData.availability) 
        : null;
    }
    
    const { data, error } = await supabase
      .from('practitioners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating practitioner:", error);
      throw error;
    }
    
    console.log("Practitioner updated successfully:", data);
    return mapToPractitioner(data);
  } catch (error) {
    console.error("Failed to update practitioner:", error);
    return null;
  }
};

/**
 * Delete a practitioner
 */
export const deletePractitioner = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting practitioner with ID:", id);
    
    const { error } = await supabase
      .from('practitioners')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting practitioner:", error);
      throw error;
    }
    
    console.log("Practitioner deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete practitioner:", error);
    return false;
  }
};

/**
 * Get all services for a specific business
 */
export const getServices = async (businessId: string) => {
  try {
    console.log("Fetching services for business:", businessId);
    
    if (!businessId) {
      console.error("No business ID provided to getServices");
      return [];
    }
    
    // Log the query we're about to make for debugging
    console.log(`Executing query: SELECT * FROM services WHERE business_id = '${businessId}'`);
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);
    
    if (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} services for business ID: ${businessId}`);
    console.log("Raw services data:", data);
    
    // If no services found, check if any exist at all (debugging)
    if (!data || data.length === 0) {
      console.log("No services found for business ID:", businessId);
      console.log("Checking database directly for all services to debug:");
      
      const { data: allServices, error: allError } = await supabase
        .from('services')
        .select('*')
        .limit(10);
      
      if (allError) {
        console.error("Error fetching all services:", allError);
      } else if (allServices?.length) {
        console.log("Found services in database but none for this business ID:", allServices);
      } else {
        console.log("No services found in database at all. Consider seeding some data.");
      }
    }
    
    // Map the data to ensure correct format and handle any inconsistencies
    const mappedData = Array.isArray(data) 
      ? data.map(item => mapToService(item))
      : [];
      
    console.log("Returning mapped services:", mappedData);
    return mappedData;
  } catch (error) {
    console.error(`Error in getServices for business ${businessId}:`, error);
    return [];
  }
};

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

// Get all appointments for a user (either as patient or business owner)
export const getAppointments = async (userId: string) => {
  try {
    console.log('Fetching appointments for user ID:', userId);
    
    if (!userId) {
      console.error('No user ID provided');
      return [];
    }
    
    // First, check if the user has any appointments as a patient
    const { data: patientAppointments, error: patientError } = await supabase
      .from('appointments')
      .select(`
        id,
        business_id,
        patient_id,
        practitioner_id,
        service_id,
        date,
        start_time,
        end_time,
        status,
        notes,
        created_at,
        updated_at,
        patient:patient_id (
          id,
          medical_history
        ),
        practitioner:practitioner_id (
          id,
          name
        ),
        service:service_id (
          id,
          name,
          price
        )
      `)
      .eq('patient_id', userId);
    
    if (patientError) {
      console.error('Error fetching patient appointments:', patientError);
      throw patientError;
    }
    
    console.log('Patient appointments found:', patientAppointments?.length || 0);
    
    // Next, check if the user has any appointments as a business owner
    const { data: businessAppointments, error: businessError } = await supabase
      .from('appointments')
      .select(`
        id,
        business_id,
        patient_id,
        practitioner_id,
        service_id,
        date,
        start_time,
        end_time,
        status,
        notes,
        created_at,
        updated_at,
        patient:patient_id (
          id,
          medical_history
        ),
        practitioner:practitioner_id (
          id,
          name
        ),
        service:service_id (
          id,
          name,
          price
        )
      `)
      .eq('business_id', userId);
    
    if (businessError) {
      console.error('Error fetching business appointments:', businessError);
      throw businessError;
    }
    
    console.log('Business appointments found:', businessAppointments?.length || 0);
    
    // Combine both sets of appointments
    const allAppointments = [
      ...(patientAppointments || []),
      ...(businessAppointments || [])
    ];
    
    console.log('Total appointments found:', allAppointments.length);
    return allAppointments;
  } catch (error) {
    console.error('Failed to get appointments:', error);
    throw error;
  }
};

// Get all appointments for a specific patient
export const getPatientAppointments = async (patientId: string) => {
  try {
    console.log('Fetching patient appointments for ID:', patientId);
    
    if (!patientId) {
      console.error('No patient ID provided');
      return [];
    }
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        business_id,
        patient_id,
        practitioner_id,
        service_id,
        date,
        start_time,
        end_time,
        status,
        notes,
        created_at,
        updated_at,
        practitioner:practitioner_id (
          id,
          name
        ),
        service:service_id (
          id,
          name,
          price
        )
      `)
      .eq('patient_id', patientId);
    
    if (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
    
    console.log('Patient appointments fetched:', data?.length || 0);
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
export const createAppointment = async (
  appointmentData: AppointmentFormData, 
  businessId: string
) => {
  try {
    console.log("Creating appointment with data:", appointmentData);
    console.log("For business ID:", businessId);
    
    if (!businessId) {
      console.error("No business ID provided to createAppointment");
      return null;
    }
    
    // Calculate end time based on service duration
    let endTime: string | undefined = appointmentData.end_time;
    
    if (!endTime && appointmentData.service_id) {
      try {
        // Get service to find duration
        const { data: serviceData } = await supabase
          .from('services')
          .select('*')
          .eq('id', appointmentData.service_id)
          .single();
          
        if (serviceData) {
          const service = mapToService(serviceData);
          const [hours, minutes] = appointmentData.start_time.split(':').map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0);
          
          // Add duration in minutes
          const endDate = new Date(startDate.getTime() + (service.duration * 60 * 1000));
          endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
          console.log(`Calculated end time: ${endTime} based on service duration: ${service.duration} min`);
        }
      } catch (err) {
        console.error("Error calculating end time:", err);
      }
    }
    
    // For guest bookings (non-authenticated users)
    let patientId = appointmentData.patient_id;
    
    if (!patientId && appointmentData.guest_email) {
      console.log("Guest booking detected, creating temporary patient record");
      
      // Create a guest patient record
      const guestPatientId = uuidv4();
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          id: guestPatientId,
          profile: {
            first_name: appointmentData.guest_name?.split(' ')[0] || 'Guest',
            last_name: appointmentData.guest_name?.split(' ').slice(1).join(' ') || 'User',
            phone_number: appointmentData.guest_phone || null,
            email: appointmentData.guest_email
          }
        });
      
      if (patientError) {
        console.error("Error creating guest patient:", patientError);
        throw patientError;
      }
      
      patientId = guestPatientId;
      console.log("Created guest patient with ID:", patientId);
    }
    
    if (!patientId) {
      console.error("No patient ID available for booking");
      throw new Error("Patient ID is required");
    }
    
    // Insert the appointment
    const appointmentId = uuidv4();
    const appointment = {
      id: appointmentId,
      business_id: businessId,
      patient_id: patientId,
      practitioner_id: appointmentData.practitioner_id,
      service_id: appointmentData.service_id,
      date: appointmentData.date instanceof Date ? appointmentData.date.toISOString().split('T')[0] : appointmentData.date,
      start_time: appointmentData.start_time,
      end_time: endTime || appointmentData.start_time, // Fallback to start time if end time couldn't be calculated
      status: 'scheduled',
      notes: appointmentData.notes || null,
    };
    
    console.log("Inserting appointment:", appointment);
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
    
    console.log("Appointment created successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to create appointment:", error);
    throw error;
  }
};

// Update an existing appointment
export const updateAppointment = async (id: string, formData: AppointmentFormData) => {
  try {
    let end_time = formData.end_time;
    
    // If the business_id is not provided in the formData but a serviceId is,
    // we need to fetch the service to get the business_id
    const businessId = formData.business_id; 
    
    if (!end_time && formData.service_id) {
      // If we have a businessId and serviceId, we can calculate the end time
      if (businessId) {
        const service = await getServiceById(businessId, formData.service_id);
        if (service) {
          const [hours, minutes] = formData.start_time.split(':').map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0);
          const endDate = new Date(startDate.getTime() + service.duration * 60000);
          end_time = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
        }
      } else {
        console.warn('Cannot calculate end time: business_id is missing');
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

// Helper function to fetch a service by ID
export const getServiceById = async (businessId: string, serviceId: string) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .eq('id', serviceId);
    
    if (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Failed to get service:', error);
    throw error;
  }
};

/**
 * Create a new service
 */
export const createService = async (serviceData: ServiceFormData, businessId: string): Promise<Service | null> => {
  try {
    console.log("Creating new service with data:", serviceData);
    
    if (!businessId) {
      console.error("No business ID provided to createService");
      return null;
    }
    
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: serviceData.name,
        description: serviceData.description || null,
        duration: serviceData.duration || 30,
        price: serviceData.price || null,
        business_id: businessId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating service:", error);
      throw error;
    }
    
    console.log("Service created successfully:", data);
    return mapToService(data);
  } catch (error) {
    console.error("Failed to create service:", error);
    return null;
  }
};

/**
 * Update an existing service
 */
export const updateService = async (id: string, serviceData: Partial<ServiceFormData>): Promise<Service | null> => {
  try {
    console.log("Updating service with ID:", id, "and data:", serviceData);
    
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    
    if (serviceData.name !== undefined) updateData.name = serviceData.name;
    if (serviceData.description !== undefined) updateData.description = serviceData.description;
    if (serviceData.duration !== undefined) updateData.duration = serviceData.duration;
    if (serviceData.price !== undefined) updateData.price = serviceData.price;
    
    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating service:", error);
      throw error;
    }
    
    console.log("Service updated successfully:", data);
    return mapToService(data);
  } catch (error) {
    console.error("Failed to update service:", error);
    return null;
  }
};

/**
 * Delete a service
 */
export const deleteService = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting service with ID:", id);
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
    
    console.log("Service deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete service:", error);
    return false;
  }
};
