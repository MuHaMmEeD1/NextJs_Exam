"use client";
import { useState, useEffect } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import { ToastContainer, toast } from 'react-toastify';

export default function EditTodo({ params }) {
    const [id, setId] = useState(null);
    const [todo, setTodo] = useState(null);

    const getTodo = async () => {
        const response = await fetch(`http://localhost:3000/api/todos/${id}`);
        const todo = await response.json();
        setTodo(todo);
    }

    async function editTodo(formData) {
        const title = formData.get("title")?.toString();
        const description = formData.get("description")?.toString();

        const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: title,
                description: description
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.ok ? toast.success("Todo updated successfully") : toast.error("Failed to update todo");
    }

    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        }
        unwrapParams();
    }, [params]);

    useEffect(() => {
        getTodo()
    }, [id])

    if (!todo) return <Loading type="txt" />

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form className="flex flex-col w-[400px] border border-zinc-300 p-5 rounded-md">
                <h1 className="text-2xl font-medium">Edit Todo</h1>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="title">Title</Label>
                    <Input defaultValue={todo.title} type="text" name="title" placeholder="Add title for todo" required />
                    <Label htmlFor="description">Description</Label>
                    <Input
                        defaultValue={todo.description}
                        type="text"
                        name="description"
                        placeholder="Add description for todo"
                        required
                    />
                    <SubmitButton pendingText="Saving todo..." formAction={editTodo}>
                        Save
                    </SubmitButton>
                </div>
            </form>
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
        </div>
    )
}
