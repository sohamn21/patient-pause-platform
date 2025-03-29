
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
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('business_id', user.id);
      
      if (error) throw error;
      setReservations(data || []);
      
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
      const { data: newReservation, error } = await supabase
        .from('reservations')
        .insert({
          ...data,
          business_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;

      setReservations((prev) => [...prev, newReservation]);
      
      // Update table status
      updateTableStatus(data.tableId, 'reserved');
      
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
    console.log(`Updating table ${tableId} status to ${status}`);
    
    toast({
      title: 'Table Status Updated',
      description: `Table status changed to: ${status}`,
    });
    
    // Remove any reservations for this table if status is 'available'
    if (status === 'available') {
      setReservations(prev => prev.filter(res => res.tableId !== tableId));
    }
  }, [toast]);

  const cancelReservation = useCallback(async (reservationId: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);
      
      if (error) throw error;
      
      // Find the reservation to get the tableId
      const reservation = reservations.find(r => r.id === reservationId);
      
      // Remove from local state
      setReservations(prev => prev.filter(r => r.id !== reservationId));
      
      // Update table status if reservation exists
      if (reservation) {
        updateTableStatus(reservation.tableId, 'available');
      }
      
      toast({
        title: 'Reservation Cancelled',
        description: 'The reservation has been cancelled successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel reservation',
        variant: 'destructive',
      });
      return false;
    }
  }, [reservations, toast, updateTableStatus]);

  return {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateTableStatus,
    cancelReservation,
  };
}
