
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReservationData } from '@/components/restaurant/TableReservation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Reservation extends ReservationData {
  id: string;
  createdAt: string;
  businessId: string;
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReservations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // This would ideally fetch from an actual table in Supabase
      // For now we'll just use local state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reservations',
        variant: 'destructive',
      });
      setLoading(false);
    }
  }, [user, toast]);

  const createReservation = useCallback(async (data: ReservationData) => {
    if (!user) return null;

    try {
      // In a production app, would save to Supabase here
      const newReservation: Reservation = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        businessId: user.id,
      };

      setReservations((prev) => [...prev, newReservation]);
      return newReservation;
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reservation',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  const updateTableStatus = useCallback((tableId: string, status: 'available' | 'occupied' | 'reserved') => {
    // This would update the table status in a real app
    // For now, we'll just show a toast notification
    toast({
      title: 'Table Status Updated',
      description: `Table status changed to: ${status}`,
    });
  }, [toast]);

  return {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateTableStatus,
  };
}
