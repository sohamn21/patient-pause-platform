
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
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body = await req.json();
    
    // Handle email retrieval request
    if (body.action === "get-email") {
      if (!body.userId) {
        return new Response(
          JSON.stringify({ error: "Missing user ID" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Get user email from auth.users
      const { data, error } = await supabase.auth.admin.getUserById(body.userId);
      
      if (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
      
      console.log("Retrieved user data:", { 
        id: data.user?.id, 
        email: data.user?.email, 
        hasEmail: !!data.user?.email 
      });
      
      return new Response(
        JSON.stringify({ email: data.user?.email }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const { userId, phoneNumber, email, message, subject, waitlistId, entryId, type } = body;

    if (!userId || !message || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending ${type} notification to user ${userId} with message: ${message}`);
    console.log("Notification details:", {
      type,
      userId,
      email: email || "none",
      phoneNumber: phoneNumber || "none",
      subject: subject || "none",
      messagePreview: message.substring(0, 30) + "...",
    });

    // Store notification in database
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title: type === "waitlist" ? "Waitlist Update" : (type === "email" ? subject : "Notification"),
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
    if (phoneNumber && type === "waitlist") {
      console.log(`Would send SMS to ${phoneNumber} with message: ${message}`);
      // In a real implementation, call SMS API here
    }

    // If there's an email and it's an email notification type, send the email with Brevo
    if (email && subject && type === "email") {
      console.log(`Sending email to ${email} with subject: ${subject} and message: ${message}`);
      
      if (!brevoApiKey) {
        console.warn("BREVO_API_KEY not set in environment variables");
        return new Response(
          JSON.stringify({ 
            success: true, 
            notification, 
            warning: "Email not sent: Brevo API key not configured" 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      try {
        // Get user details to include in the email
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", userId)
          .single();
          
        if (userError) {
          console.warn("Could not fetch user profile:", userError);
        }
        
        const userName = userData ? 
          `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : 
          "Customer";
          
        // Call Brevo API to send email
        const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            sender: {
              name: "Table Ready",
              email: "no-reply@tableready.app", // Replace with your sender email
            },
            to: [
              {
                email: email,
                name: userName
              }
            ],
            subject: subject,
            htmlContent: `<html><body>
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #333;">Table Ready</h1>
                </div>
                <div style="padding: 20px;">
                  <p>Hello${userName ? ' ' + userName : ''},</p>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                  <p style="margin-top: 30px;">Best regards,<br>Table Ready Team</p>
                </div>
              </div>
            </body></html>`,
          }),
        });

        const emailResult = await brevoResponse.json();
        console.log("Brevo API response:", emailResult);

        if (!brevoResponse.ok) {
          throw new Error(`Brevo API error: ${JSON.stringify(emailResult)}`);
        }
      } catch (emailError) {
        console.error("Error sending email with Brevo:", emailError);
        // We don't throw here since the notification was already created
        // But we add the error to the response
        return new Response(
          JSON.stringify({ 
            success: true, 
            notification, 
            emailError: emailError.message 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Update waitlist entry status if this is a waitlist notification
    if (waitlistId && entryId && (type === "waitlist" || type === "email")) {
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
