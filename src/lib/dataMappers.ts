
import { Practitioner, Service } from "@/types/clinic";

/**
 * Maps raw practitioner data from API to Practitioner type
 */
export const mapToPractitioner = (data: any): Practitioner => {
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
  
  console.log("Mapping practitioner data:", data);
  
  return {
    id: data.id || '',
    business_id: data.business_id || '',
    name: data.name || '',
    specialization: data.specialization || null,
    bio: data.bio || null,
    availability: data.availability || null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
};

/**
 * Maps raw service data from API to Service type
 */
export const mapToService = (data: any): Service => {
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
  
  console.log("Mapping service data:", data);
  
  return {
    id: data.id || '',
    business_id: data.business_id || '',
    name: data.name || '',
    description: data.description || null,
    duration: typeof data.duration === 'number' ? data.duration : 30,
    price: typeof data.price === 'number' ? data.price : null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
};
