import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category");
  const author = searchParams.get("author");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;

  const supabase = await createClient();

  let query = supabase
    .from("blogs")
    .select("*, author(*), category(*)")
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (categoryId) {
    query = query.eq("category", categoryId);
  }

  if (author) {
    query = query.eq("author", author);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error Supabase",
        error,
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
      message: "OK",
      blogs: data || [],
      page,
      pageSize,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(requset) {
  const blog = await requset.json();

  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!blog.title || !blog.body || !blog.category || !blog.thumbnail) {
    return new Response(
      JSON.stringify({
        success: false,
        message:
          "Missing required fields (title, body, author, category, thumbnail)",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const { data, error } = await supabase
    .from("blogs")
    .insert([
      {
        title: blog.title,
        body: blog.body,
        author: user.data.user.id,
        category: blog.category,
        thumbnail: blog.thumbnail,
      },
    ])
    .select();

  if (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error Supabase",
        error,
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
      message: "OK",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
