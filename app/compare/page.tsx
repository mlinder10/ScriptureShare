"use client";
import Content from "@/components/Content";
import { defaultBible, defaultChapter } from "@/config/constants";
import { AuthContext } from "@/contexts/AuthContext";
import Bible from "@/models/Bible";
import Chapter from "@/models/Chapter";
import { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import Book from "@/models/Book";

export default function Compare() {
  const { user } = useContext(AuthContext);
  const [leftBible, setLeftBible] = useState<Bible>(user?.bible ?? defaultBible);
  const [rightBible, setRightBible] = useState(defaultBible);
  const [chapter, setChapter] = useState(user?.chapter ?? defaultChapter);
  const [leftContent, setLeftContent] = useState<string[][]>([]);
  const [rightContent, setRightContent] = useState<string[][]>([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/compare", {
          headers: {
            leftBibleId: leftBible.id,
            rightBibleId: rightBible.id,
            chapterId: chapter.id,
          },
        });
        const data = await res.json();
        setLeftContent(data.left.content);
        setRightContent(data.right.content);
        console.log(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }
    fetchContent();
  }, [leftBible, chapter, rightBible]);

  return (
    <main className={styles.main}>
      <div>
        <button>Left Bible</button>
        <button>Right Bible</button>
        <button>Chapter</button>
      </div>
      <div className={styles["content-container"]}>
        <Content content={leftContent} selected={[]} handleSelect={() => {}} />
        <Content
          content={rightContent}
          selected={[]}
          handleSelect={() => {}}
        />
      </div>
    </main>
  );
}

type BibleSelectModalProps = {
  isOpen: boolean;
  close: () => void;
  fetchContent: () => void;
};

function BibleSelectModal({
  isOpen,
  close,
  fetchContent,
}: BibleSelectModalProps) {
  const { user } = useContext(AuthContext);
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    async function fetchBibles() {
      try {
        const res = await fetch(`/api/read?type=bible`);
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setBibles(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }

    async function fetchBooks() {
      try {
        const res = await fetch(
          `/api/read?type=book&bibleId=${user?.bible.id}`
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setBooks(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }
    if (isOpen) {
      fetchBibles();
      fetchBooks();
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchChapters() {
      if (selectedBook === null) return;
      try {
        const res = await fetch(
          `/api/read?type=chapter&bibleId=${user?.bible.id}&bookId=${selectedBook.id}`
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setChapters(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }
    if (isOpen && selectedBook !== null) fetchChapters();
  }, [isOpen, selectedBook]);

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : null}`}>
      <button onClick={close}>Close</button>
      <div>
        {bibles.map((bible) => (
          <div key={bible.id}>{bible.abbreviationLocal}</div>
        ))}
      </div>
      <div>
        {bibles.map((bible) => (
          <div key={bible.id}>{bible.abbreviationLocal}</div>
        ))}
      </div>
      <div>
        {books.map((book) => (
          <div key={book.id}>{book.name}</div>
        ))}
      </div>
      <div>
        {chapters.map((chapter) => (
          <div key={chapter.id}>{chapter.number}</div>
        ))}
      </div>
    </div>
  );
}
