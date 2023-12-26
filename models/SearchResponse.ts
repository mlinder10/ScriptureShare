type SearchVerses = {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  text: string;
  reference: string;
};

type Passage = {
  id: string;
  bibleId: string;
  content: string;
  reference: string;
  verseCount: number;
};

export default class SearchResponse {
  query: string;
  limit: number;
  offset: number;
  total: number;
  verseCount: number;
  verses: SearchVerses[];
  passages: Passage[];

  constructor(
    query: string,
    limit: number,
    offset: number,
    total: number,
    verseCount: number,
    verses: SearchVerses[],
    passages: Passage[]
  ) {
    this.query = query;
    this.limit = limit;
    this.offset = offset;
    this.total = total;
    this.verseCount = verseCount;
    this.verses = verses;
    this.passages = passages;
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
      json.passages
    );
  }
}
