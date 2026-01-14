'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "loading") return;
    
    if (session?.user) {
      // Check if we're on wrong page for user role
      const pathname = window.location.pathname;
      
      if (session.user.role === 'admin' && !pathname.startsWith('/admin')) {
        router.push('/admin');
      } 
      else if (session.user.role === 'user' && pathname.startsWith('/admin')) {
        router.push('/user/library');
      }
    }
  }, [session, status, router]);
  
  return null; // This component doesn't render anything
}