
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addGuestToWaitlist } from "@/lib/waitlistService";

const guestFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  party_size: z.number().min(1, "Party size must be at least 1").max(20, "Party size cannot exceed 20"),
  notes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

interface GuestWaitlistFormProps {
  waitlistId: string;
  waitlistName: string;
  businessName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function GuestWaitlistForm({ 
  waitlistId, 
  waitlistName, 
  businessName, 
  onSuccess, 
  onCancel 
}: GuestWaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      party_size: 1,
      notes: "",
    },
  });

  const onSubmit = async (data: GuestFormData) => {
    setIsSubmitting(true);
    try {
      await addGuestToWaitlist(waitlistId, {
        name: data.name,
        phone: data.phone || undefined,
        email: data.email || undefined,
        party_size: data.party_size,
        notes: data.notes || undefined,
      });

      toast({
        title: "Added to Waitlist!",
        description: `You've been successfully added to ${waitlistName} at ${businessName}.`,
      });

      onSuccess();
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast({
        title: "Failed to Join",
        description: "Could not add you to the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">{businessName}</h2>
        <p className="text-muted-foreground">
          Join the waitlist for {waitlistName}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="party_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party Size *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="20" 
                    placeholder="Number of people"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requests or notes..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Waitlist
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
