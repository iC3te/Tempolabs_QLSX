// Database related types

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  rowCount: number;
  size: string;
}

export interface ColumnSchema {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey?: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface QueryResult {
  data: any[] | null;
  error: string | null;
  columns: string[];
  executionTime: number;
  affectedRows?: number;
}

export interface DatabaseStats {
  totalTables: number;
  totalSize: string;
  connections: number;
  uptime: string;
  lastBackup: string;
  version?: string;
}

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  description?: string;
  createdAt: string;
  lastRun?: string;
}
