import Chapter from "./Chapter";

export default class Note {
  constructor(
    public pid: string,
    public uid: string,
    public name: string,
    public verses: string[],
    public content: string,
    public createdAt: string,
    public bibleId: string,
    public bookId: string,
    public chapterId: string
  ) {}

  static construct(note: Note): Note {
    return new Note(
      note.pid,
      note.uid,
      note.name,
      note.verses,
      note.content,
      note.createdAt,
      note.bibleId,
      note.bookId,
      note.chapterId
    );
  }

  getNums(): number[] {
    return [
      Chapter.getVerseNum(this.verses[0]),
      Chapter.getVerseNum(this.verses[this.verses.length - 1]),
    ];
  }
}
