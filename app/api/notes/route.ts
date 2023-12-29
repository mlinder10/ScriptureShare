import client from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uid = request.headers.get("uid");
  try {
    const notes = await client.execute({
      sql: "select * from notes where uid = ?",
      args: [uid],
    });
    return NextResponse.json(notes.rows, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json(err?.message, { status: 500 });
  }
}
