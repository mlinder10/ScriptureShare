import { bibleRootUrl } from "@/config/constants";
import { NextRequest, NextResponse } from "next/server";
import { parseContent } from "../read/route";

export async function GET(request: NextRequest) {
  const topBibleId = request.headers.get("topBibleId");
  const bottomBibleId = request.headers.get("bottomBibleId");
  const chapterId = request.headers.get("chapterId");

  if (!topBibleId || !chapterId || !bottomBibleId) {
    return NextResponse.json(
      { message: "All parameters are required" },
      { status: 400 }
    );
  }

  try {
    const topData = await fetchChapter(topBibleId, chapterId);
    const bottomData = await fetchChapter(bottomBibleId, chapterId);
    return NextResponse.json(
      { top: topData, bottom: bottomData },
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
