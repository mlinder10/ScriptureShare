import { bibleRootUrl } from "@/config/constants";
import { NextRequest, NextResponse } from "next/server";
import { parseContent } from "@/config/constants";

export async function GET(request: NextRequest) {
  const leftBibleId = request.headers.get("leftBibleId");
  const rightBibleId = request.headers.get("rightBibleId");
  const chapterId = request.headers.get("chapterId");

  if (!leftBibleId || !chapterId || !rightBibleId) {
    return NextResponse.json(
      { message: "All parameters are required" },
      { status: 400 }
    );
  }

  try {
    const leftData = await fetchChapter(leftBibleId, chapterId);
    const rightData = await fetchChapter(rightBibleId, chapterId);
    return NextResponse.json(
      { left: leftData, right: rightData },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json(err?.message, { status: 500 });
  }
}

async function fetchChapter(bibleId: string, chapterId: string) {
  const res = await fetch(
    `${bibleRootUrl}/${bibleId}/chapters/${chapterId}?content-type=text`,
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
