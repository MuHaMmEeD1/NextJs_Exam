import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// export const metadata = {
//   title: "Homepage",
//   description: "This is homepage"
// }

export async function generateMetadata({ params }) {
  const {id} = await params
  const response = await fetch('https://jsonplaceholder.typicode.com/users/' + id)
  const user = await response.json()

  return {
    title: user.name
  }
}

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
        Homepage
    </div>
  );
}
