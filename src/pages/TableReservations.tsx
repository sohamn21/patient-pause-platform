
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReservationsList } from "@/components/restaurant/ReservationsList";
import { useReservations } from "@/hooks/use-reservations";
import { ReservationData } from "@/components/restaurant/TableReservation";
import { FloorItem } from "@/components/restaurant/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface TableDbRow {
  id: string;
  business_id: string;
  number: number;
  capacity: number;
  status: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: string;
  rotation: number;
}

const TableReservationsPage = () => {
  const { user } = useAuth();
  const { createReservation, updateTableStatus } = useReservations();
  const [tables, setTables] = useState<FloorItem[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('tables')
          .select('*')
          .eq('business_id', user.id);
        
        if (error) throw error;
        
        // Convert database format to FloorItem format
        const floorItems: FloorItem[] = (data as TableDbRow[]).map(table => ({
          id: table.id,
          type: 'table',
          x: table.x,
          y: table.y,
          width: table.width,
          height: table.height,
          rotation: table.rotation,
          capacity: table.capacity,
          number: table.number,
          shape: table.shape as 'rectangle' | 'circle',
          status: table.status as 'available' | 'occupied' | 'reserved'
        }));
        
        setTables(floorItems);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, [user]);

  const handleReserveTable = async (tableId: string, data: ReservationData) => {
    const reservation = await createReservation(data);
    if (reservation) {
      // Update the table status
      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? { ...table, status: "reserved", reservationId: reservation.id }
            : table
        )
      );
      // Update status in the hook
      updateTableStatus(tableId, "reserved");
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Table Reservations</h1>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Reservations</TabsTrigger>
          <TabsTrigger value="tables">Table Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <ReservationsList />
        </TabsContent>
        
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <div 
                    key={table.id} 
                    className={`
                      border rounded-md p-4 relative
                      ${table.status === 'available' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 
                        table.status === 'reserved' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 
                        'border-red-500 bg-red-50 dark:bg-red-900/10'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Table {table.number}</h3>
                        <p className="text-sm text-muted-foreground">Capacity: {table.capacity}</p>
                        <div className="mt-2">
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full 
                            ${table.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                              table.status === 'reserved' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}
                          `}>
                            {table.status?.charAt(0).toUpperCase() + table.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      {table.status === 'available' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setTables((prev) =>
                              prev.map((t) =>
                                t.id === table.id ? { ...t, status: 'reserved' } : t
                              )
                            );
                            updateTableStatus(table.id, 'reserved');
                          }}
                        >
                          Create Reservation
                        </Button>
                      ) : table.status === 'reserved' ? (
                        <div className="space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setTables((prev) =>
                                prev.map((t) =>
                                  t.id === table.id ? { ...t, status: 'occupied' } : t
                                )
                              );
                              updateTableStatus(table.id, 'occupied');
                            }}
                          >
                            Seat Guests
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setTables((prev) =>
                                prev.map((t) =>
                                  t.id === table.id ? { ...t, status: 'available', reservationId: undefined } : t
                                )
                              );
                              updateTableStatus(table.id, 'available');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setTables((prev) =>
                              prev.map((t) =>
                                t.id === table.id ? { ...t, status: 'available', reservationId: undefined } : t
                              )
                            );
                            updateTableStatus(table.id, 'available');
                          }}
                        >
                          Clear Table
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableReservationsPage;
