"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import Content from "@/components/Content";
import Bible from "@/models/Bible";
import Book from "@/models/Book";
import Chapter from "@/models/Chapter";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { AuthContext } from "@/contexts/AuthContext";
import { VscClose } from "react-icons/vsc";

export default function Read() {
  const { user, update } = useContext(AuthContext);
  const [selected, setSelected] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchChapter(
    bibleId: string | undefined = undefined,
    chapterId: string | undefined = undefined
  ) {
    try {
      const data = await user?.fetchChapter(bibleId, chapterId);
      update(data);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  function handleSelect(num: number) {
    if (selected.length === 0) return setSelected([num, num]);
    if (selected[0] > num) return setSelected([num, selected[1]]);
    if (selected[1] < num) return setSelected([selected[0], num]);
    if (selected[0] <= num && selected[1] >= num) return setSelected([]);
  }

  function last() {
    fetchChapter(user?.bible.id, user?.chapter.previous.id);
  }

  function next() {
    fetchChapter(user?.bible.id, user?.chapter.next.id);
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles["header-btns"]}>
            <button onClick={() => setIsModalOpen(true)}>
              {user?.bible.abbreviationLocal}
            </button>
            <button onClick={() => setIsModalOpen(true)}>
              {user?.chapter.format()}
            </button>
          </div>
          <div className={styles["header-title"]}>
            <h1>{user?.bible.nameLocal}</h1>
            <h2>{user?.chapter.reference}</h2>
          </div>
          <div className={styles["post-btn"]}>
            <Link
              href={{
                pathname: "/post",
                query: { start: selected[0], end: selected[1] },
              }}
              style={{ display: selected.length === 0 ? "none" : "flex" }}
            >
              Make A Note
            </Link>
          </div>
        </div>
        <Content
          content={user?.chapter.content ?? []}
          selected={selected}
          handleSelect={handleSelect}
        />
        <div className={styles["footer-btns"]}>
          <button onClick={last}>
            <FaArrowLeft />
          </button>
          <button onClick={next}>
            <FaArrowRight />
          </button>
        </div>
      </main>
      <BibleSelectModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        fetchChapter={fetchChapter}
      />
    </>
  );
}

type BibleSelectModal = {
  isOpen: boolean;
  close: () => void;
  fetchChapter: (
    bibleId: string | undefined,
    chapterId: string | undefined
  ) => void;
};

function BibleSelectModal({ isOpen, close, fetchChapter }: BibleSelectModal) {
  const { user } = useContext(AuthContext);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

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
    <div className={`${styles.modal} ${isOpen ? styles.open : ""}`}>
      <div className={styles["close-container"]}>
        <button className={styles["close-btn"]} onClick={close}>
          <VscClose />
          <span>Close</span>
        </button>
      </div>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-bibles"]}>
          <h2>Bibles</h2>
          {bibles.map((bible) => (
            <div
              key={bible.id}
              onClick={() => fetchChapter(bible.id, undefined)}
            >
              <p className={styles["modal-name-primary"]}>
                {bible.abbreviationLocal}
              </p>
              <p className={styles["modal-name-secondary"]}>
                {bible.nameLocal}
              </p>
            </div>
          ))}
        </div>
        <div className={styles["modal-books"]}>
          <h2>Books</h2>
          {books.map((book) => (
            <div key={book.id} onClick={() => setSelectedBook(book)}>
              <p className={styles["modal-name-primary"]}>{book.name}</p>
              <p className={styles["modal-name-secondary"]}>{book.nameLong}</p>
            </div>
          ))}
        </div>
        <div className={styles["modal-chapters"]}>
          <h2>Chapters</h2>
          <div>
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => fetchChapter(undefined, chapter.id)}
              >
                {chapter.number}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
