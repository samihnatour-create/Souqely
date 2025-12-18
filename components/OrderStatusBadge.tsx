import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "paid" | "cod_pending" | "completed" | "cancelled";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  paid: "bg-green-100 text-green-800 hover:bg-green-100",
  cod_pending: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  cod_pending: "COD Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={statusStyles[status]} variant="outline">
      {statusLabels[status]}
    </Badge>
  );
}
