
import React, { useState, useEffect } from "react";
import { getInvoices } from "@/lib/subscriptionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  number: string;
  status: string;
  amount_paid: number;
  currency: string;
  created: number;
  invoice_pdf: string;
  hosted_invoice_url: string;
}

export const InvoicesList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await getInvoices();
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load invoices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for invoices without Stripe integration
  const mockInvoices: Invoice[] = [
    {
      id: 'inv_mock1',
      number: 'INV-001',
      status: 'paid',
      amount_paid: 1999,
      currency: 'inr',
      created: Date.now() - 86400000 * 30, // 30 days ago
      invoice_pdf: '#',
      hosted_invoice_url: '#'
    },
    {
      id: 'inv_mock2',
      number: 'INV-002',
      status: 'paid',
      amount_paid: 1999,
      currency: 'inr',
      created: Date.now() - 86400000 * 60, // 60 days ago
      invoice_pdf: '#',
      hosted_invoice_url: '#'
    }
  ];

  // Format currency display
  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbol = currency === 'inr' ? '₹' : '$';
    return `${currencySymbol}${(amount / 100).toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : invoices.length > 0 || mockInvoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Use mock data instead of real invoices for now */}
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{format(new Date(invoice.created), "MMM d, yyyy")}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount_paid, invoice.currency)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Download</span>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">View</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No invoices found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
