"use client"
import Navbar from "@/components/Navbar";
import User from "@/models/User";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  update: (user: User) => void;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
};

const defaultAuthContext = {
  user: null,
  update: () => {},
  login: () => {},
  register: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

type AuthContextProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const localUser =
      user ??
      User.construct(
        JSON.parse(localStorage.getItem(User.LOCAL_USER_KEY) ?? "null")
      );
    if (user === null) setUser(localUser)

    if (pathname.includes("/auth") && localUser) {
      router.replace("/");
    }

    if (!pathname.includes("/auth") && localUser === null) {
      router.replace("/auth/login");
    }
  }, [pathname, user]);

  function update(user: User) {
    setUser(User.construct(user));
    localStorage.setItem(User.LOCAL_USER_KEY, JSON.stringify(user));
  }

  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth", {
        headers: {
          email,
          password,
        },
      });
      const data = await res.json();
      if (!res.ok) return
      setUser(User.construct(data));
      localStorage.setItem(User.LOCAL_USER_KEY, JSON.stringify(data));
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });
      const data = await res.json();
      console.log(data)
      setUser(User.construct(data));
      localStorage.setItem(User.LOCAL_USER_KEY, JSON.stringify(data));
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  function logout() {
    localStorage.removeItem(User.LOCAL_USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, update, login, register, logout }}>
      {pathname.includes("/auth") ? (
        <>{children}</>
      ) : (
        <>
          <Navbar />
          <div style={{ marginTop: "7em" }}>{children}</div>
        </>
      )}
    </AuthContext.Provider>
  );
}
