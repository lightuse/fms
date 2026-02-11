export class Unit {
  unit_id!: string; // UUID
  tenant_id!: string;
  name!: string;
  capabilities: string[] = [];
  status!: 'Available' | 'Assigned' | 'InTransit' | 'Unavailable';
  last_known_lat?: number;
  last_known_lon?: number;
  updated_at?: string;
}

export default Unit;
