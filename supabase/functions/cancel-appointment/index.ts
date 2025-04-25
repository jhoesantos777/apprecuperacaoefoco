
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    if (userError || !user) throw new Error("User not authenticated");

    const { appointmentId } = await req.json();

    const { data: appointment } = await supabaseClient
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .eq("user_id", user.id)
      .single();

    if (!appointment) throw new Error("Appointment not found");

    const appointmentDate = new Date(`${appointment.appointment_date} ${appointment.start_time}`);
    const now = new Date();
    const diffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      throw new Error("Cannot cancel appointments less than 24 hours before");
    }

    if (appointment.payment_id) {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2023-10-16",
      });
      
      await stripe.refunds.create({
        payment_intent: appointment.payment_id,
      });
    }

    const { error: updateError } = await supabaseClient
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointmentId);

    if (updateError) throw updateError;

    const { error: slotUpdateError } = await supabaseClient
      .from("available_slots")
      .update({ is_available: true })
      .eq("id", appointment.slot_id);

    if (slotUpdateError) throw slotUpdateError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
