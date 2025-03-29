
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReservationData } from '@/components/restaurant/TableReservation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Reservation {
  id: string;
  businessId: string;
  tableId: string;
  customerName: string;
  date: Date | string;
  time: string;
  partySize: number;
  notes?: string;
  createdAt: string;
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
      
      // Map database fields to our interface
      const formattedReservations: Reservation[] = (data || []).map(item => ({
        id: item.id,
        businessId: item.business_id,
        tableId: item.table_id,
        customerName: item.customer_name,
        date: new Date(item.date),
        time: item.time,
        partySize: item.party_size,
        notes: item.notes,
        createdAt: item.created_at
      }));
      
      setReservations(formattedReservations);
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
          business_id: user.id,
          table_id: data.tableId,
          customer_name: data.customerName,
          date: data.date,
          time: data.time,
          party_size: data.partySize,
          notes: data.notes
        })
        .select()
        .single();
      
      if (error) throw error;

      // Format the reservation data to match our interface
      const formattedReservation: Reservation = {
        id: newReservation.id,
        businessId: newReservation.business_id,
        tableId: newReservation.table_id,
        customerName: newReservation.customer_name,
        date: new Date(newReservation.date),
        time: newReservation.time,
        partySize: newReservation.party_size,
        notes: newReservation.notes,
        createdAt: newReservation.created_at
      };
      
      setReservations((prev) => [...prev, formattedReservation]);
      
      // Update table status
      updateTableStatus(data.tableId, 'reserved');
      
      return formattedReservation;
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
