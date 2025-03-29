
import React, { useState, useEffect } from "react";
import { getInvoices } from "@/lib/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DownloadCloud, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type Invoice = {
  id: string;
  number: string;
  status: string;
  amount_due: number;
  currency: string;
  created: string;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
};

export const BillingHistory = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const { invoices: data } = await getInvoices();
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load invoice history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Paid</Badge>;
      case 'open':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Open</Badge>;
      case 'void':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Void</Badge>;
      case 'uncollectible':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Uncollectible</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <BlurCard>
        <BlurCardHeader>
          <BlurCardTitle>Billing History</BlurCardTitle>
        </BlurCardHeader>
        <BlurCardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </BlurCardContent>
      </BlurCard>
    );
  }

  return (
    <BlurCard>
      <BlurCardHeader>
        <BlurCardTitle>Billing History</BlurCardTitle>
      </BlurCardHeader>
      <BlurCardContent>
        {invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{format(new Date(invoice.created), "MMM d, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount_due, invoice.currency)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {invoice.invoice_pdf && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(invoice.invoice_pdf!, "_blank")}
                        className="inline-flex items-center gap-1"
                      >
                        <DownloadCloud size={14} />
                        PDF
                      </Button>
                    )}
                    {invoice.hosted_invoice_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(invoice.hosted_invoice_url!, "_blank")}
                        className="inline-flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No invoices found</p>
            <p className="text-sm mt-1">Invoices will appear here after your first payment</p>
          </div>
        )}
      </BlurCardContent>
    </BlurCard>
  );
};
