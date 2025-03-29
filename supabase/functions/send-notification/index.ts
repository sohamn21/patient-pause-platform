
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { userId, phoneNumber, email, message, subject, waitlistId, entryId, type } = await req.json();

    if (!userId || !message || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending notification to user ${userId} with message: ${message}`);

    // Store notification in database
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title: type === "waitlist" ? "Waitlist Update" : "Notification",
        message: message,
        type: type,
      })
      .select()
      .single();

    if (notificationError) {
      console.error("Error storing notification:", notificationError);
      throw notificationError;
    }

    // If there's a phone number, we would send an SMS here
    // For now, we'll just log it (you'd integrate with Twilio or a similar service)
    if (phoneNumber) {
      console.log(`Would send SMS to ${phoneNumber} with message: ${message}`);
      // In a real implementation, call SMS API here
    }

    // If there's an email, we would send an email here
    if (email && subject) {
      console.log(`Would send email to ${email} with subject: ${subject} and message: ${message}`);
      // In a real implementation, call Email API here
    }

    // Update waitlist entry status if this is a waitlist notification
    if (waitlistId && entryId && type === "waitlist") {
      const { error: updateError } = await supabase
        .from("waitlist_entries")
        .update({ status: "notified" })
        .eq("id", entryId);

      if (updateError) {
        console.error("Error updating waitlist entry:", updateError);
        // We don't throw here since the notification was already created
      }
    }

    return new Response(
      JSON.stringify({ success: true, notification }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-notification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
