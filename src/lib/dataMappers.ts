
import { Practitioner, Service } from "@/types/clinic";

/**
 * Maps raw practitioner data from API to Practitioner type
 */
export const mapToPractitioner = (data: any): Practitioner => {
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
