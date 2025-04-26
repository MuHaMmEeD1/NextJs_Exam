"use client";

import { useEffect, useState, useRef } from "react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef(null);
  const { search, setSearch } = useSearchStore();

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const authToken = getCookie("sb-yfskwgozkoqeoqdiivve-auth-token");
    setIsLoggedIn(!!authToken);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleLogout = () => {
    document.cookie =
      "sb-yfskwgozkoqeoqdiivve-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    window.location.href = "/sign-in";
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
            href={isLoggedIn ? "/blogs/add" : "/sign-in"}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Write a Blog
          </Link>

          <Link
            href={isLoggedIn ? "/profile" : "/sign-in"}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            My Blogs
          </Link>
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none"
              >
                <Image
                  src={DefaultProfile}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full h-8 w-8 object-cover cursor-pointer"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
