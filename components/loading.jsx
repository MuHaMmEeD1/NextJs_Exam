"use client";

import React from "react";
import loading from "@/public/loading.gif";
import Image from "next/image";

const Loading = ({ type }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {type === "txt" ? (
        <p className="text-2xl font-semibold">Loading...</p>
      ) : (
        <Image className="w-12 h-12" src={loading} alt="loading gif" />
      )}
    </div>
  );
};

export default Loading;
