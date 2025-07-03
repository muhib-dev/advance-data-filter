import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterState } from "./DataFilterUI";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  email: string;
  date: Date;
  paymentMethod: string;
}

// Sample data
const samplePayments: Payment[] = [
  {
    id: "1",
    amount: 5.59,
    currency: "USD",
    status: "Succeeded",
    description: "Payment for Invoice",
    email: "customer@gmail.com",
    date: new Date("2024-03-21T03:50:00"),
    paymentMethod: "Card",
  },
  {
    id: "2",
    amount: 4.0,
    currency: "USD",
    status: "Succeeded",
    description: "Interest",
    email: "customer@gmail.com",
    date: new Date("2024-03-21T03:36:00"),
    paymentMethod: "Card",
  },
  {
    id: "3",
    amount: 4.0,
    currency: "USD",
    status: "Failed",
    description: "Interest",
    email: "customer@gmail.com",
    date: new Date("2024-03-21T03:35:00"),
    paymentMethod: "Bank transfer",
  },
  {
    id: "4",
    amount: 125.5,
    currency: "USD",
    status: "Pending",
    description: "Service Payment",
    email: "user@example.com",
    date: new Date("2024-03-20T15:20:00"),
    paymentMethod: "PayPal",
  },
  {
    id: "5",
    amount: 75.25,
    currency: "USD",
    status: "Succeeded",
    description: "Product Return",
    email: "refund@gmail.com",
    date: new Date("2024-03-19T10:15:00"),
    paymentMethod: "Apple Pay",
  },
  {
    id: "6",
    amount: 75.25,
    currency: "USD",
    status: "Refunded",
    description: "Product Return",
    email: "refund@gmail.com",
    date: new Date("2024-03-19T10:15:00"),
    paymentMethod: "Apple Pay",
  },
  {
    id: "7",
    amount: 75.25,
    currency: "USD",
    status: "Succeeded",
    description: "Product Return",
    email: "refund@gmail.com",
    date: new Date("2024-03-19T10:15:00"),
    paymentMethod: "Apple Pay",
  },
  {
    id: "8",
    amount: 75.25,
    currency: "USD",
    status: "Succeeded",
    description: "Product Return",
    email: "refund@gmail.com",
    date: new Date("2024-03-19T10:15:00"),
    paymentMethod: "Apple Pay",
  },
  {
    id: "9",
    amount: 75.25,
    currency: "USD",
    status: "Pending",
    description: "Product Return",
    email: "refund@gmail.com",
    date: new Date("2024-03-19T10:15:00"),
    paymentMethod: "Apple Pay",
  },
  {
    id: "10",
    amount: 75.25,
    currency: "USD",
    status: "Failed",
    description: "Product Return",
    email: "refund@gmail.com",
    date: new Date("2024-03-19T10:15:00"),
    paymentMethod: "Apple Pay",
  },
];

interface PaymentsTableProps {
  filters: FilterState;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ filters }) => {
  const filteredPayments = samplePayments.filter((payment) => {
    // Date range filter
    if (filters.dateRange.from && payment.date < filters.dateRange.from)
      return false;
    if (filters.dateRange.to && payment.date > filters.dateRange.to)
      return false;

    // Amount range filter
    if (
      filters.amountRange.min !== null &&
      payment.amount < filters.amountRange.min
    )
      return false;
    if (
      filters.amountRange.max !== null &&
      payment.amount > filters.amountRange.max
    )
      return false;

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(payment.status))
      return false;

    // Payment method filter
    if (
      filters.paymentMethod.length > 0 &&
      !filters.paymentMethod.includes(payment.paymentMethod)
    )
      return false;

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <input type="checkbox" className="rounded" />
            </TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((payment) => (
            <TableRow key={payment.id} className="hover:bg-gray-50">
              <TableCell>
                <input type="checkbox" className="rounded" />
              </TableCell>
              <TableCell className="font-medium">
                ${payment.amount.toFixed(2)} {payment.currency}
              </TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>
              </TableCell>
              <TableCell className="text-gray-600">{payment.email}</TableCell>
              <TableCell className="text-gray-600">
                {format(payment.date, "MMM dd, h:mm a")}
              </TableCell>
              <TableCell>
                <button className="text-gray-400 hover:text-gray-600">
                  •••
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No payments match your current filters.</p>
        </div>
      )}

      <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between text-sm text-gray-600">
        <div>
          {filteredPayments.length} result
          {filteredPayments.length !== 1 ? "s" : ""}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
