import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Download,
  RefreshCw,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
}

const PersonnelList = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP001",
      name: "Nguyễn Văn A",
      position: "Quản lý sản xuất",
      department: "Sản xuất",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      status: "active",
      joinDate: "2020-05-15",
    },
    {
      id: "EMP002",
      name: "Trần Thị B",
      position: "Nhân viên kỹ thuật",
      department: "Kỹ thuật",
      email: "tranthib@example.com",
      phone: "0912345678",
      status: "active",
      joinDate: "2021-03-10",
    },
    {
      id: "EMP003",
      name: "Lê Văn C",
      position: "Công nhân vận hành",
      department: "Sản xuất",
      email: "levanc@example.com",
      phone: "0923456789",
      status: "on-leave",
      joinDate: "2019-11-20",
    },
    {
      id: "EMP004",
      name: "Phạm Thị D",
      position: "Nhân viên kho",
      department: "Kho vận",
      email: "phamthid@example.com",
      phone: "0934567890",
      status: "active",
      joinDate: "2022-01-05",
    },
    {
      id: "EMP005",
      name: "Hoàng Văn E",
      position: "Kỹ sư bảo trì",
      department: "Kỹ thuật",
      email: "hoangvane@example.com",
      phone: "0945678901",
      status: "inactive",
      joinDate: "2018-07-12",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    status: "active",
  });

  const handleInputChange = (field: keyof Employee, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = () => {
    const id = `EMP${String(employees.length + 1).padStart(3, "0")}`;
    setEmployees([...employees, { ...newEmployee, id } as Employee]);
    setNewEmployee({ status: "active" });
    setShowAddDialog(false);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      !departmentFilter || employee.department === departmentFilter;

    const matchesStatus = !statusFilter || employee.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Đang làm việc
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-500 text-white">
            Đã nghỉ việc
          </Badge>
        );
      case "on-leave":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Đang nghỉ phép
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const departments = [...new Set(employees.map((emp) => emp.department))];

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Danh sách nhân viên</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin nhân viên trong hệ thống
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, mã nhân viên..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={departmentFilter || ""}
                onValueChange={(value) =>
                  setDepartmentFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>{departmentFilter || "Phòng ban"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả phòng ban</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter || ""}
                onValueChange={(value) =>
                  setStatusFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>
                      {statusFilter === "active"
                        ? "Đang làm việc"
                        : statusFilter === "inactive"
                          ? "Đã nghỉ việc"
                          : statusFilter === "on-leave"
                            ? "Đang nghỉ phép"
                            : "Trạng thái"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                  <SelectItem value="on-leave">Đang nghỉ phép</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Nhân viên</CardTitle>
            <CardDescription>
              Tổng số: {filteredEmployees.length} nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã NV</TableHead>
                    <TableHead>Tên nhân viên</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Điện thoại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày vào làm</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.id}
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell>
                        {new Date(employee.joinDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </TableCell>
                      <TableCell className="text-right">
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
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button variant="outline" size="sm" disabled>
                Sau
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Add Employee Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm nhân viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin nhân viên mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="name"
                  className="text-right text-sm font-medium"
                >
                  Tên nhân viên
                </label>
                <Input
                  id="name"
                  value={newEmployee.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="position"
                  className="text-right text-sm font-medium"
                >
                  Chức vụ
                </label>
                <Input
                  id="position"
                  value={newEmployee.position || ""}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="department"
                  className="text-right text-sm font-medium"
                >
                  Phòng ban
                </label>
                <Select
                  value={newEmployee.department || ""}
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger id="department" className="col-span-3">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                    <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                    <SelectItem value="Kho vận">Kho vận</SelectItem>
                    <SelectItem value="Hành chính">Hành chính</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="email"
                  className="text-right text-sm font-medium"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="phone"
                  className="text-right text-sm font-medium"
                >
                  Điện thoại
                </label>
                <Input
                  id="phone"
                  value={newEmployee.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="joinDate"
                  className="text-right text-sm font-medium"
                >
                  Ngày vào làm
                </label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newEmployee.joinDate || ""}
                  onChange={(e) =>
                    handleInputChange("joinDate", e.target.value)
                  }
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Hủy
              </Button>
              <Button type="submit" onClick={handleAddEmployee}>
                Thêm nhân viên
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PersonnelList;
