
import { Practitioner, Service } from "@/types/clinic";

/**
 * Maps raw practitioner data from API to Practitioner type
 */
export const mapToPractitioner = (data: any): Practitioner => {
  // First, log the raw data for debugging
  console.log("Raw practitioner data to map:", data);
  
  // Check if the data is null or undefined before trying to access properties
  if (!data) {
    console.error("Received null or undefined practitioner data");
    return {
      id: '',
      business_id: '',
      name: 'Unknown Practitioner',
      specialization: null,
      bio: null,
      availability: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  
  try {
    // Create the mapped object
    const mappedPractitioner: Practitioner = {
      id: data.id || '',
      business_id: data.business_id || '',
      name: data.name || '',
      specialization: data.specialization || null,
      bio: data.bio || null,
      availability: data.availability || null,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };
    
    // Log the mapped result
    console.log("Mapped practitioner:", mappedPractitioner);
    
    return mappedPractitioner;
  } catch (error) {
    console.error("Error mapping practitioner data:", error);
    // Return default object on error
    return {
      id: data.id || '',
      business_id: data.business_id || '',
      name: 'Error Mapping Practitioner',
      specialization: null,
      bio: null,
      availability: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
};

/**
 * Maps raw service data from API to Service type
 */
export const mapToService = (data: any): Service => {
  // First, log the raw data for debugging
  console.log("Raw service data to map:", data);
  
  // Check if the data is null or undefined before trying to access properties
  if (!data) {
    console.error("Received null or undefined service data");
    return {
      id: '',
      business_id: '',
      name: 'Unknown Service',
      description: null,
      duration: 30,
      price: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  
  try {
    // Create the mapped object
    const mappedService: Service = {
      id: data.id || '',
      business_id: data.business_id || '',
      name: data.name || '',
      description: data.description || null,
      duration: typeof data.duration === 'number' ? data.duration : 30,
      price: typeof data.price === 'number' ? data.price : null,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };
    
    // Log the mapped result
    console.log("Mapped service:", mappedService);
    
    return mappedService;
  } catch (error) {
    console.error("Error mapping service data:", error);
    // Return default object on error
    return {
      id: data.id || '',
      business_id: data.business_id || '',
      name: 'Error Mapping Service',
      description: null,
      duration: 30,
      price: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
};
