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
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react";

interface MoldData {
  ma_so_khuon: string;
  ten_khuon: string;
  vi_tri_khuon: string;
  so_chi_tiet: string;
  m_sp: string;
  m_duoi: string;
  loi_khuon: string;
  kich_thuoc_khuon: string;
}

const MoldManagement = () => {
  const [molds, setMolds] = useState<MoldData[]>([
    {
      ma_so_khuon: "KH-A102",
      ten_khuon: "Vỏ điện thoại Model A",
      vi_tri_khuon: "Trung tâm",
      so_chi_tiet: "1",
      m_sp: "120",
      m_duoi: "2.5",
      loi_khuon: "Vết cháy ở góc dưới",
      kich_thuoc_khuon: "250x150x50",
    },
    {
      ma_so_khuon: "KH-B205",
      ten_khuon: "Hộp đựng thực phẩm",
      vi_tri_khuon: "Bên phải",
      so_chi_tiet: "1",
      m_sp: "200",
      m_duoi: "3.2",
      loi_khuon: "Vết nứt ở mép",
      kich_thuoc_khuon: "300x200x70",
    },
    {
      ma_so_khuon: "KH-C301",
      ten_khuon: "Nắp chai nước",
      vi_tri_khuon: "Trung tâm",
      so_chi_tiet: "4",
      m_sp: "80",
      m_duoi: "1.8",
      loi_khuon: "Không đồng đều",
      kich_thuoc_khuon: "150x150x30",
    },
    {
      ma_so_khuon: "KH-D405",
      ten_khuon: "Khay nhựa đựng linh kiện",
      vi_tri_khuon: "Bên trái",
      so_chi_tiet: "1",
      m_sp: "250",
      m_duoi: "4.0",
      loi_khuon: "Biến dạng khi nhiệt độ cao",
      kich_thuoc_khuon: "400x300x50",
    },
    {
      ma_so_khuon: "KH-E501",
      ten_khuon: "Vỏ máy tính",
      vi_tri_khuon: "Trung tâm",
      so_chi_tiet: "2",
      m_sp: "500",
      m_duoi: "8.5",
      loi_khuon: "Vết lõm ở mặt trước",
      kich_thuoc_khuon: "450x350x150",
    },
    {
      ma_so_khuon: "KH-F602",
      ten_khuon: "Tay cầm điều khiển",
      vi_tri_khuon: "Bên phải",
      so_chi_tiet: "1",
      m_sp: "180",
      m_duoi: "3.0",
      loi_khuon: "Vết ráp không đều",
      kich_thuoc_khuon: "200x150x60",
    },
    {
      ma_so_khuon: "KH-G703",
      ten_khuon: "Hộp đựng bút",
      vi_tri_khuon: "Bên trái",
      so_chi_tiet: "1",
      m_sp: "100",
      m_duoi: "2.0",
      loi_khuon: "Vết xước bề mặt",
      kich_thuoc_khuon: "220x80x30",
    },
    {
      ma_so_khuon: "KH-H804",
      ten_khuon: "Vỏ đồng hồ",
      vi_tri_khuon: "Trung tâm",
      so_chi_tiet: "1",
      m_sp: "50",
      m_duoi: "1.2",
      loi_khuon: "Độ bóng không đều",
      kich_thuoc_khuon: "100x100x20",
    },
    {
      ma_so_khuon: "KH-I905",
      ten_khuon: "Khay đá tủ lạnh",
      vi_tri_khuon: "Bên phải",
      so_chi_tiet: "12",
      m_sp: "300",
      m_duoi: "5.0",
      loi_khuon: "Biến dạng khi nhiệt độ thấp",
      kich_thuoc_khuon: "350x250x40",
    },
    {
      ma_so_khuon: "KH-J106",
      ten_khuon: "Vỏ quạt điện",
      vi_tri_khuon: "Bên trái",
      so_chi_tiet: "3",
      m_sp: "400",
      m_duoi: "6.5",
      loi_khuon: "Vết cháy ở cạnh",
      kich_thuoc_khuon: "500x500x100",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMold, setNewMold] = useState<Partial<MoldData>>({});
  const [editingMold, setEditingMold] = useState<MoldData | null>(null);

  const handleInputChange = (field: keyof MoldData, value: string) => {
    if (editingMold) {
      setEditingMold({ ...editingMold, [field]: value });
    } else {
      setNewMold({ ...newMold, [field]: value });
    }
  };

  const handleAddMold = () => {
    if (editingMold) {
      // Update existing mold
      setMolds(
        molds.map((mold) =>
          mold.ma_so_khuon === editingMold.ma_so_khuon ? editingMold : mold,
        ),
      );
      setEditingMold(null);
    } else {
      // Add new mold
      setMolds([...molds, newMold as MoldData]);
      setNewMold({});
    }
    setShowAddDialog(false);
  };

  const handleEditMold = (mold: MoldData) => {
    setEditingMold(mold);
    setShowAddDialog(true);
  };

  const handleDeleteMold = (ma_so_khuon: string) => {
    setMolds(molds.filter((mold) => mold.ma_so_khuon !== ma_so_khuon));
  };

  const filteredMolds = molds.filter(
    (mold) =>
      mold.ma_so_khuon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mold.ten_khuon.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Quản lý khuôn mẫu</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin khuôn mẫu trong hệ thống
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
            <Button
              onClick={() => {
                setEditingMold(null);
                setNewMold({});
                setShowAddDialog(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm khuôn mới
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã số, tên khuôn..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Molds Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khuôn mẫu</CardTitle>
            <CardDescription>
              Tổng số: {filteredMolds.length} khuôn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MS khuôn</TableHead>
                    <TableHead>Tên khuôn</TableHead>
                    <TableHead>Vị trí khuôn</TableHead>
                    <TableHead>Số chi tiết</TableHead>
                    <TableHead>Trọng lượng SP (g)</TableHead>
                    <TableHead>Trọng lượng đuôi (g)</TableHead>
                    <TableHead>Kích thước (mm)</TableHead>
                    <TableHead>Lỗi thường gặp</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMolds.map((mold) => (
                    <TableRow key={mold.ma_so_khuon}>
                      <TableCell className="font-medium">
                        {mold.ma_so_khuon}
                      </TableCell>
                      <TableCell>{mold.ten_khuon}</TableCell>
                      <TableCell>{mold.vi_tri_khuon}</TableCell>
                      <TableCell>{mold.so_chi_tiet}</TableCell>
                      <TableCell>{mold.m_sp}</TableCell>
                      <TableCell>{mold.m_duoi}</TableCell>
                      <TableCell>{mold.kich_thuoc_khuon}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {mold.loi_khuon}
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
                            <DropdownMenuItem
                              onClick={() => handleEditMold(mold)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMold(mold.ma_so_khuon)}
                            >
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
              Hiển thị {filteredMolds.length} / {molds.length} khuôn
            </div>
          </CardFooter>
        </Card>

        {/* Add/Edit Mold Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingMold ? "Chỉnh sửa khuôn" : "Thêm khuôn mới"}
              </DialogTitle>
              <DialogDescription>
                {editingMold
                  ? "Cập nhật thông tin khuôn"
                  : "Nhập thông tin khuôn mới vào hệ thống"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="ma_so_khuon"
                  className="text-right text-sm font-medium"
                >
                  MS khuôn
                </label>
                <Input
                  id="ma_so_khuon"
                  value={editingMold?.ma_so_khuon || newMold.ma_so_khuon || ""}
                  onChange={(e) =>
                    handleInputChange("ma_so_khuon", e.target.value)
                  }
                  className="col-span-3"
                  required
                  disabled={!!editingMold}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="ten_khuon"
                  className="text-right text-sm font-medium"
                >
                  Tên khuôn
                </label>
                <Input
                  id="ten_khuon"
                  value={editingMold?.ten_khuon || newMold.ten_khuon || ""}
                  onChange={(e) =>
                    handleInputChange("ten_khuon", e.target.value)
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="vi_tri_khuon"
                  className="text-right text-sm font-medium"
                >
                  Vị trí khuôn
                </label>
                <Input
                  id="vi_tri_khuon"
                  value={
                    editingMold?.vi_tri_khuon || newMold.vi_tri_khuon || ""
                  }
                  onChange={(e) =>
                    handleInputChange("vi_tri_khuon", e.target.value)
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="so_chi_tiet"
                  className="text-right text-sm font-medium"
                >
                  Số chi tiết
                </label>
                <Input
                  id="so_chi_tiet"
                  type="number"
                  value={editingMold?.so_chi_tiet || newMold.so_chi_tiet || ""}
                  onChange={(e) =>
                    handleInputChange("so_chi_tiet", e.target.value)
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="m_sp"
                  className="text-right text-sm font-medium"
                >
                  Trọng lượng SP (g)
                </label>
                <Input
                  id="m_sp"
                  type="number"
                  value={editingMold?.m_sp || newMold.m_sp || ""}
                  onChange={(e) => handleInputChange("m_sp", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="m_duoi"
                  className="text-right text-sm font-medium"
                >
                  Trọng lượng đuôi (g)
                </label>
                <Input
                  id="m_duoi"
                  type="number"
                  value={editingMold?.m_duoi || newMold.m_duoi || ""}
                  onChange={(e) => handleInputChange("m_duoi", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="kich_thuoc_khuon"
                  className="text-right text-sm font-medium"
                >
                  Kích thước (mm)
                </label>
                <Input
                  id="kich_thuoc_khuon"
                  placeholder="DxRxC"
                  value={
                    editingMold?.kich_thuoc_khuon ||
                    newMold.kich_thuoc_khuon ||
                    ""
                  }
                  onChange={(e) =>
                    handleInputChange("kich_thuoc_khuon", e.target.value)
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="loi_khuon"
                  className="text-right text-sm font-medium"
                >
                  Lỗi thường gặp
                </label>
                <Input
                  id="loi_khuon"
                  value={editingMold?.loi_khuon || newMold.loi_khuon || ""}
                  onChange={(e) =>
                    handleInputChange("loi_khuon", e.target.value)
                  }
                  className="col-span-3"
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
              <Button type="submit" onClick={handleAddMold}>
                {editingMold ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MoldManagement;
