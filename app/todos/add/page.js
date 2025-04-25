"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from 'react-toastify';

export default function AddTodo() {

    const handleAddTodo = async (formData) => {
        const title = formData.get("title")?.toString();
        const description = formData.get("description")?.toString();

        const res = await fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                description: description
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.ok ? toast.success("Todo created successfully") : toast.error("Failed to create todo");
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form className="flex flex-col w-[400px] border border-zinc-300 p-5 rounded-md">
                <h1 className="text-2xl font-medium">Add Todo</h1>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" name="title" placeholder="Add title for todo" required />
                    <Label htmlFor="description">Description</Label>
                    <Input
                        type="text"
                        name="description"
                        placeholder="Add description for todo"
                        required
                    />
                    <SubmitButton pendingText="Adding todo..." formAction={handleAddTodo}>
                        Add Todo
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
