"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "../../../../components/TextEditor";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const EditBlog = ({ params }) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "",
    thumbnail: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ error: null, success: false });
  const [categories, setCategories] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const getBlog = async () => {
    try {
      const { id } = await params;
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();

      if (data.blog.author.id != data.userId) {
        router.push("/profile");
        return;
      }

      setFormData({
        title: data.blog.title || "",
        body: data.blog.body || "<p></p>",
        category: data.blog.category?.id?.toString() || "",
        thumbnail: data.blog.thumbnail || "",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  useEffect(() => {
    const isValid =
      formData.title.trim() !== "" &&
      formData.body.trim() !== "" &&
      formData.category !== "";

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (content) => {
    setFormData((prev) => ({ ...prev, body: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setStatus({ error: null, success: false });

    try {
      const { id } = params;
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: Number(formData.category),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit blog");
      }

      setStatus({ success: true, error: null });
      router.push("/profile");
    } catch (err) {
      setStatus({ error: err.message, success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <Loading type="gif" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">
            Edit Blog Post
          </h1>

          {status.success && (
            <div className="bg-green-100 dark:bg-green-900/80 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100 px-4 py-3 rounded mb-4">
              Blog post edited successfully!
            </div>
          )}

          {status.error && (
            <div className="bg-red-100 dark:bg-red-900/80 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="min-h-[300px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-white">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content *
              </label>
              <div className="min-h-[300px]">
                <TextEditor value={formData.body} onChange={handleBodyChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-4 py-2 rounded-md text-white ${
                  !isFormValid || isSubmitting
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Edit Blog Post"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditBlog;
