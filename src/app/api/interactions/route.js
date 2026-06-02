import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

// Server-side in-memory cache
let interactionsCache = null;

export async function GET() {
  try {
    // Return cached interactions instantly
    if (interactionsCache) {
      return NextResponse.json(interactionsCache, { status: 200 });
    }

    if (!clientPromise) {
      return NextResponse.json([], { status: 200 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    const docs = await db.collection("interactions").find({}).toArray();
    
    // Cache the retrieved interactions
    interactionsCache = docs;

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/interactions:", error);
    return NextResponse.json({ error: "Failed to fetch interactions" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    interactionsCache = null; // Clear cache on database writes
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // ObjectId or title
    const type = searchParams.get("type"); // "star" or "like"
    const action = searchParams.get("action"); // "star"/"unstar" or "like"/"unlike"
    const fallback = parseInt(searchParams.get("fallback") || "0", 10);

    if (!id || !type || !action) {
      return NextResponse.json({ error: "ID, type, and action are required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const increment = (action === "unstar" || action === "unlike") ? -1 : 1;

    // 1. Get or create interaction document in interactions collection
    const doc = await db.collection("interactions").findOne({ _id: id });
    let newCount;
    if (!doc) {
      newCount = Math.max(0, fallback + increment);
      await db.collection("interactions").insertOne({ _id: id, count: newCount, type });
    } else {
      newCount = Math.max(0, doc.count + increment);
      await db.collection("interactions").updateOne({ _id: id }, { $set: { count: newCount } });
    }

    // 2. If it is a valid ObjectId, synchronize with the primary collection
    if (ObjectId.isValid(id)) {
      if (type === "star") {
        await db.collection("projects").updateOne(
          { _id: new ObjectId(id) },
          { $set: { stars: newCount } }
        );
      } else if (type === "like") {
        await db.collection("blogs").updateOne(
          { _id: new ObjectId(id) },
          { $set: { likes: newCount } }
        );
      }
    }

    return NextResponse.json({ success: true, count: newCount }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/interactions:", error);
    return NextResponse.json({ error: "Failed to update interactions" }, { status: 500 });
  }
}
