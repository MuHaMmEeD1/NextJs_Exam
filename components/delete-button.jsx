"use client"

import { Trash2 } from "lucide-react"

const DeleteBtn = ({id, setChangeDetected, toast}) => {

  const handleDelete = async () => {
    setChangeDetected(prev => !prev)
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      toast.success("Todo deleted successfully")
    } else {
      toast.error("Error deleting todo")
    }
  }

  return (
   <button onClick={handleDelete}>
     <Trash2 className="hover:cursor-pointer" size={18}/>
   </button>
  )
}

export default DeleteBtn