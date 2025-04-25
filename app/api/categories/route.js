import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Supabase Error",
        error: error,
      }),
      {
        headers: { "Content-type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Ok",
      categories: data,
    }),
    {
      headers: { "Content-type": "application/json" },
    }
  );
}
