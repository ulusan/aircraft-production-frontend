import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");

    // If no token, redirect to login page
    if (!token && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [router]);

  return <Component {...pageProps} />;
}
