
export interface TableType {
  id: string;
  name: string;
  capacity: number;
  width: number;
  height: number;
  shape?: 'rectangle' | 'circle';
  color?: string;
}

export interface FloorItem {
  id: string;
  type: 'table' | 'wall' | 'door' | 'decoration';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  tableType?: string;
  capacity?: number;
  number?: number;
  shape?: 'rectangle' | 'circle';
  status?: 'available' | 'occupied' | 'reserved';
  color?: string;
  label?: string;
}

export interface FloorPlanSettings {
  gridSize: number;
  showNumbers: boolean;
  showCapacity: boolean;
  snapToGrid: boolean;
}
