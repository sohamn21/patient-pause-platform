
import { Practitioner, Service } from '@/types/clinic';

/**
 * Maps raw database practitioner data to the Practitioner type
 */
export const mapToPractitioner = (data: any): Practitioner => {
  // Handle cases where data might be null or undefined
  if (!data) {
    console.error("Attempted to map undefined or null practitioner data");
    return {
      id: '',
      business_id: '',
      name: '',
      specialization: null,
      bio: null,
      availability: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // Handle availability which might be stored as a JSON string
  let availability = null;
  if (data.availability) {
    if (typeof data.availability === 'string') {
      try {
        availability = JSON.parse(data.availability);
      } catch (e) {
        console.error("Error parsing practitioner availability:", e);
        availability = null;
      }
    } else {
      availability = data.availability;
    }
  }

  // Return the mapped practitioner object with all fields properly handled
  return {
    id: data.id || '',
    business_id: data.business_id || '',
    name: data.name || '',
    specialization: data.specialization || null,
    bio: data.bio || null,
    availability: availability,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
};

/**
 * Maps raw database service data to the Service type
 */
export const mapToService = (data: any): Service => {
  // Handle cases where data might be null or undefined
  if (!data) {
    console.error("Attempted to map undefined or null service data");
    return {
      id: '',
      business_id: '',
      name: '',
      description: null,
      duration: 30,
      price: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // Return the mapped service object with all fields properly handled
  return {
    id: data.id || '',
    business_id: data.business_id || '',
    name: data.name || '',
    description: data.description || null,
    duration: data.duration || 30,
    price: data.price !== undefined ? data.price : null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
};

/**
 * Performs debug validation on mapped data
 */
export const validateMappedData = (data: any, type: 'practitioner' | 'service'): boolean => {
  if (!data || typeof data !== 'object') {
    console.error(`Invalid ${type} data:`, data);
    return false;
  }
  
  if (!data.id || !data.business_id) {
    console.error(`${type} missing required fields:`, data);
    return false;
  }
  
  return true;
};

/**
 * Converts availability object to JSON string for storage
 */
export const stringifyAvailability = (availability: any): string | null => {
  if (!availability) return null;
  
  try {
    return typeof availability === 'string' 
      ? availability 
      : JSON.stringify(availability);
  } catch (e) {
    console.error("Error stringifying availability:", e);
    return null;
  }
};

/**
 * Parses availability string from database to object
 */
export const parseAvailability = (availability: any): Record<string, any> | null => {
  if (!availability) return null;
  
  if (typeof availability === 'string') {
    try {
      return JSON.parse(availability);
    } catch (e) {
      console.error("Error parsing availability:", e);
      return null;
    }
  }
  
  return availability;
};
