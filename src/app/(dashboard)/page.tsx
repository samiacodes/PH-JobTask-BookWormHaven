import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // If not logged in, redirect to login
    redirect("/login");
  }
  
  // Redirect based on role
  if (session.user?.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/user/dashboard");
  }
}