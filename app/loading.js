"use client";

import React from "react";
import Image from "next/image";
import gif from "../public/loading.gif";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex-1 flex items-center justify-center">
        <Image src={gif} alt="Loading..." width={64} height={64} unoptimized />
      </div>
    </div>
  );
};

export default Loading;
