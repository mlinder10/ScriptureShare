"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import { AuthContext } from "@/contexts/AuthContext";
import Note from "@/models/Note";
import NoteCell from "@/components/NoteCell";

export default function Account() {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function fetchNotes() {
      if (user === null) return;
      try {
        const res = await fetch("/api/notes", {
          headers: { uid: user?.uid },
        });
        const data = await res.json();
        setNotes(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }
    fetchNotes();
  }, [user]);

  return (
    <main className={styles.main}>
      <div>
        <h1>{user?.name}</h1>
      </div>
      <div>
        {notes.map((note) => (
          <NoteCell key={note.pid} note={Note.construct(note)} />
        ))}
      </div>
    </main>
  );
}
