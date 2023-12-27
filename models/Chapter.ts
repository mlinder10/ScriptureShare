export default class Chapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  content: string[][];
  reference: string;
  verseCount: number;
  next: {
    id: string;
    number: string;
    bookId: string;
  };
  previous: {
    id: string;
    number: string;
    bookId: string;
  };

  constructor(
    id: string,
    bibleId: string,
    number: string,
    bookId: string,
    content: string[][],
    reference: string,
    verseCount: number,
    next: {
      id: string;
      number: string;
      bookId: string;
    },
    previous: {
      id: string;
      number: string;
      bookId: string;
    }
  ) {
    this.id = id;
    this.bibleId = bibleId;
    this.number = number;
    this.bookId = bookId;
    this.content = content;
    this.reference = reference;
    this.verseCount = verseCount;
    this.next = next;
    this.previous = previous;
  }

  static fromJsonString(jsonString: string): Chapter {
    const json = JSON.parse(jsonString);
    return new Chapter(
      json.id,
      json.bibleId,
      json.number,
      json.bookId,
      json.content,
      json.reference,
      json.verseCount,
      json.next,
      json.previous
    );
  }

  format(): string {
    return this.id.replace(".", " ");
  }

  static getVerseNum(verse: string): number {
    return verse.charAt(2) === "]"
      ? parseInt(verse.charAt(1))
      : parseInt(verse.charAt(1) + verse.charAt(2));
  }
}
