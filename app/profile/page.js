"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/stores/searchStorage";
import { useSearchParams } from "next/navigation";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const blogsPerPage = 9;
  const router = useRouter();
  const { search, setSearch } = useSearchStore();

  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const takeUser = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserData({
        email: user.email,
        id: user.id,
      });
      await fetchBlogs(user.id);
    }
    setIsLoading(false);
  };

  const fetchBlogs = async (userId) => {
    try {
      setIsLoading(true);

      let url = `http://localhost:3000/api/blogs?author=${userId}`;

      if (search.trim().length > 0) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      setDeletingId(blogId);
      const response = await fetch(
        `http://localhost:3000/api/blogs/${blogId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
      } else {
        throw new Error("Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
    } finally {
      setDeletingId(null);
      router.refresh();
    }
  };

  const handleEdit = (blogId) => {
    router.push(`/blogs/edit/${blogId}`);
  };

  useEffect(() => {
    takeUser();
  }, [search, category]);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            {userData.email || "User email"}
          </h1>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't created any blog posts yet.
          </p>
          <Link
            href="/blogs/add"
            className="inline-flex items-center px-4 py-2 bg-[#4B6BFB] text-white rounded-lg hover:bg-[#3A56D9] transition-colors"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog) => (
              <div
                key={blog.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow 
                  bg-white dark:bg-gray-800 dark:border-gray-700
                  hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200
                  flex flex-col relative"
              >
                <div className="relative">
                  <Link href={`/blogs/${blog.id}`}>
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="absolute top-0 left-0 right-0 flex justify-between p-2">
                    <button
                      onClick={() => handleEdit(blog.id)}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(blog.id)}
                      disabled={deletingId === blog.id}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                      title="Delete"
                    >
                      {deletingId === blog.id ? (
                        <svg
                          className="animate-spin h-5 w-5 text-red-600 dark:text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600 dark:text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

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
                </div>
              </div>
            ))}
          </div>

          {blogs.length > blogsPerPage && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
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
                    className={`px-4 py-2 border rounded-lg transition-colors duration-200
                    ${
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
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
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
