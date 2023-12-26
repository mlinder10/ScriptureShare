"use client";
import { AuthContext } from "@/contexts/AuthContext";
import User from "@/models/User";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext)

  return (
    <main>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => login(email, password)}>Login</button>
      <Link href="/auth/register">Register</Link>
    </main>
  );
}
