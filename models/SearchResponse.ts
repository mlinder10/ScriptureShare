type SearchVerses = {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  text: string;
  reference: string;
};

export default class SearchResponse {
  query: string;
  limit: number;
  offset: number;
  total: number;
  verseCount: number;
  verses: SearchVerses[];

  constructor(
    query: string,
    limit: number,
    offset: number,
    total: number,
    verseCount: number,
    verses: SearchVerses[],
  ) {
    this.query = query;
    this.limit = limit;
    this.offset = offset;
    this.total = total;
    this.verseCount = verseCount;
    this.verses = verses;
  }

  static fromJsonString(jsonString: string): SearchResponse {
    const json = JSON.parse(jsonString);
    return new SearchResponse(
      json.query,
      json.limit,
      json.offset,
      json.total,
      json.verseCount,
      json.verses,
    );
  }
}
