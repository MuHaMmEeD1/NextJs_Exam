"use client";

import { useEffect } from "react";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";

export default function TextEditor({ value, onChange }) {
  useEffect(() => {
    console.log("Current HTML content:", value);
  }, [value]);

  return (
    <div className="w-full max-w-[770px] h-[360px] border-[1px] border-zinc-300 rounded-[2px]">
      <SimpleEditor setBlogBody={onChange} content={value} />
    </div>
  );
}
