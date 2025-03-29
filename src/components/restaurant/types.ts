
export interface TableType {
  id: string;
  name: string;
  capacity: number;
  width: number;
  height: number;
  shape?: 'rectangle' | 'circle';
}

export interface FloorItem {
  id: string;
  type: 'table' | 'wall' | 'door';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  tableType?: string;
  capacity?: number;
  number?: number;
  shape?: 'rectangle' | 'circle';
}
