import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  Users,
  Wrench,
  FileText,
} from "lucide-react";

interface ManufacturingOrder {
  id: string;
  title: string;
  product: string;
  quantity: number;
  status: "pending" | "in-progress" | "completed" | "delayed";
  dueDate: string;
  assignedTo: string;
  equipment: string;
  priority: "low" | "medium" | "high";
  delayReason?: string;
}

interface ProductionBoardProps {
  orders?: ManufacturingOrder[];
}

const statusColumns = [
  { id: "pending", title: "Chờ xử lý" },
  { id: "in-progress", title: "Đang sản xuất" },
  { id: "completed", title: "Hoàn thành" },
  { id: "delayed", title: "Trì hoãn" },
];

const OrderCard = ({
  order,
  onEdit,
  onDelete,
  onViewTracking,
}: {
  order: ManufacturingOrder;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewTracking: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: order.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 cursor-grab active:cursor-grabbing bg-white"
      {...attributes}
      {...listeners}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium">{order.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {order.product}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(order.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Sửa lệnh
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewTracking(order.id)}>
                <FileText className="mr-2 h-4 w-4" />
                Theo dõi lệnh
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(order.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa lệnh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Badge
                variant="outline"
                className={priorityColors[order.priority]}
              >
                {order.priority === "high"
                  ? "Cao"
                  : order.priority === "medium"
                    ? "Trung bình"
                    : "Thấp"}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              {order.quantity} sản phẩm
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Hạn: {order.dueDate}</span>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1" />
              <span>{order.assignedTo}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Wrench className="h-3 w-3 mr-1" />
              <span>{order.equipment}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderFormDialog = ({
  isOpen = true,
  onClose = () => {},
  onSave = () => {},
  editingOrder = null,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (order: Partial<ManufacturingOrder>) => void;
  editingOrder?: ManufacturingOrder | null;
}) => {
  const [formData, setFormData] = useState<Partial<ManufacturingOrder>>(
    editingOrder || {
      title: "",
      product: "",
      quantity: 0,
      status: "pending",
      dueDate: "",
      assignedTo: "",
      equipment: "",
      priority: "medium",
    },
  );

  const handleChange = (field: keyof ManufacturingOrder, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingOrder ? "Sửa lệnh sản xuất" : "Tạo lệnh sản xuất mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Số lệnh
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="product"
                className="text-right text-sm font-medium"
              >
                Sản phẩm
              </label>
              <Input
                id="product"
                value={formData.product}
                onChange={(e) => handleChange("product", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="quantity"
                className="text-right text-sm font-medium"
              >
                Số lượng
              </label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  handleChange("quantity", parseInt(e.target.value))
                }
                className="col-span-3"
                required
                min="1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="status"
                className="text-right text-sm font-medium"
              >
                Trạng thái
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="in-progress">Đang sản xuất</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="delayed">Trì hoãn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="dueDate"
                className="text-right text-sm font-medium"
              >
                Ngày hoàn thành
              </label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="assignedTo"
                className="text-right text-sm font-medium"
              >
                Người phụ trách
              </label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => handleChange("assignedTo", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="equipment"
                className="text-right text-sm font-medium"
              >
                Thiết bị
              </label>
              <Input
                id="equipment"
                value={formData.equipment}
                onChange={(e) => handleChange("equipment", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="priority"
                className="text-right text-sm font-medium"
              >
                Mức ưu tiên
              </label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn mức ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {editingOrder ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProductionBoard = ({
  orders: initialOrders = [],
}: ProductionBoardProps) => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<ManufacturingOrder[]>(
    initialOrders.length > 0
      ? initialOrders
      : [
          {
            id: "001",
            title: "LSX-2023-001",
            product: "Vỏ điện thoại Model A",
            quantity: 1000,
            status: "in-progress",
            dueDate: "2023-12-15",
            assignedTo: "Nguyễn Văn B",
            equipment: "MS-001",
            priority: "high",
          },
          {
            id: "002",
            title: "LSX-2023-002",
            product: "Hộp đựng thực phẩm",
            quantity: 800,
            status: "pending",
            dueDate: "2023-12-20",
            assignedTo: "Phạm Văn E",
            equipment: "MS-002",
            priority: "medium",
          },
          {
            id: "003",
            title: "LSX-2023-003",
            product: "Nắp chai nước",
            quantity: 2000,
            status: "completed",
            dueDate: "2023-12-05",
            assignedTo: "Trần Văn C",
            equipment: "MS-003",
            priority: "low",
          },
          {
            id: "004",
            title: "LSX-2023-004",
            product: "Khay nhựa đựng linh kiện",
            quantity: 500,
            status: "delayed",
            dueDate: "2023-12-01",
            assignedTo: "Lê Thị D",
            equipment: "MS-004",
            priority: "high",
          },
        ],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ManufacturingOrder | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    ManufacturingOrder[]
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeOrder = orders.find((order) => order.id === active.id);
      if (activeOrder) {
        // If dropping on a column header
        if (over.id.startsWith("column-")) {
          const newStatus = over.id.replace("column-", "");
          setOrders(
            orders.map((order) =>
              order.id === active.id ? { ...order, status: newStatus } : order,
            ),
          );
        }
        // If reordering within the same column
        else {
          const oldIndex = orders.findIndex((order) => order.id === active.id);
          const newIndex = orders.findIndex((order) => order.id === over.id);
          setOrders(arrayMove(orders, oldIndex, newIndex));
        }
      }
    }

    setActiveId(null);
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowOrderForm(true);
  };

  const handleEditOrder = (id: string) => {
    const orderToEdit = orders.find((order) => order.id === id);
    if (orderToEdit) {
      setEditingOrder(orderToEdit);
      setShowOrderForm(true);
    }
  };

  const handleViewOrderTracking = (id: string) => {
    // Find the order to get its title (which contains the order number)
    const orderToView = orders.find((order) => order.id === id);
    if (orderToView) {
      // Use the actual order number from the title
      navigate(`/production-tracking?orderNumber=${orderToView.title}`);
    }
  };

  const handleSelectOrder = (id: string) => {
    const orderToView = orders.find((order) => order.id === id);
    if (orderToView) {
      setSearchTerm(orderToView.title);
      setShowSuggestions(false);
    }
  };

  // Filter suggestions based on search input
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = orders.filter(
        (order) =>
          order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.product.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, orders]);

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

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleSaveOrder = (orderData: Partial<ManufacturingOrder>) => {
    if (editingOrder) {
      // Update existing order
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? { ...order, ...orderData } : order,
        ),
      );
    } else {
      // Create new order
      const newOrder = {
        ...orderData,
        id: `${orders.length + 1}`,
      } as ManufacturingOrder;

      setOrders([...orders, newOrder]);
    }
  };

  // Check for URL parameters that might indicate an order update or show order form
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updatedOrderNumber = params.get("updated");
    const newStatus = params.get("status");
    const reason = params.get("reason");
    const showForm = params.get("showOrderForm");

    if (showForm === "true") {
      // Show the order form if requested
      setShowOrderForm(true);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (updatedOrderNumber && newStatus) {
      // Find the order and update its status
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.title === updatedOrderNumber) {
            // If there's a delay reason, store it in the order object
            if (reason && newStatus === "delayed") {
              return {
                ...order,
                status: newStatus as any,
                delayReason: decodeURIComponent(reason),
              };
            }
            return { ...order, status: newStatus as any };
          }
          return order;
        }),
      );

      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      !filterPriority ||
      filterPriority === "all" ||
      order.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="w-full h-full bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Kế hoạch sản xuất</h2>
          <p className="text-sm text-muted-foreground">
            Kéo thả các lệnh sản xuất để cập nhật trạng thái
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm lệnh..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.map((order) => (
                  <div
                    key={order.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSelectOrder(order.id)}
                  >
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{order.title}</div>
                      <div className="text-xs text-gray-500">
                        {order.product}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`ml-2 ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "delayed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Hoàn thành"
                        : order.status === "in-progress"
                          ? "Đang SX"
                          : order.status === "delayed"
                            ? "Trì hoãn"
                            : "Chờ xử lý"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Select
            value={filterPriority || ""}
            onValueChange={(value) => setFilterPriority(value || null)}
          >
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>
                  {filterPriority
                    ? filterPriority === "high"
                      ? "Ưu tiên cao"
                      : filterPriority === "medium"
                        ? "Ưu tiên trung bình"
                        : filterPriority === "low"
                          ? "Ưu tiên thấp"
                          : "Tất cả"
                    : "Lọc ưu tiên"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="low">Ưu tiên thấp</SelectItem>
              <SelectItem value="medium">Ưu tiên trung bình</SelectItem>
              <SelectItem value="high">Ưu tiên cao</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleAddOrder}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo lệnh mới
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tạo lệnh sản xuất mới</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusColumns.map((column) => {
            const columnOrders = filteredOrders.filter(
              (order) => order.status === column.id,
            );

            return (
              <div
                key={column.id}
                id={`column-${column.id}`}
                className="bg-gray-100 rounded-lg p-3 min-h-[500px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm">{column.title}</h3>
                  <Badge variant="outline">{columnOrders.length}</Badge>
                </div>

                <SortableContext items={columnOrders.map((order) => order.id)}>
                  {columnOrders.map((order) => (
                    <div key={order.id}>
                      <OrderCard
                        order={order}
                        onEdit={handleEditOrder}
                        onDelete={handleDeleteOrder}
                        onViewTracking={handleViewOrderTracking}
                      />
                      {order.status === "delayed" && order.delayReason && (
                        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
                          <div className="flex items-start">
                            <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{order.delayReason}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeId ? (
            <OrderCard
              order={orders.find((order) => order.id === activeId)!}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onViewTracking={handleViewOrderTracking}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {showOrderForm && (
        <OrderFormDialog
          isOpen={showOrderForm}
          onClose={() => setShowOrderForm(false)}
          onSave={handleSaveOrder}
          editingOrder={editingOrder}
        />
      )}
    </div>
  );
};

export default ProductionBoard;
