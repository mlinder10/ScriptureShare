import { bibleRootUrl } from "@/config/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const input = request.headers.get("input");
    const bibleId = request.headers.get("bibleId");
    if (!input) {
      return NextResponse.json(
        { message: "input is required" },
        { status: 400 }
      );
    }
    const res = await fetch(
      `${bibleRootUrl}/${bibleId}/search?query=${input}`,
      {
        headers: { "api-key": process.env.BIBLE_API_KEY ?? "" },
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json(err?.message, { status: 500 });
  }
}
