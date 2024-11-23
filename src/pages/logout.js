import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    document.body.setAttribute("data-theme", "light");
    sessionStorage.clear();
    sessionStorage.setItem("lightTheme", "light");
    router.push('/login');
  }, [router]);

  return null; 
}