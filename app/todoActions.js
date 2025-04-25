"use server"

export async function addTodo(formData) {
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
}

