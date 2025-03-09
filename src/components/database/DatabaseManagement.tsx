import React, { useState, useEffect } from "react";
import DatabaseConnectionTest from "./DatabaseConnectionTest";
// Create a mock database client for demonstration purposes
const mockDatabase = {
  query: async () => ({ rows: [], rowCount: 0 }),
};
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Database,
  Table as TableIcon,
  Play,
  Save,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Clock,
  BarChart,
  Layers,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  rowCount: number;
  size: string;
}

interface ColumnSchema {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
}

interface QueryResult {
  data: any[] | null;
  error: string | null;
  columns: string[];
  executionTime: number;
  affectedRows?: number;
}

interface DatabaseStats {
  totalTables: number;
  totalSize: string;
  connections: number;
  uptime: string;
  lastBackup: string;
}

const DatabaseManagement = () => {
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    totalTables: 0,
    totalSize: "0 MB",
    connections: 0,
    uptime: "0 days",
    lastBackup: "Never",
  });
  const [savedQueries, setSavedQueries] = useState<
    { name: string; query: string }[]
  >([
    {
      name: "List all tables",
      query:
        "SELECT * FROM information_schema.tables WHERE table_schema = 'public';",
    },
    {
      name: "Database size",
      query: "SELECT pg_size_pretty(pg_database_size(current_database()));",
    },
    {
      name: "Active connections",
      query: "SELECT count(*) FROM pg_stat_activity;",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSchema, setFilterSchema] = useState<string>("public");

  useEffect(() => {
    fetchTables();
    fetchDatabaseStats();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would fetch this from PostgreSQL
      // This is a mock implementation for demonstration purposes
      const { rows } = await mockDatabase.query(
        "SELECT * FROM information_schema.tables WHERE table_schema = 'public'",
      );

      if (error) throw error;

      // If Supabase RPC is not set up, this would be the fallback mock data
      const mockTables: TableSchema[] = [
        {
          name: "products",
          columns: [
            {
              name: "id",
              dataType: "uuid",
              isNullable: false,
              isPrimaryKey: true,
            },
            {
              name: "name",
              dataType: "varchar",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "description",
              dataType: "text",
              isNullable: true,
              isPrimaryKey: false,
            },
            {
              name: "price",
              dataType: "numeric",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "created_at",
              dataType: "timestamp",
              isNullable: false,
              isPrimaryKey: false,
            },
          ],
          rowCount: 156,
          size: "1.2 MB",
        },
        {
          name: "orders",
          columns: [
            {
              name: "id",
              dataType: "uuid",
              isNullable: false,
              isPrimaryKey: true,
            },
            {
              name: "customer_id",
              dataType: "uuid",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "status",
              dataType: "varchar",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "total",
              dataType: "numeric",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "created_at",
              dataType: "timestamp",
              isNullable: false,
              isPrimaryKey: false,
            },
          ],
          rowCount: 243,
          size: "2.4 MB",
        },
        {
          name: "customers",
          columns: [
            {
              name: "id",
              dataType: "uuid",
              isNullable: false,
              isPrimaryKey: true,
            },
            {
              name: "name",
              dataType: "varchar",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "email",
              dataType: "varchar",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "phone",
              dataType: "varchar",
              isNullable: true,
              isPrimaryKey: false,
            },
            {
              name: "created_at",
              dataType: "timestamp",
              isNullable: false,
              isPrimaryKey: false,
            },
          ],
          rowCount: 89,
          size: "0.8 MB",
        },
        {
          name: "inventory",
          columns: [
            {
              name: "id",
              dataType: "uuid",
              isNullable: false,
              isPrimaryKey: true,
            },
            {
              name: "product_id",
              dataType: "uuid",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "quantity",
              dataType: "integer",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "location",
              dataType: "varchar",
              isNullable: true,
              isPrimaryKey: false,
            },
            {
              name: "updated_at",
              dataType: "timestamp",
              isNullable: false,
              isPrimaryKey: false,
            },
          ],
          rowCount: 312,
          size: "3.1 MB",
        },
        {
          name: "equipment",
          columns: [
            {
              name: "id",
              dataType: "uuid",
              isNullable: false,
              isPrimaryKey: true,
            },
            {
              name: "name",
              dataType: "varchar",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "type",
              dataType: "varchar",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "status",
              dataType: "varchar",
              isNullable: false,
              isPrimaryKey: false,
            },
            {
              name: "last_maintenance",
              dataType: "timestamp",
              isNullable: true,
              isPrimaryKey: false,
            },
          ],
          rowCount: 45,
          size: "0.5 MB",
        },
      ];

      setTables(data || mockTables);
      if (mockTables.length > 0 && !selectedTable) {
        setSelectedTable(mockTables[0].name);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch tables");
      console.error("Error fetching tables:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would fetch this from PostgreSQL
      // This is a mock implementation for demonstration purposes
      const { rows } = await mockDatabase.query(
        `SELECT * FROM ${tableName} LIMIT 100`,
      );

      if (error) throw error;

      // Mock data for demonstration
      let mockData: any[] = [];
      const selectedTableSchema = tables.find((t) => t.name === tableName);

      if (selectedTableSchema) {
        // Generate mock data based on the table schema
        for (let i = 0; i < 10; i++) {
          const row: any = {};
          selectedTableSchema.columns.forEach((col) => {
            if (col.name === "id") {
              row[col.name] = `${i + 1}`;
            } else if (col.dataType.includes("time")) {
              row[col.name] = new Date().toISOString();
            } else if (col.dataType === "numeric") {
              row[col.name] = (Math.random() * 1000).toFixed(2);
            } else if (col.dataType === "integer") {
              row[col.name] = Math.floor(Math.random() * 100);
            } else {
              row[col.name] = `${col.name}_value_${i + 1}`;
            }
          });
          mockData.push(row);
        }
      }

      const tableData = data || mockData;
      setTableData(tableData);

      if (tableData.length > 0) {
        setTableColumns(Object.keys(tableData[0]));
      } else {
        setTableColumns([]);
      }
    } catch (err: any) {
      setError(err.message || `Failed to fetch data for table ${tableName}`);
      console.error(`Error fetching data for table ${tableName}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      setError("SQL query cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      // In a real implementation, you would execute this via PostgreSQL
      // This is a mock implementation for demonstration purposes
      const { rows } = await mockDatabase.query(sqlQuery);

      if (error) throw error;

      // Mock execution for demonstration
      let mockResult: any[] = [];
      let mockColumns: string[] = [];
      let mockAffectedRows = 0;

      // Simple parsing to determine query type
      const queryType = sqlQuery.trim().toLowerCase().split(" ")[0];

      if (queryType === "select") {
        // Mock SELECT result
        mockColumns = ["id", "name", "value", "created_at"];
        for (let i = 0; i < 5; i++) {
          mockResult.push({
            id: i + 1,
            name: `Item ${i + 1}`,
            value: (Math.random() * 100).toFixed(2),
            created_at: new Date().toISOString(),
          });
        }
      } else if (["insert", "update", "delete"].includes(queryType)) {
        // Mock DML result
        mockAffectedRows = Math.floor(Math.random() * 10) + 1;
      }

      const endTime = performance.now();
      const executionTime = (endTime - startTime) / 1000; // Convert to seconds

      setQueryResult({
        data: data || mockResult,
        columns: data ? Object.keys(data[0] || {}) : mockColumns,
        error: null,
        executionTime,
        affectedRows: data ? data.length : mockAffectedRows,
      });
    } catch (err: any) {
      const endTime = performance.now();
      const executionTime = (endTime - startTime) / 1000;

      setQueryResult({
        data: null,
        columns: [],
        error: err.message || "Failed to execute query",
        executionTime,
      });
      console.error("Error executing query:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDatabaseStats = async () => {
    // In a real implementation, you would fetch this from Supabase
    // This is a mock implementation for demonstration purposes
    try {
      // Mock stats for demonstration
      const mockStats: DatabaseStats = {
        totalTables: tables.length || 5,
        totalSize: "8.0 MB",
        connections: 12,
        uptime: "15 days, 7 hours",
        lastBackup: "2023-12-01 03:15 AM",
      };

      setDbStats(mockStats);
    } catch (err: any) {
      console.error("Error fetching database stats:", err);
    }
  };

  const saveQuery = (name: string, query: string) => {
    setSavedQueries([...savedQueries, { name, query }]);
  };

  const loadSavedQuery = (query: string) => {
    setSqlQuery(query);
  };

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      {/* Database Connection Test Card */}
      <div className="mb-6">
        <DatabaseConnectionTest />
      </div>
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Database Management</h1>
            <p className="text-muted-foreground">
              Manage your PostgreSQL database with SQL queries and table
              browsing
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={fetchTables}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Schema
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Table
            </Button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Database Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tables
              </CardTitle>
              <TableIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbStats.totalTables}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Database Size
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbStats.totalSize}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Connections
              </CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbStats.connections}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbStats.uptime}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Save className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{dbStats.lastBackup}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="query">SQL Query</TabsTrigger>
            <TabsTrigger value="tables">Tables Browser</TabsTrigger>
            <TabsTrigger value="data">Data Viewer</TabsTrigger>
          </TabsList>

          {/* SQL Query Tab */}
          <TabsContent value="query" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>SQL Query Editor</CardTitle>
                  <div className="flex space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Saved Queries
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Load Saved Query</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {savedQueries.map((q, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => loadSavedQuery(q.query)}
                          >
                            {q.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Save className="mr-2 h-4 w-4" />
                          Save Query
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save SQL Query</DialogTitle>
                          <DialogDescription>
                            Give your query a name to save it for future use.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label
                              htmlFor="query-name"
                              className="text-right text-sm font-medium"
                            >
                              Name
                            </label>
                            <Input
                              id="query-name"
                              placeholder="My Query"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label
                              htmlFor="query-preview"
                              className="text-right text-sm font-medium"
                            >
                              Query
                            </label>
                            <div className="col-span-3 text-sm bg-gray-100 p-2 rounded-md overflow-auto max-h-32">
                              <code>{sqlQuery}</code>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => {
                              const nameInput = document.getElementById(
                                "query-name",
                              ) as HTMLInputElement;
                              if (nameInput && nameInput.value) {
                                saveQuery(nameInput.value, sqlQuery);
                              }
                            }}
                          >
                            Save Query
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <CardDescription>
                  Write and execute SQL queries directly against your PostgreSQL
                  database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="SELECT * FROM your_table;"
                    className="font-mono min-h-[200px]"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={executeQuery}
                      disabled={isLoading || !sqlQuery.trim()}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Execute Query
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Query Results */}
            {queryResult && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Query Results</CardTitle>
                    <Badge variant="outline">
                      {queryResult.executionTime.toFixed(3)}s
                    </Badge>
                  </div>
                  {queryResult.affectedRows !== undefined && (
                    <CardDescription>
                      {queryResult.affectedRows} rows affected
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {queryResult.error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Query Error</AlertTitle>
                      <AlertDescription>{queryResult.error}</AlertDescription>
                    </Alert>
                  ) : queryResult.data && queryResult.data.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {queryResult.columns.map((column, index) => (
                              <TableHead key={index}>{column}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {queryResult.columns.map((column, colIndex) => (
                                <TableCell key={colIndex}>
                                  {typeof row[column] === "object"
                                    ? JSON.stringify(row[column])
                                    : String(row[column])}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No results returned
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {queryResult.data
                      ? `${queryResult.data.length} rows returned`
                      : ""}
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          {/* Tables Browser Tab */}
          <TabsContent value="tables" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tables List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Database Tables</CardTitle>
                    <Badge variant="outline">{tables.length}</Badge>
                  </div>
                  <div className="mt-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tables..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {filteredTables.map((table) => (
                        <Button
                          key={table.name}
                          variant={
                            selectedTable === table.name ? "default" : "ghost"
                          }
                          className="w-full justify-start"
                          onClick={() => setSelectedTable(table.name)}
                        >
                          <TableIcon className="mr-2 h-4 w-4" />
                          {table.name}
                          <Badge variant="outline" className="ml-auto">
                            {table.rowCount}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Table
                  </Button>
                </CardFooter>
              </Card>

              {/* Table Structure */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {selectedTable
                        ? `Table: ${selectedTable}`
                        : "Select a Table"}
                    </CardTitle>
                    {selectedTable && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Structure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Drop Table
                        </Button>
                      </div>
                    )}
                  </div>
                  {selectedTable && (
                    <CardDescription>
                      {tables.find((t) => t.name === selectedTable)?.rowCount ||
                        0}{" "}
                      rows,
                      {tables.find((t) => t.name === selectedTable)?.size ||
                        "0 KB"}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedTable ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column Name</TableHead>
                            <TableHead>Data Type</TableHead>
                            <TableHead>Nullable</TableHead>
                            <TableHead>Key</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tables
                            .find((t) => t.name === selectedTable)
                            ?.columns.map((column, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {column.name}
                                </TableCell>
                                <TableCell>{column.dataType}</TableCell>
                                <TableCell>
                                  {column.isNullable ? "YES" : "NO"}
                                </TableCell>
                                <TableCell>
                                  {column.isPrimaryKey && (
                                    <Badge>Primary Key</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      Select a table to view its structure
                    </div>
                  )}
                </CardContent>
                {selectedTable && (
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Column
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setSqlQuery(
                          `SELECT * FROM ${selectedTable} LIMIT 100;`,
                        );
                        document.querySelector('[data-value="query"]')?.click();
                      }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Query Table
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Data Viewer Tab */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {selectedTable
                      ? `Data: ${selectedTable}`
                      : "Select a Table"}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Select
                      value={selectedTable}
                      onValueChange={setSelectedTable}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((table) => (
                          <SelectItem key={table.name} value={table.name}>
                            {table.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Row
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedTable ? (
                  tableData.length > 0 ? (
                    <div className="rounded-md border overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Actions</TableHead>
                            {tableColumns.map((column, index) => (
                              <TableHead key={index}>{column}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Row
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Row
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                              {tableColumns.map((column, colIndex) => (
                                <TableCell key={colIndex}>
                                  {typeof row[column] === "object"
                                    ? JSON.stringify(row[column])
                                    : String(row[column])}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No data available in this table
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    Select a table to view its data
                  </div>
                )}
              </CardContent>
              {selectedTable && tableData.length > 0 && (
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {tableData.length} of{" "}
                    {tables.find((t) => t.name === selectedTable)?.rowCount ||
                      0}{" "}
                    rows
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseManagement;
