"use client";
import { AuthContext } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import styles from "./page.module.css";

export default function Post() {
  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const start = parseInt(searchParams.get("start") || "0");
  const end = parseInt(searchParams.get("end") || "0");
  const verses = user?.getLines(start, end);
  const [input, setInput] = useState("");

  async function post() {
    if (user === null || input === "" || !verses || verses.length === 0) return;
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          content: input,
          verses,
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  return (
    <main className={styles.main}>
      <h1>
        {user?.chapter.format()}: {start === end ? start : `${start}-${end}`}
      </h1>
      <p>{verses}</p>
      <textarea
        rows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add note..."
        className={styles.textarea}
      />
      <button onClick={post}>Post</button>
    </main>
  );
}
