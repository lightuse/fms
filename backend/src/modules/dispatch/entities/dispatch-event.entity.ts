export class DispatchEvent {
  event_id!: string; // UUID
  incident_id!: string;
  actor_id!: string;
  action!: 'assign' | 'unassign' | 'status_update' | 'note';
  details?: Record<string, any>;
  timestamp!: string;
}

export default DispatchEvent;
