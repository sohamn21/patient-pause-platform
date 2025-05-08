
import { Practitioner, Service } from '@/types/clinic';

/**
 * Maps raw database practitioner data to the Practitioner type
 */
export const mapToPractitioner = (data: any): Practitioner => {
  return {
    id: data.id,
    business_id: data.business_id,
    name: data.name || '',
    specialization: data.specialization || null,
    bio: data.bio || null,
    availability: data.availability || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Maps raw database service data to the Service type
 */
export const mapToService = (data: any): Service => {
  return {
    id: data.id,
    business_id: data.business_id,
    name: data.name || '',
    description: data.description || null,
    duration: data.duration || 30,
    price: data.price || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};
