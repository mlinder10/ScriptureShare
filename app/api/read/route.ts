import { NextRequest, NextResponse } from "next/server";
import { bibleRootUrl } from "@/config/constants";
import Chapter from "@/models/Chapter";
import client from "@/config/db";
import User from "@/models/User";
import Bible from "@/models/Bible";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");

  try {
    if (type === "bible") {
      const bibles = await fetchBibles();
      return NextResponse.json(bibles.data, { status: 200 });
    } else if (type === "book") {
      const bibleId = request.nextUrl.searchParams.get("bibleId");
      if (typeof bibleId !== "string") {
        return NextResponse.json(
          { message: "bibleId is required" },
          { status: 400 }
        );
      }
      const books = await fetchBooks(bibleId);
      return NextResponse.json(books.data, { status: 200 });
    } else if (type === "chapter") {
      const bibleId = request.nextUrl.searchParams.get("bibleId");
      const bookId = request.nextUrl.searchParams.get("bookId");
      if (typeof bibleId !== "string" || typeof bookId !== "string") {
        return NextResponse.json(
          { message: "bibleId and bookId are required" },
          { status: 400 }
        );
      }
      const chapters = await fetchChapters(bibleId, bookId);
      return NextResponse.json(chapters.data.slice(1), { status: 200 });
    }

    return NextResponse.json({ message: "type is required" }, { status: 400 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json(err?.message, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { user, bibleId, chapterId } = await request.json();

  if (!bibleId && !chapterId) {
    return NextResponse.json(
      { message: "At least one parameter is required" },
      { status: 400 }
    );
  }

  try {
    const chapter = await fetchChapter(user, bibleId, chapterId);
    const bible = await fetchBible(user, bibleId);
    const newUser = await updateChapter(user, chapter, bible);
    return NextResponse.json(newUser, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json(err?.message, { status: 500 });
  }
}

async function fetchBibles() {
  const res = await fetch(`${bibleRootUrl}?language=eng`, {
    headers: { "api-key": process.env.BIBLE_API_KEY ?? "" },
  });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data;
}

async function fetchBooks(bibleId: string) {
  const res = await fetch(`${bibleRootUrl}/${bibleId}/books`, {
    headers: { "api-key": process.env.BIBLE_API_KEY ?? "" },
  });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data;
}

async function fetchChapters(bibleId: string, bookId: string) {
  const res = await fetch(
    `${bibleRootUrl}/${bibleId}/books/${bookId}/chapters`,
    {
      headers: { "api-key": process.env.BIBLE_API_KEY ?? "" },
    }
  );
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data;
}

async function fetchChapter(user: User, bibleId: string, chapterId: string) {
  const res = await fetch(
    `${bibleRootUrl}/${bibleId ?? user.bible.id}/chapters/${
      chapterId ?? user.chapter.id
    }?content-type=text`,
    {
      headers: { "api-key": process.env.BIBLE_API_KEY ?? "" },
    }
  );

  if (!res.ok) {
    throw new Error("error fetching chapter");
  }

  let data = (await res.json()).data;
  data.content = parseContent(data.content);
  return data;
}

async function fetchBible(user: User, bibleId: string) {
  const res = await fetch(
    `${bibleRootUrl}/${bibleId ?? user.bible.id}?content-type=text`,
    {
      headers: { "api-key": process.env.BIBLE_API_KEY ?? "" },
    }
  );

  if (!res.ok) {
    throw new Error("error fetching bible");
  }

  let data = (await res.json()).data;
  return data;
}

export function parseContent(content: string) {
  let index = 1;
  return content.split("\n").map((paragraph) =>
    paragraph
      .split(/\[\d{1,2}\]/)
      .slice(1)
      .map((verse) => `[${index++}]${verse.replace("     ", "")}`)
  );
}

async function updateChapter(user: User, chapterData: any, bibleData: any) {
  try {
    const chapter = new Chapter(
      chapterData.id,
      chapterData.bibleId,
      chapterData.number,
      chapterData.bookId,
      chapterData.content,
      chapterData.reference,
      chapterData.verseCount,
      chapterData.next,
      chapterData.previous
    );
    const newChapter = JSON.stringify(chapter);

    const bible = new Bible(
      bibleData.id,
      bibleData.abbreviation,
      bibleData.abbreviationLocal,
      bibleData.name,
      bibleData.nameLocal,
      bibleData.description,
      bibleData.descriptionLocal,
      bibleData.type
    );
    const newBible = JSON.stringify(bible);

    await client.execute({
      sql: "update users set chapter = ?, bible = ? where uid = ?",
      args: [newChapter, newBible, user.uid],
    });
    user.chapter = chapter;
    user.bible = bible;
    return user;
  } catch (err: any) {
    throw new Error(err?.message);
  }
}
