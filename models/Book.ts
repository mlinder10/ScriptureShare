export default class Book {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;

  constructor(
    id: string,
    bibleId: string,
    abbreviation: string,
    name: string,
    nameLong: string,
  ) {
    this.id = id;
    this.bibleId = bibleId;
    this.abbreviation = abbreviation;
    this.name = name;
    this.nameLong = nameLong;
  }

  static fromJsonString(jsonString: string): Book {
    const json = JSON.parse(jsonString);
    return new Book(
      json.id,
      json.bibleId,
      json.abbreviation,
      json.name,
      json.nameLong,
    );
  }
}
