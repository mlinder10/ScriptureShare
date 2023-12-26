import Bible from "@/models/Bible";
import Book from "@/models/Book";
import Chapter from "@/models/Chapter";
import User from "@/models/User";
import { randomUUID } from "crypto";

export const bibleRootUrl = "https://api.scripture.api.bible/v1/bibles";

export const defaultBible = new Bible(
  "de4e12af7f28f599-02",
  "engKJV",
  "KJV",
  "King James (Authorized) Version",
  "King James Version",
  "Protestant",
  "Protestant",
  "text"
);

export const defaultBook = new Book(
  "GEN",
  "de4e12af7f28f599-02",
  "Gen",
  "Genesis",
  "The First Book of Moses, called Genesis"
);

export const defaultChapter = new Chapter(
  "GEN.1",
  "de4e12af7f28f599-02",
  "1",
  "GEN",
  [],
  "Genesis 1",
  31,
  {
    id: "GEN.2",
    number: "2",
    bookId: "GEN",
  },
  {
    id: "",
    number: "",
    bookId: "",
  }
);

export function createDefaultUser(
  name: string,
  email: string,
  password: string
) {
  return new User(
    randomUUID(),
    name,
    email,
    password,
    [],
    [],
    defaultBible,
    defaultBook,
    defaultChapter
  );
}
