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
  const [topBible, setTopBible] = useState<Bible>(user?.bible ?? defaultBible);
  const [bottomBible, setBottomBible] = useState(defaultBible);
  const [chapter, setChapter] = useState(user?.chapter ?? defaultChapter);
  const [topContent, setTopContent] = useState<string[][]>([]);
  const [bottomContent, setBottomContent] = useState<string[][]>([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/compare", {
          headers: {
            topBibleId: topBible.id,
            bottomBibleId: bottomBible.id,
            chapterId: chapter.id,
          },
        });
        const data = await res.json();
        setTopContent(data.top.content);
        setBottomContent(data.bottom.content);
        console.log(data);
      } catch (err: any) {
        console.error(err?.message);
      }
    }
    fetchContent();
  }, [topBible, chapter, bottomBible]);

  return (
    <main className={styles.main}>
      <div>
        <button>Left Bible</button>
        <button>Right Bible</button>
        <button>Chapter</button>
      </div>
      <div className={styles["content-container"]}>
        <Content content={topContent} selected={[]} handleSelect={() => {}} />
        <Content
          content={bottomContent}
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
          <div>{bible.abbreviationLocal}</div>
        ))}
      </div>
      <div>
        {bibles.map((bible) => (
          <div>{bible.abbreviationLocal}</div>
        ))}
      </div>
      <div>
        {books.map((book) => (
          <div>{book.name}</div>
        ))}
      </div>
      <div>
        {chapters.map((chapter) => (
          <div>{chapter.number}</div>
        ))}
      </div>
    </div>
  );
}
