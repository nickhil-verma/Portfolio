import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ views: 0 }, { status: 200 });

    if (!clientPromise) return NextResponse.json({ views: 0 }, { status: 200 });
    const client = await clientPromise;
    const db = client.db("portfolio");

    let blog;
    try {
      blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    } catch {
      blog = await db.collection("blogs").findOne({ _id: id });
    }

    return NextResponse.json({ views: blog?.views || 0 }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/blogs/views:", error);
    return NextResponse.json({ views: 0 }, { status: 200 });
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 200 });

    // Skip localhost check removed to ensure local development testing works perfectly.
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!clientPromise) return NextResponse.json({ success: false }, { status: 200 });
    const client = await clientPromise;
    const db = client.db("portfolio");

    let result;
    try {
      result = await db.collection("blogs").updateOne(
        { _id: new ObjectId(id) },
        { $inc: { views: 1 } }
      );
    } catch {
      result = await db.collection("blogs").updateOne(
        { _id: id },
        { $inc: { views: 1 } }
      );
    }

    const updated = await db.collection("blogs").findOne(
      result?.matchedCount ? { _id: new ObjectId(id) } : { _id: id }
    );
    return NextResponse.json({ success: true, views: updated?.views || 1 }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/blogs/views:", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
