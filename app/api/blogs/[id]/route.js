import { createClient } from "@/utils/supabase/server";

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("blogs")
    .select("*, author(*), category(*)")
    .eq("id", id)
    .single();

  if (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching blog",
        error,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  if (!data) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Blog not found",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "OK",
      blog: data,
      userId: user.data?.user?.id,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function PUT(request, { params }) {
  try {
    const blog = await request.json();
    const { id } = await params;

    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data?.user?.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    if (!blog.title || !blog.body || !blog.category || !blog.thumbnail) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields (title, body, category, thumbnail)",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: blog.title,
        body: blog.body,
        category: blog.category,
        thumbnail: blog.thumbnail,
      })
      .eq("id", id)
      .eq("author", user.data.user.id)
      .select();

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error updating blog",
          error,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Blog not found or not authorized to update",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Blog updated successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data?.user?.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized - Please log in",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const { data: existingBlog, error: fetchError } = await supabase
      .from("blogs")
      .select("id, author")
      .eq("id", id)
      .single();

    if (fetchError || !existingBlog) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Blog not found",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    if (existingBlog.author !== user.data.user.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Forbidden - You can only delete your own blogs",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    const { error: deleteError } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to delete blog",
          error: deleteError.message,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Blog deleted successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
