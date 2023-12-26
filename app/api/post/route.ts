import client from "@/config/db";
import Note from "@/models/Note";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user, verses, content } = await request.json();
    const note = new Note(
      randomUUID(),
      user.uid,
      user.name,
      verses,
      content,
      new Date().toISOString(),
      user.bibleId,
      user.bookId,
      user.chapterId
    );
    await client.execute({
      sql: "insert into notes (pid, uid, name, verses, content, createdAt, bibleId, bookId, chapterId) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        note.pid,
        note.uid,
        note.name,
        JSON.stringify(note.verses),
        note.content,
        note.createdAt,
        note.bibleId,
        note.bookId,
        note.chapterId,
      ],
    });
    return NextResponse.json(note, { status: 200 });
  } catch (err: any) {
    console.error(err?.message);
    return NextResponse.json(err?.message, { status: 500 });
  }
}
