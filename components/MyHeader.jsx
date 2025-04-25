"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import LogoBlack from "@/public/Logo_black.svg";
import LogoWhite from "@/public/Logo_white.svg";
import DefaultProfile from "@/public/Profile.svg";
import { useSearchStore } from "@/stores/searchStorage";

const MyHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { search, setSearch } = useSearchStore();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const res = localStorage.getItem("auth-storage");
    setIsLoggedIn(!!res);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearch(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="hidden dark:block">
            <Image
              src={LogoWhite}
              alt="MetaBlog Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="block dark:hidden">
            <Image
              src={LogoBlack}
              alt="MetaBlog Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/blogs/add"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Write a Blog
          </Link>
          {isLoggedIn && (
            <Link
              href="/profile"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              My Blogs
            </Link>
          )}
          <Link
            href="#contact"
            scroll={false}
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <MagnifyingGlassIcon
              className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer"
              onClick={handleSearchSubmit}
            />
          </div>

          <ThemeToggle />
          {isLoggedIn ? (
            <Link href="/profile/">
              <Image
                src={DefaultProfile}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full h-8 w-8 object-cover"
              />
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MyHeader;
