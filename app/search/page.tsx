"use client";
import { AuthContext } from "@/contexts/AuthContext";
import SearchResponse from "@/models/SearchResponse";
import { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import { VscSearch } from "react-icons/vsc";

export default function Search() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function handleSearch() {
      try {
        const res = await fetch(`/api/search`, {
          headers: {
            input: input,
            bibleId: user?.bible.id ?? "",
          },
        });
        const data = await res.json();
        console.log(data);
        setResult(data.data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }

    let timeoutId = setTimeout(handleSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [input]);

  return (
    <main className={styles.main}>
      <div className={styles.searchbar}>
        <VscSearch className={styles.icon} />
        <input
          className={styles.input}
          type="text"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className={styles.results}>
        {result?.verses.map((verse) => (
          <div key={verse.id} className={styles.result}>
            <p className={styles.reference}>{verse.reference}</p>
            <p className={styles.text}>{verse.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
