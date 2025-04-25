"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/loading";
import { useSearchStore } from "@/stores/searchStorage";

const Profile = ({ params }) => {
  const [userEmail, setUserEmail] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const blogsPerPage = 9;

  const { search } = useSearchStore();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);

      const { id } = await params;
      let url = `http://localhost:3000/api/blogs?author=${id}`;

      if (search.trim().length > 0) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setBlogs(data.blogs || []);
      if (data.blogs && data.blogs.length > 0) {
        setUserEmail(data.blogs[0].author?.email || "");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, category]);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-[80px]">
      <div className="flex flex-col items-center justify-center mb-16 bg-gray-100 dark:bg-gray-700 py-8 rounded-lg">
        <div className="inline-flex items-center bg-white dark:bg-gray-800 px-6 py-4 rounded-full shadow-sm">
          <svg
            className="w-6 h-6 text-gray-500 dark:text-gray-300 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">
            {userEmail || "User email"}
          </h1>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">No blogs found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog) => (
              <Link
                href={`/blogs/${blog.id}`}
                key={blog.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow 
                bg-white dark:bg-gray-800 dark:border-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5 space-y-3">
                  {blog.category?.name && (
                    <div
                      className="bg-[#4B6BFB]/10 text-[#4B6BFB] dark:bg-[#4B6BFB]/20 dark:text-[#7B9AFF] 
                      font-semibold text-xs tracking-wider inline-block px-2 py-1 rounded-md
                      hover:bg-[#4B6BFB]/20 dark:hover:bg-[#4B6BFB]/30 transition-colors"
                    >
                      {blog.category.name}
                    </div>
                  )}
                  <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white hover:text-[#4B6BFB] dark:hover:text-[#7B9AFF] transition-colors">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-3 pt-2">
                    {blog.thumbnail && (
                      <img
                        src={blog.thumbnail}
                        alt={blog.title || "Author"}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm 
                        dark:border-gray-500 hover:border-[#4B6BFB] dark:hover:border-[#7B9AFF]
                        hover:scale-105 transition-all duration-300 cursor-pointer"
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
                </div>
              </Link>
            ))}
          </div>

          {blogs.length > blogsPerPage && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &larr; Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                      currentPage === number
                        ? "bg-[#4B6BFB] border-[#4B6BFB] text-white"
                        : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Profile;
