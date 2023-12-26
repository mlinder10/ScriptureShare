import { createDefaultUser } from "@/config/constants";
import client from "@/config/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.headers.get("email");
  const password = request.headers.get("password");

  if (!email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const rs = await client.execute({
      sql: "select * from users where email = ? and password = ?",
      args: [email, password],
    });
    return NextResponse.json(User.fromRow(rs.rows[0]), { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err?.message, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const defaultUser = createDefaultUser(name, email, password);

  try {
    const rs = await client.execute({
      sql: "insert into users (uid, name, email, password, followers, following, bible, book, chapter) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        defaultUser.uid,
        defaultUser.name,
        defaultUser.email,
        defaultUser.password,
        JSON.stringify(defaultUser.followers),
        JSON.stringify(defaultUser.following),
        JSON.stringify(defaultUser.bible),
        JSON.stringify(defaultUser.book),
        JSON.stringify(defaultUser.chapter),
      ],
    });
    return NextResponse.json(defaultUser, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err?.message, { status: 500 });
  }
}
