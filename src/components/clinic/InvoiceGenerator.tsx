
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '@/types/clinic';
import { generatePatientInvoice } from '@/lib/clinicService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, Trash2, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface InvoiceGeneratorProps {
  patient: Patient;
  onSuccess?: () => void;
}

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive')
});

const invoiceFormSchema = z.object({
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  invoiceDate: z.date(),
  dueDate: z.date().optional(),
  notes: z.string().optional()
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export const InvoiceGenerator = ({ patient, onSuccess }: InvoiceGeneratorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any | null>(null);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      items: [{ description: '', amount: 0 }],
      invoiceDate: new Date(),
      notes: ''
    }
  });

  const { fields, append, remove } = form.control._formValues.items;

  const onSubmit = async (data: InvoiceFormValues) => {
    if (!patient.id) {
      toast({
        title: 'Error',
        description: 'Patient ID is required to generate an invoice',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const invoice = await generatePatientInvoice(
        patient.id,
        data.items,
        data.invoiceDate,
        data.dueDate
      );

      setGeneratedInvoice(invoice);
      
      toast({
        title: 'Success',
        description: 'Invoice generated successfully'
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invoice',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = () => {
    if (!generatedInvoice) return;
    
    // Create a formatted invoice text
    const patientName = `${patient.profile?.first_name || ''} ${patient.profile?.last_name || ''}`.trim();
    let invoiceText = `INVOICE\n\n`;
    invoiceText += `Patient: ${patientName}\n`;
    invoiceText += `Date: ${format(new Date(generatedInvoice.invoice_date), 'PPP')}\n`;
    if (generatedInvoice.due_date) {
      invoiceText += `Due Date: ${format(new Date(generatedInvoice.due_date), 'PPP')}\n`;
    }
    invoiceText += '\n';
    
    invoiceText += 'ITEMS:\n';
    generatedInvoice.items.forEach((item: any, index: number) => {
      invoiceText += `${index + 1}. ${item.description}: $${item.amount.toFixed(2)}\n`;
    });
    
    invoiceText += `\nTotal Amount: $${generatedInvoice.total_amount.toFixed(2)}\n`;
    invoiceText += `Status: ${generatedInvoice.status}\n`;
    
    if (generatedInvoice.notes) {
      invoiceText += `\nNotes: ${generatedInvoice.notes}\n`;
    }
    
    // Create and download a file
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${patientName.replace(/\s+/g, '_')}_${format(new Date(generatedInvoice.invoice_date), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const addItem = () => {
    form.setValue('items', [
      ...form.getValues('items'),
      { description: '', amount: 0 }
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    if (currentItems.length > 1) {
      const newItems = [...currentItems];
      newItems.splice(index, 1);
      form.setValue('items', newItems);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Invoice</CardTitle>
        <CardDescription>
          Generate an invoice for {patient.profile?.first_name} {patient.profile?.last_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedInvoice ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Invoice #{generatedInvoice.id || 'New'}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generated on {format(new Date(generatedInvoice.invoice_date), 'PPP')}
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Patient</h4>
                  <p>{generatedInvoice.patient_name}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Items</h4>
                  <ul className="space-y-2">
                    {generatedInvoice.items.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.description}</span>
                        <span>${item.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${generatedInvoice.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                
                {generatedInvoice.due_date && (
                  <div>
                    <h4 className="font-medium">Due Date</h4>
                    <p>{format(new Date(generatedInvoice.due_date), 'PPP')}</p>
                  </div>
                )}
                
                {generatedInvoice.notes && (
                  <div>
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm">{generatedInvoice.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={downloadInvoice}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            
            <Button 
              className="w-full" 
              onClick={() => setGeneratedInvoice(null)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create New Invoice
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {form.getValues('items').map((item, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1">
                      <FormLabel htmlFor={`items.${index}.description`}>
                        Description
                      </FormLabel>
                      <Input
                        id={`items.${index}.description`}
                        {...form.register(`items.${index}.description`)}
                        placeholder="Service or item description"
                      />
                      {form.formState.errors.items?.[index]?.description && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.items[index]?.description?.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="w-1/4">
                      <FormLabel htmlFor={`items.${index}.amount`}>
                        Amount ($)
                      </FormLabel>
                      <Input
                        id={`items.${index}.amount`}
                        type="number"
                        step="0.01"
                        min="0"
                        {...form.register(`items.${index}.amount`, {
                          valueAsNumber: true,
                        })}
                        placeholder="0.00"
                      />
                      {form.formState.errors.items?.[index]?.amount && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.items[index]?.amount?.message}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={form.getValues('items').length <= 1}
                      className="text-destructive h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Invoice"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
