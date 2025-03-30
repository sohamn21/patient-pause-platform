
import { supabase } from "@/integrations/supabase/client";
import { 
  Patient, 
  PatientFormData, 
  Practitioner, 
  PractitionerFormData, 
  Service, 
  ServiceFormData, 
  Appointment, 
  AppointmentFormData 
} from "@/types/clinic";
import { toast } from "@/hooks/use-toast";

// Practitioners
export async function getPractitioners(businessId: string): Promise<Practitioner[]> {
  try {
    const { data, error } = await supabase
      .from("practitioners")
      .select("*")
      .eq("business_id", businessId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting practitioners:", error);
    toast({
      title: "Error",
      description: "Failed to load practitioners",
      variant: "destructive",
    });
    return [];
  }
}

export async function getPractitioner(id: string): Promise<Practitioner | null> {
  try {
    const { data, error } = await supabase
      .from("practitioners")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting practitioner:", error);
    toast({
      title: "Error",
      description: "Failed to load practitioner details",
      variant: "destructive",
    });
    return null;
  }
}

export async function createPractitioner(formData: PractitionerFormData, businessId: string): Promise<Practitioner | null> {
  try {
    const { data, error } = await supabase
      .from("practitioners")
      .insert({
        business_id: businessId,
        name: formData.name,
        specialization: formData.specialization || null,
        bio: formData.bio || null,
        availability: formData.availability || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating practitioner:", error);
    toast({
      title: "Error",
      description: "Failed to create practitioner",
      variant: "destructive",
    });
    return null;
  }
}

export async function updatePractitioner(id: string, formData: PractitionerFormData): Promise<Practitioner | null> {
  try {
    const { data, error } = await supabase
      .from("practitioners")
      .update({
        name: formData.name,
        specialization: formData.specialization || null,
        bio: formData.bio || null,
        availability: formData.availability || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating practitioner:", error);
    toast({
      title: "Error",
      description: "Failed to update practitioner",
      variant: "destructive",
    });
    return null;
  }
}

export async function deletePractitioner(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("practitioners")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting practitioner:", error);
    toast({
      title: "Error",
      description: "Failed to delete practitioner",
      variant: "destructive",
    });
    return false;
  }
}

// Services
export async function getServices(businessId: string): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting services:", error);
    toast({
      title: "Error",
      description: "Failed to load services",
      variant: "destructive",
    });
    return [];
  }
}

export async function getService(id: string): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting service:", error);
    toast({
      title: "Error",
      description: "Failed to load service details",
      variant: "destructive",
    });
    return null;
  }
}

export async function createService(formData: ServiceFormData, businessId: string): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from("services")
      .insert({
        business_id: businessId,
        name: formData.name,
        description: formData.description || null,
        duration: formData.duration,
        price: formData.price || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating service:", error);
    toast({
      title: "Error",
      description: "Failed to create service",
      variant: "destructive",
    });
    return null;
  }
}

