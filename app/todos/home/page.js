"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import DeleteBtn from "@/components/delete-button"
import Loading from "@/components/loading"
import { useFetchData } from "@/hooks/useFetchData"
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { blogs } from "../../../data"
import Image from "next/image"

export default function Homepage() {
  const [changeDetected, setChangeDetected] = useState(false)
  const { data: todos, loading, error } = useFetchData({ url: "/api/todos", options: { method: "GET" }, trigger: changeDetected })

  if (loading) return <Loading />
  if (error) return <p>Error: {JSON.stringify(error)}</p>

  return (
    <div className="w-full h-screen p-10">
      <div className="w-full flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Todos</h1>
        <Link className="bg-black text-white font-semibold px-3 py-2" href="/todos/add">Add New Todo</Link>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-5">

        {todos.map((todo) => <div className="relative w-full h-[100px] border border-gray-300 p-5 rounded-md" key={todo.id}>
          <h2 className="font-bold text-xl">{todo.title}</h2>
          <p>{todo.description}</p>

          <div className="absolute top-3 right-3 flex gap-3 items-center">
            <Link href={`/todos/edit/${todo.id}`}>
              <Pencil className="hover:cursor-pointer" size={18} />
            </Link>
            <DeleteBtn id={todo.id} setChangeDetected={setChangeDetected} toast={toast} />
          </div>
        </div>)}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="grid grid-cols-3 gap-5">
          {
            blogs.map((blog) => (
              <div key={blog.id} className="size-[200px]">
                <img className="w-full h-full" src={blog.thumbnail} alt={blog.thumbnail}/>
                <h2 className="text-xl font-bold">{blog.title}</h2>
               
                <Link href={`/blogs/${blog.id}`} className="text-blue-500">Read more</Link>
              </div>
            ))
          }
      </div>
    </div>
  )
}
