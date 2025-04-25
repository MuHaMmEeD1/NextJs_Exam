import Link from "next/link";

const BlogDetails = async ({ params }) => {
  const { id } = await params;

  try {
    const response = await fetch(`http://localhost:3000/api/blogs/${id}`);
    const result = await response.json();

    if (!result.success || !result.blog) {
      return <div className="max-w-4xl mx-auto px-4 py-8">Blog not found</div>;
    }

    const blog = result.blog;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        {blog.category?.name && (
          <div className="bg-[#4B6BFB] text-white font-medium text-xs px-3.5 py-2 rounded-md inline-block mb-4 uppercase tracking-wider dark:bg-[#4B6BFB]/90 dark:hover:bg-[#4B6BFB] transition-colors duration-300">
            {blog.category.name}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight dark:text-white">
          {blog.title.split(":")[0]}
          {blog.title.split(":").length > 1 && (
            <>
              <br />
              <span className="text-gray-600 dark:text-gray-300">
                {blog.title.split(":")[1]}
              </span>
            </>
          )}
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-4 group">
            {blog.author?.thumbnail && (
              <img
                src={blog.author.thumbnail}
                alt={blog.author.name || "Author"}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm 
                  dark:border-gray-700
                  group-hover:border-[#4B6BFB] dark:group-hover:border-[#7B9AFF]
                  group-hover:scale-105 
                  transition-all duration-300 cursor-pointer"
              />
            )}
            <div>
              <Link
                href={`/profile/${blog.author.id}`}
                className="text-gray-500 dark:text-gray-400 group-hover:text-[#4B6BFB] dark:group-hover:text-[#7B9AFF] transition-colors duration-300"
              >
                {blog.author?.email || "Unknown author"}
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {blog.created_at &&
                  new Date(blog.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
              </p>
            </div>
          </div>
        </div>

        {blog.thumbnail && (
          <div className="relative group">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-auto rounded-lg mb-8 object-cover 
                     group-hover:opacity-95 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {blog.body && (
          <article
            className="
            [&_h1]:font-bold [&_h1]:text-3xl [&_h1]:text-gray-900 [&_h1]:dark:text-white
            [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:text-gray-800 [&_h2]:dark:text-gray-200
            [&_h3]:font-bold [&_h3]:text-xl [&_h3]:text-gray-700 [&_h3]:dark:text-gray-300
            [&_h4]:font-bold [&_h4]:text-lg [&_h4]:text-gray-700 [&_h4]:dark:text-gray-300
            [&_h5]:font-bold [&_h5]:text-base [&_h5]:text-gray-600 [&_h5]:dark:text-gray-400
            [&_h6]:font-bold [&_h6]:text-sm [&_h6]:text-gray-600 [&_h6]:dark:text-gray-400
            [&_p]:text-gray-700 [&_p]:dark:text-gray-300
            [&_p]:leading-relaxed
            [&_p]:mb-4
            [&_a]:text-[#4B6BFB] [&_a]:dark:text-[#7B9AFF] [&_a]:hover:underline
            max-w-none space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">Error loading blog</div>
    );
  }
};

export default BlogDetails;
