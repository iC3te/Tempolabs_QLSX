import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  FileText,
  Printer,
  Download,
  RefreshCw,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface ProductionOrderData {
  orderNumber: string;
  machineId: string;
  moldId: string;
  moldPosition: string;
  manufacturerId: string;
  plasticType: string;
  plasticCode: string;
  color: string;
  shrinkageRate: string;
  productName: string;
  tailWeight: string;
  totalPlasticWeight: string;
  productionDate: string;
  signature: string;
  productionRecords: ProductionRecord[];
  materialRecords: MaterialRecord[];
}

interface ProductionRecord {
  date: string;
  startTime: string;
  endTime: string;
  startCounter: string;
  endCounter: string;
  quantity: string;
  notes: string;
  operator: string;
  supervisor: string;
}

interface MaterialRecord {
  date: string;
  virginPlastic: string;
  regrind: string;
  colorant: string;
  notes: string;
  receivedBy: string;
}

const ProductionOrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [currentOrder, setCurrentOrder] = useState<ProductionOrderData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<string[]>([]);
  const [orderStatus, setOrderStatus] = useState<string>("in-progress");
  const [delayReason, setDelayReason] = useState<string>("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Extract orderNumber from URL query parameters if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderNumber = params.get("orderNumber");
    if (orderNumber) {
      setSearchOrderNumber(orderNumber);
      fetchOrderData(orderNumber);
    }
  }, [location.search]);

  // Add more mock orders to match the ones in ProductionBoard
  useEffect(() => {
    // Add LSX-2023-003 and LSX-2023-004 to mockOrders if they don't exist
    if (!mockOrders["LSX-2023-003"]) {
      mockOrders["LSX-2023-003"] = {
        orderNumber: "LSX-2023-003",
        machineId: "MS-003",
        moldId: "KH-C301",
        moldPosition: "Trung tâm",
        manufacturerId: "MPC-003",
        plasticType: "PE",
        plasticCode: "PE-L200",
        color: "Xanh",
        shrinkageRate: "0.4%",
        productName: "Nắp chai nước",
        tailWeight: "1.8",
        totalPlasticWeight: "80",
        productionDate: "17/12/2023",
        signature: "Trần Văn C",
        productionRecords: [
          {
            date: "17/12/2023",
            startTime: "7:00",
            endTime: "15:00",
            startCounter: "0",
            endCounter: "2000",
            quantity: "2000",
            notes: "Hoàn thành đúng tiến độ",
            operator: "Trần Văn C",
            supervisor: "Nguyễn Văn A",
          },
        ],
        materialRecords: [
          {
            date: "17/12/2023",
            virginPlastic: "75",
            regrind: "5",
            colorant: "3",
            notes: "Sử dụng màu xanh đậm",
            receivedBy: "Lê Thị D",
          },
        ],
      };
    }

    if (!mockOrders["LSX-2023-004"]) {
      mockOrders["LSX-2023-004"] = {
        orderNumber: "LSX-2023-004",
        machineId: "MS-004",
        moldId: "KH-D405",
        moldPosition: "Bên trái",
        manufacturerId: "MPC-004",
        plasticType: "PS",
        plasticCode: "PS-H100",
        color: "Trong suốt",
        shrinkageRate: "0.2%",
        productName: "Khay nhựa đựng linh kiện",
        tailWeight: "4.0",
        totalPlasticWeight: "250",
        productionDate: "10/12/2023",
        signature: "Lê Thị D",
        productionRecords: [
          {
            date: "10/12/2023",
            startTime: "8:00",
            endTime: "12:00",
            startCounter: "0",
            endCounter: "250",
            quantity: "250",
            notes: "Gặp sự cố máy, phải dừng sản xuất",
            operator: "Lê Thị D",
            supervisor: "Nguyễn Văn A",
          },
        ],
        materialRecords: [
          {
            date: "10/12/2023",
            virginPlastic: "240",
            regrind: "10",
            colorant: "0",
            notes: "Sử dụng nhựa trong suốt",
            receivedBy: "Phạm Văn E",
          },
        ],
      };
    }
  }, []);

  // Mock data for demonstration
  // This would be replaced with actual API calls in a real implementation
  const mockOrders: Record<string, ProductionOrderData> = {
    "LSX-2023-001": {
      orderNumber: "LSX-2023-001",
      machineId: "MS-001",
      moldId: "KH-A102",
      moldPosition: "Trung tâm",
      manufacturerId: "MPC-001",
      plasticType: "ABS",
      plasticCode: "ABS-H700",
      color: "Trắng",
      shrinkageRate: "0.5%",
      productName: "Vỏ điện thoại Model A",
      tailWeight: "2.5",
      totalPlasticWeight: "120",
      productionDate: "15/12/2023",
      signature: "Nguyễn Văn A",
      productionRecords: [
        {
          date: "15/12/2023",
          startTime: "8:00",
          endTime: "12:00",
          startCounter: "1000",
          endCounter: "1500",
          quantity: "500",
          notes: "Hoạt động bình thường",
          operator: "Nguyễn Văn B",
          supervisor: "Trần Văn C",
        },
        {
          date: "15/12/2023",
          startTime: "13:00",
          endTime: "17:00",
          startCounter: "1500",
          endCounter: "2000",
          quantity: "500",
          notes: "Điều chỉnh nhiệt độ +5°C",
          operator: "Nguyễn Văn B",
          supervisor: "Trần Văn C",
        },
      ],
      materialRecords: [
        {
          date: "15/12/2023",
          virginPlastic: "100",
          regrind: "20",
          colorant: "5",
          notes: "Nhập thêm nguyên liệu",
          receivedBy: "Lê Thị D",
        },
      ],
    },
    "LSX-2023-002": {
      orderNumber: "LSX-2023-002",
      machineId: "MS-002",
      moldId: "KH-B205",
      moldPosition: "Bên phải",
      manufacturerId: "MPC-002",
      plasticType: "PP",
      plasticCode: "PP-K300",
      color: "Đen",
      shrinkageRate: "0.3%",
      productName: "Hộp đựng thực phẩm",
      tailWeight: "3.2",
      totalPlasticWeight: "200",
      productionDate: "16/12/2023",
      signature: "Nguyễn Văn A",
      productionRecords: [
        {
          date: "16/12/2023",
          startTime: "8:00",
          endTime: "12:00",
          startCounter: "2000",
          endCounter: "2800",
          quantity: "800",
          notes: "Hoạt động bình thường",
          operator: "Phạm Văn E",
          supervisor: "Trần Văn C",
        },
      ],
      materialRecords: [
        {
          date: "16/12/2023",
          virginPlastic: "180",
          regrind: "20",
          colorant: "10",
          notes: "",
          receivedBy: "Lê Thị D",
        },
      ],
    },
  };

  const fetchOrderData = (orderNumber: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const order = mockOrders[orderNumber];
      setCurrentOrder(order || null);
      setIsLoading(false);
    }, 500);
  };

  // Filter orders based on search input
  useEffect(() => {
    if (searchOrderNumber.length > 0) {
      const filtered = Object.keys(mockOrders).filter((orderNum) =>
        orderNum.toLowerCase().includes(searchOrderNumber.toLowerCase()),
      );
      setFilteredOrders(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchOrderNumber]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchOrderNumber) {
      fetchOrderData(searchOrderNumber);
      setShowSuggestions(false);
    }
  };

  const handleSelectOrder = (orderNumber: string) => {
    setSearchOrderNumber(orderNumber);
    fetchOrderData(orderNumber);
    setShowSuggestions(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateOrder = () => {
    if (!currentOrder) return;

    setIsUpdating(true);

    // Simulate API call to update order status
    setTimeout(() => {
      // In a real app, this would be an API call to update the order status
      // For now, we'll just show a success message

      // Update URL with new status if needed
      if (orderStatus === "completed" || orderStatus === "delayed") {
        // Navigate back to production board with a success message
        navigate(
          `/production?updated=${currentOrder.orderNumber}&status=${orderStatus}${delayReason ? `&reason=${encodeURIComponent(delayReason)}` : ""}`,
        );
      } else {
        setIsUpdating(false);
        // Show success message
        alert("Cập nhật thành công!");
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Theo Dõi Lệnh Sản Xuất</h1>
            <p className="text-muted-foreground">
              Tra cứu và cập nhật trạng thái các lệnh sản xuất
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/production")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Kế hoạch sản xuất
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdateOrder}
              disabled={!currentOrder || isUpdating}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
              />
              Cập nhật dữ liệu
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Tạo lệnh mới
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tra cứu lệnh sản xuất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nhập số lệnh sản xuất..."
                    className="pl-8"
                    value={searchOrderNumber}
                    onChange={(e) => setSearchOrderNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() =>
                      searchOrderNumber.length > 0 && setShowSuggestions(true)
                    }
                  />
                  {showSuggestions && filteredOrders.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredOrders.map((orderNum) => {
                        const order = mockOrders[orderNum];
                        let statusText = "";
                        let statusClass = "";

                        // Determine status for display
                        if (orderNum.includes("LSX-2023-003")) {
                          statusText = "Hoàn thành";
                          statusClass = "bg-green-100 text-green-800";
                        } else if (orderNum.includes("LSX-2023-004")) {
                          statusText = "Trì hoãn";
                          statusClass = "bg-red-100 text-red-800";
                        } else if (orderNum.includes("LSX-2023-001")) {
                          statusText = "Đang SX";
                          statusClass = "bg-blue-100 text-blue-800";
                        } else {
                          statusText = "Chờ xử lý";
                          statusClass = "bg-amber-100 text-amber-800";
                        }

                        return (
                          <div
                            key={orderNum}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handleSelectOrder(orderNum)}
                          >
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <div className="flex-1">
                              <div className="font-medium">{orderNum}</div>
                              <div className="text-xs text-gray-500">
                                {order.productName}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`ml-2 ${statusClass}`}
                            >
                              {statusText}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 md:flex-initial">
                <Select
                  value={orderStatus}
                  onValueChange={setOrderStatus}
                  disabled={!currentOrder}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">Đang sản xuất</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    <SelectItem value="delayed">Trì hoãn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang tìm...
                  </>
                ) : (
                  "Tìm kiếm"
                )}
              </Button>
            </div>

            {orderStatus === "delayed" && currentOrder && (
              <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md">
                <Label
                  htmlFor="delay-reason"
                  className="text-red-800 font-medium"
                >
                  Lý do trì hoãn
                </Label>
                <Textarea
                  id="delay-reason"
                  placeholder="Nhập lý do trì hoãn lệnh sản xuất..."
                  className="mt-2 border-red-200"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Production Order Form */}
        {currentOrder ? (
          <div className="print-container">
            <Card className="border-2 border-black print:border">
              <CardContent className="p-0">
                <div className="border-b-2 border-black print:border-b">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="border-r-2 border-black p-4 print:border-r w-1/4">
                          <div className="text-center">
                            <h2 className="font-bold text-xl">TÂM ANH</h2>
                            <p className="text-sm">
                              đồ chơi & thiết bị giáo dục
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-center w-2/4">
                          <h1 className="font-bold text-2xl">
                            PHIẾU THEO DÕI MÁY ÉP
                          </h1>
                        </td>
                        <td className="border-l-2 border-black p-4 print:border-l w-1/4">
                          <div>
                            <p className="font-bold">Số phiếu</p>
                            <p className="bg-yellow-200 p-1">
                              {currentOrder.orderNumber}
                            </p>
                            <p className="font-bold mt-2">Số lượng</p>
                            <p className="p-1">
                              {currentOrder.productionRecords.reduce(
                                (sum, record) =>
                                  sum + parseInt(record.quantity || "0"),
                                0,
                              )}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-b-2 border-black print:border-b">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b w-1/6 font-bold">
                          Máy SX
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b w-1/6">
                          {currentOrder.machineId}
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b w-1/6 font-bold">
                          Mã pha chế
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b w-1/6 bg-yellow-200">
                          {currentOrder.manufacturerId}
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b w-1/6 font-bold">
                          Số lượng
                        </td>
                        <td className="border-b-2 border-black p-2 print:border-b w-1/6">
                          {currentOrder.productionRecords.reduce(
                            (sum, record) =>
                              sum + parseInt(record.quantity || "0"),
                            0,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          MS khuôn
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b">
                          {currentOrder.moldId}
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Vị trí khuôn
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b">
                          {currentOrder.moldPosition}
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Loại nhựa
                        </td>
                        <td className="border-b-2 border-black p-2 print:border-b">
                          {currentOrder.plasticType}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Tên khuôn
                        </td>
                        <td
                          className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b"
                          colSpan={3}
                        >
                          {currentOrder.productName}
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Mã nhựa
                        </td>
                        <td className="border-b-2 border-black p-2 print:border-b">
                          {currentOrder.plasticCode}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Số chi tiết
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b"></td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Màu
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b">
                          {currentOrder.color}
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Tỷ lệ trộn
                        </td>
                        <td className="border-b-2 border-black p-2 print:border-b">
                          {currentOrder.shrinkageRate}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Trọng lượng
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b">
                          Sản phẩm:{" "}
                          <span className="bg-yellow-200 px-1">
                            {currentOrder.totalPlasticWeight}
                          </span>{" "}
                          (g)
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b">
                          Đuôi keo: <span>{currentOrder.tailWeight}</span> (g)
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b font-bold">
                          Tổng lượng nhựa
                        </td>
                        <td className="border-r-2 border-b-2 border-black p-2 print:border-r print:border-b bg-yellow-200">
                          {parseFloat(currentOrder.totalPlasticWeight) +
                            parseFloat(currentOrder.tailWeight)}{" "}
                          (kg)
                        </td>
                        <td className="border-b-2 border-black p-2 print:border-b">
                          <div className="flex justify-between">
                            <span className="font-bold">Chữ ký</span>
                            <span>(ký)</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r-2 border-black p-2 print:border-r font-bold">
                          Lỗi thường gặp
                        </td>
                        <td
                          className="border-r-2 border-black p-2 print:border-r"
                          colSpan={5}
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Production Records */}
                <div className="border-b-2 border-black print:border-b">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center bg-gray-100"
                          colSpan={9}
                        >
                          THỜI GIAN S.XUẤT
                        </th>
                        <th
                          className="border-b-2 border-black p-2 print:border-b text-center bg-gray-100"
                          colSpan={2}
                        >
                          THEO DÕI S.XUẤT
                        </th>
                      </tr>
                      <tr>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                          Ngày
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                          Giờ
                        </th>
                        <th
                          className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center"
                          colSpan={2}
                        >
                          CHỈ SỐ MÁY
                        </th>
                        <th
                          className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center"
                          colSpan={2}
                        >
                          SL
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                          Trọng lượng
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                          DIỄN GIẢI
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                          Nhân viên
                        </th>
                        <th className="border-b-2 border-black p-2 print:border-b text-center">
                          Trưởng ca
                        </th>
                      </tr>
                      <tr>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r">
                          Đầu
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r">
                          Cuối
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r">
                          Tốt
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r">
                          Hư hỏng
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></th>
                        <th className="border-b-2 border-black p-2 print:border-b"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrder.productionRecords.map((record, index) => (
                        <tr key={index}>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center bg-green-50">
                            {record.date}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center bg-green-50">
                            {record.startTime} đến {record.endTime}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.startCounter}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.endCounter}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.quantity}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            0
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r">
                            {record.notes}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.operator}
                          </td>
                          <td className="border-b-2 border-black p-2 print:border-b text-center">
                            {record.supervisor}
                          </td>
                        </tr>
                      ))}
                      {/* Empty rows for future entries */}
                      {Array.from({
                        length: 15 - currentOrder.productionRecords.length,
                      }).map((_, index) => (
                        <tr key={`empty-${index}`}>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center bg-green-50">
                            .../.../202...
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center bg-green-50">
                            ...g... đến ...g...
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-black p-2 print:border-b"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Material Records */}
                <div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          className="border-b-2 border-black p-2 print:border-b text-center bg-gray-100"
                          colSpan={10}
                        >
                          VẬT TƯ
                        </th>
                      </tr>
                      <tr>
                        <th
                          className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center"
                          colSpan={2}
                        >
                          THỜI GIAN
                        </th>
                        <th
                          className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center bg-red-100"
                          colSpan={4}
                        >
                          Giao cho máy (kg)
                        </th>
                        <th
                          className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center bg-red-100"
                          colSpan={4}
                        >
                          Nhập kho (kg)
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                          Ghi chú
                        </th>
                        <th className="border-b-2 border-black p-2 print:border-b text-center">
                          Người giao/nhận
                        </th>
                      </tr>
                      <tr>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r">
                          Ngày
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          Nhựa zin
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          Xay trắng
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          Xay màu
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          O / trộn màu
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          Nhựa zin
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          Xay trắng
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          Xay màu
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r bg-red-100">
                          O / trộn màu
                        </th>
                        <th className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></th>
                        <th className="border-b-2 border-black p-2 print:border-b"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrder.materialRecords.map((record, index) => (
                        <tr key={index}>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.date}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.virginPlastic}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.regrind}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            {record.colorant}
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r">
                            {record.notes}
                          </td>
                          <td className="border-b-2 border-black p-2 print:border-b text-center">
                            {record.receivedBy}
                          </td>
                        </tr>
                      ))}
                      {/* Empty rows for future entries */}
                      {Array.from({
                        length: 4 - currentOrder.materialRecords.length,
                      }).map((_, index) => (
                        <tr key={`empty-mat-${index}`}>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r text-center">
                            .../.../202...
                          </td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-r-2 border-black p-2 print:border-b print:border-r"></td>
                          <td className="border-b-2 border-black p-2 print:border-b"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Action buttons for the form */}
            <div className="mt-4 flex justify-end space-x-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                In phiếu
              </Button>
            </div>

            {/* Print styles */}
            <style jsx global>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .print-container,
                .print-container * {
                  visibility: visible;
                }
                .print-container {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .print-hidden {
                  display: none;
                }
              }
            `}</style>
          </div>
        ) : (
          <Card className="bg-gray-100 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                Chưa có lệnh sản xuất nào được chọn
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Nhập số lệnh sản xuất vào ô tìm kiếm để xem chi tiết và theo dõi
                tiến độ sản xuất
              </p>
              <div className="flex gap-2">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Làm mới
                </Button>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Tạo lệnh mới
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductionOrderTracking;
