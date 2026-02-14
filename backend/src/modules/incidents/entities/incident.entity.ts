export class Incident {
  incident_id!: string; // UUID
  tenant_id!: string;
  type!: string;
  priority!: string;
  status!: 'Created' | 'Dispatched' | 'EnRoute' | 'OnScene' | 'Contained' | 'Closed';
  latitude?: number;
  longitude?: number;
  created_at!: string;
  updated_at?: string;
  assigned_units: string[] = [];
}

export default Incident;
