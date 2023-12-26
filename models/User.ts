import { Row } from "@libsql/client";
import Bible from "./Bible";
import Book from "./Book";
import Chapter from "./Chapter";

export default class User {
  static LOCAL_USER_KEY = "ss-user";

  constructor(
    public uid: string,
    public name: string,
    public email: string,
    private password: string,
    public followers: string[],
    public following: string[],
    public bible: Bible,
    public book: Book,
    public chapter: Chapter
  ) {}

  static construct(user: User): User {
    return new User(
      user.uid,
      user.name,
      user.email,
      user.password,
      user.followers,
      user.following,
      new Bible(
        user.bible.id,
        user.bible.abbreviation,
        user.bible.abbreviationLocal,
        user.bible.name,
        user.bible.nameLocal,
        user.bible.description,
        user.bible.descriptionLocal,
        user.bible.type
      ),
      new Book(
        user.book.id,
        user.book.bibleId,
        user.book.abbreviation,
        user.book.name,
        user.book.nameLong
      ),
      new Chapter(
        user.chapter.id,
        user.chapter.bibleId,
        user.chapter.number,
        user.chapter.bookId,
        user.chapter.content,
        user.chapter.reference,
        user.chapter.verseCount,
        user.chapter.next,
        user.chapter.previous
      )
    );
  }

  static fromRow(row: Row | undefined): User | null {
    if (
      !row ||
      typeof row.uid !== "string" ||
      typeof row.name !== "string" ||
      typeof row.email !== "string" ||
      typeof row.password !== "string" ||
      typeof row.followers !== "string" ||
      typeof row.following !== "string" ||
      typeof row.bible !== "string" ||
      typeof row.book !== "string" ||
      typeof row.chapter !== "string"
    ) {
      return null;
    }
    return new User(
      row.uid,
      row.name,
      row.email,
      row.password,
      JSON.parse(row.followers),
      JSON.parse(row.following),
      Bible.fromJsonString(row.bible),
      Book.fromJsonString(row.book),
      Chapter.fromJsonString(row.chapter)
    );
  }

  getLines(start: number, end: number) {
    return this.chapter.content.flatMap((line) => line).slice(start - 1, end);
  }

  async fetchChapter(
    bibleId: string | undefined,
    chapterId: string | undefined
  ) {
    try {
      const res = await fetch("/api/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: this,
          bibleId: bibleId ?? this.bible.id,
          chapterId: chapterId ?? this.chapter.id,
        }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(err?.message);
    }
  }
}