export async function updateService(id: string, formData: ServiceFormData): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from("services")
      .update({
        name: formData.name,
        description: formData.description || null,
        duration: formData.duration,
        price: formData.price || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating service:", error);
    toast({
      title: "Error",
      description: "Failed to update service",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    toast({
      title: "Error",
      description: "Failed to delete service",
      variant: "destructive",
    });
    return false;
  }
}

// Patients
export async function getPatients(): Promise<Patient[]> {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select(`
        *,
        profile:id (
          first_name,
          last_name,
          phone_number
        )
      `);

    if (error) throw error;
    
    // Transform the data to match our expected Patient type
    const patients = data?.map(patient => ({
      ...patient,
      profile: patient.profile
    })) || [];
    
    return patients;
  } catch (error) {
    console.error("Error getting patients:", error);
    toast({
      title: "Error",
      description: "Failed to load patients",
      variant: "destructive",
    });
    return [];
  }
}

export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select(`
        *,
        profile:id (
          first_name,
          last_name,
          phone_number
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return {
      ...data,
      profile: data.profile
    };
  } catch (error) {
    console.error("Error getting patient:", error);
    toast({
      title: "Error",
      description: "Failed to load patient details",
      variant: "destructive",
    });
    return null;
  }
}

export async function createPatientProfile(userId: string, formData: PatientFormData): Promise<boolean> {
  try {
    // First update the user's profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number || null,
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    // Then create a patient record
    const { error: patientError } = await supabase
      .from("patients")
      .insert({
        id: userId,
        medical_history: formData.medical_history || null,
        allergies: formData.allergies || null,
        emergency_contact: formData.emergency_contact || null,
        preferred_practitioner_id: formData.preferred_practitioner_id || null,
        notes: formData.notes || null,
        date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString().split('T')[0] : null,
      });

    if (patientError) throw patientError;
    return true;
  } catch (error) {
    console.error("Error creating patient profile:", error);
    toast({
      title: "Error",
      description: "Failed to create patient profile",
      variant: "destructive",
    });
    return false;
  }
}

export async function updatePatient(id: string, formData: PatientFormData): Promise<boolean> {
  try {
    // Update the user's profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number || null,
      })
      .eq("id", id);

    if (profileError) throw profileError;

    // Update the patient record
    const { error: patientError } = await supabase
      .from("patients")
      .update({
        medical_history: formData.medical_history || null,
        allergies: formData.allergies || null,
        emergency_contact: formData.emergency_contact || null,
        preferred_practitioner_id: formData.preferred_practitioner_id || null,
        notes: formData.notes || null,
        date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString().split('T')[0] : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (patientError) throw patientError;
    return true;
  } catch (error) {
    console.error("Error updating patient:", error);
    toast({
      title: "Error",
      description: "Failed to update patient",
      variant: "destructive",
    });
    return false;
  }
}

// Appointments
export async function getAppointments(businessId: string): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase
      .from("appointments")
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
      .eq("business_id", businessId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting appointments:", error);
    toast({
      title: "Error",
      description: "Failed to load appointments",
      variant: "destructive",
    });
    return [];
  }
}

export async function getPatientAppointments(patientId: string): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        practitioner:practitioner_id (*),
        service:service_id (*)
      `)
      .eq("patient_id", patientId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting patient appointments:", error);
    toast({
      title: "Error",
      description: "Failed to load your appointments",
      variant: "destructive",
    });
    return [];
  }
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from("appointments")
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
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting appointment:", error);
    toast({
      title: "Error",
      description: "Failed to load appointment details",
      variant: "destructive",
    });
    return null;
  }
}

export async function createAppointment(formData: AppointmentFormData, businessId: string): Promise<Appointment | null> {
  try {
    // Get the service to calculate end time
    const service = await getService(formData.service_id);
    if (!service) {
      throw new Error("Service not found");
    }
    
    // Calculate end time based on service duration
    const [hours, minutes] = formData.start_time.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + service.duration);
    
    const end_time = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
    
    const { data, error } = await supabase
      .from("appointments")
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    toast({
      title: "Error",
      description: "Failed to create appointment",
      variant: "destructive",
    });
    return null;
  }
}

export async function updateAppointment(id: string, formData: AppointmentFormData): Promise<Appointment | null> {
  try {
    // Get the service to calculate end time if not provided
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
    
    const { data, error } = await supabase
      .from("appointments")
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
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast({
      title: "Error",
      description: "Failed to update appointment",
      variant: "destructive",
    });
    return null;
  }
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("appointments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    toast({
      title: "Error",
      description: "Failed to update appointment status",
      variant: "destructive",
    });
    return false;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    toast({
      title: "Error",
      description: "Failed to delete appointment",
      variant: "destructive",
    });
    return false;
  }
}

// Utility function to check if a patient record exists
export async function checkPatientExists(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking patient exists:", error);
    return false;
  }
}
