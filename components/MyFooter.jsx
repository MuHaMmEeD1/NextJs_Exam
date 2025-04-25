"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LogoBlack from "@/public/Logo_black.svg";
import LogoWhite from "@/public/Logo_white.svg";
import { usePathname, useSearchParams } from "next/navigation";

const MyFooter = () => {
  const [categories, setCategories] = useState([]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.location.hash === "#contact") {
      const contactElement = document.getElementById("contact");
      if (contactElement) {
        setTimeout(() => {
          contactElement.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div id="contact" className="space-y-4 scroll-mt-20">
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="text-sm">
              Have questions or want to get in touch? Contact us using the
              information below.
            </p>
            <div className="space-y-1 text-sm">
              <p>Email: info@jstemplate.net</p>
              <p>Phone: 880123.456789</p>
              <p>Address: 123 Main Street, City, Country</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Link</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/blogs/add"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Write a Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    My Blogs
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Category</h3>
              <ul className="space-y-2 text-sm">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`?category=${category.id}`}
                      className="hover:text-gray-900 dark:hover:text-white"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="hidden dark:block">
              <Image
                src={LogoWhite}
                alt="Net aBlog Logo"
                width={100}
                height={30}
                priority
              />
            </div>
            <div className="dark:hidden">
              <Image
                src={LogoBlack}
                alt="Net aBlog Logo"
                width={100}
                height={30}
                priority
              />
            </div>
          </div>
          <div className="text-sm mb-4 md:mb-0">
            © JS Template {new Date().getFullYear()}. All Rights Reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <a
              href="/terms"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Terms of Use
            </a>
            <a
              href="/privacy"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/cookies"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MyFooter;
