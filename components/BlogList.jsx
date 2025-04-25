"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useSearchStore } from "@/stores/searchStorage";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { search = "", setSearch } = useSearchStore();

  const fetchBlogs = async (pageNum, append = false) => {
    try {
      setLoading(true);
      let url = `/api/blogs?page=${pageNum}&pageSize=${pageSize}`;

      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      if (search.trim().length > 0) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.blogs.length === 0) {
        setHasMore(false);
      } else if (append) {
        setBlogs((prev) => [...prev, ...data.blogs]);
      } else {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setBlogs([]);
    setHasMore(true);
    fetchBlogs(1);
  }, [category, search]);

  const loadMoreEvent = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage, true);
  };

  if (loading && blogs.length === 0) {
    return <Loading />;
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-8">
        No blogs found
        {category ? ` in category "${category}"` : ""}
        {search.trim() ? ` matching "${search}"` : ""}.
      </div>
    );
  }

  const [featuredBlog, ...regularBlogs] = blogs;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-[80px]">
      {featuredBlog && (
        <div className="mb-16 relative h-[600px] rounded-lg overflow-hidden">
          <Link href={`/blogs/${featuredBlog.id}`}>
            {featuredBlog.thumbnail ? (
              <div className="absolute inset-0 z-0">
                <img
                  src={featuredBlog.thumbnail}
                  alt={featuredBlog.title || "Featured blog"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
            )}

            <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
              {featuredBlog.category?.name && (
                <div className="bg-[#4B6BFB] text-white font-medium text-sm mb-4 w-fit py-[6px] px-4 rounded-md tracking-wider">
                  {featuredBlog.category.name}
                </div>
              )}

              <h1 className="text-5xl font-bold mb-6 max-w-3xl leading-tight">
                {featuredBlog.title || "Untitled Blog"}
              </h1>

              {featuredBlog.author?.email && (
                <div className="flex items-center gap-3 pt-2">
                  {featuredBlog.thumbnail && (
                    <img
                      src={featuredBlog.thumbnail}
                      alt={featuredBlog.title || "Author"}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm 
                          dark:border-gray-500
                          hover:border-[#4B6BFB] dark:hover:border-[#7B9AFF]
                          hover:scale-105 
                          transition-all duration-300 cursor-pointer"
                    />
                  )}
                  <span className="text-[20px] text-gray-200 dark:text-gray-400 hover:text-[#4B6BFB] dark:hover:text-[#7B9AFF] transition-colors">
                    {featuredBlog.author?.email || "Unknown author"}
                  </span>

                  <span className="text-[20px] text-gray-200 dark:text-gray-400 hover:text-[#4B6BFB] dark:hover:text-[#7B9AFF] transition-colors">
                    {featuredBlog.created_at &&
                      new Date(featuredBlog.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {regularBlogs.map((blog) => (
          <Link
            href={`/blogs/${blog.id}`}
            key={blog.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
              bg-white dark:bg-gray-800 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            {blog.thumbnail ? (
              <img
                src={blog.thumbnail}
                alt={blog.title || "Blog image"}
                className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-[220px] bg-gray-200 dark:bg-gray-700"></div>
            )}

            <div className="p-5 space-y-3">
              {blog.category?.name && (
                <div className="bg-[#4B6BFB]/10 text-[#4B6BFB] dark:bg-[#4B6BFB]/20 dark:text-[#7B9AFF] font-semibold text-xs tracking-wider inline-block px-2 py-1 rounded-md hover:bg-[#4B6BFB]/20 dark:hover:bg-[#4B6BFB]/30 transition-colors">
                  {blog.category.name}
                </div>
              )}

              <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white hover:text-[#4B6BFB] dark:hover:text-[#7B9AFF] transition-colors">
                {blog.title || "Blog"}
              </h2>

              {blog.author?.email && (
                <div className="flex items-center gap-3 pt-2">
                  {blog.thumbnail && (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title || "Author"}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm 
                          dark:border-gray-500
                          hover:border-[#4B6BFB] dark:hover:border-[#7B9AFF]
                          hover:scale-105 
                          transition-all duration-300 cursor-pointer"
                    />
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    {blog.author?.email || "Unknown author"}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    {blog.created_at &&
                      new Date(blog.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreEvent}
            disabled={loading}
            className="px-6 py-3 border-[2px] border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
