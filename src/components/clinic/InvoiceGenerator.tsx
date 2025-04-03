
import React, { useState } from 'react';
import { generatePatientInvoice } from '@/lib/clinicService';
import { Invoice } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Plus, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceGeneratorProps {
  patientId: string;
  onInvoiceGenerated?: (invoice: Invoice) => void;
}

export function InvoiceGenerator({ patientId, onInvoiceGenerated }: InvoiceGeneratorProps) {
  const { toast } = useToast();
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [items, setItems] = useState<Array<{ description: string; amount: number }>>([
    { description: '', amount: 0 }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addInvoiceItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const removeInvoiceItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems.length ? updatedItems : [{ description: '', amount: 0 }]);
  };

  const updateItemDescription = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index].description = value;
    setItems(updatedItems);
  };

  const updateItemAmount = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index].amount = parseFloat(value) || 0;
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleGenerateInvoice = async () => {
    try {
      setIsGenerating(true);
      
      // Validate inputs
      const validItems = items.filter(item => item.description && item.amount > 0);
      
      if (validItems.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one valid item with a description and amount.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }
      
      // Make sure all items have required fields
      const preparedItems = validItems.map(item => ({
        description: item.description,
        amount: item.amount
      }));
      
      const invoice = await generatePatientInvoice(
        patientId,
        preparedItems,
        invoiceDate,
        dueDate
      );
      
      toast({
        title: "Invoice Generated",
        description: `Invoice #${invoice.id} created successfully.`
      });
      
      if (onInvoiceGenerated) {
        onInvoiceGenerated(invoice);
      }
      
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Invoice</CardTitle>
        <CardDescription>Create a new invoice for this patient</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoice-date">Invoice Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="invoice-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceDate ? format(invoiceDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={invoiceDate}
                  onSelect={(date) => date && setInvoiceDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="due-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Invoice Items</Label>
            <Button size="sm" variant="outline" onClick={addInvoiceItem}>
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItemDescription(index, e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={item.amount === 0 ? '' : item.amount}
                  onChange={(e) => updateItemAmount(index, e.target.value)}
                  className="w-24"
                  min="0"
                  step="0.01"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeInvoiceItem(index)}
                  disabled={items.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-right font-medium mt-4">
            Total: ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleGenerateInvoice} disabled={isGenerating}>
          <FileText className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Invoice'}
        </Button>
      </CardFooter>
    </Card>
  );
}
