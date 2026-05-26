import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

// GET: Retrieves all anonymous comments, sorted by newest first (for dashboard consumption)
export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const comments = await db
      .collection("comments")
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/blogs/comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST: Accepts an anonymous comment reflection on an article
export async function POST(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    const body = await request.json();

    const { blogId, blogTitle, content } = body;

    if (!blogId || !content || !content.trim()) {
      return NextResponse.json({ error: "Blog ID and comment content are compulsory" }, { status: 400 });
    }

    const newComment = {
      blogId,
      blogTitle: blogTitle || "Unknown Article",
      content: content.trim(),
      created_at: new Date(),
    };

    const result = await db.collection("comments").insertOne(newComment);
    return NextResponse.json({ success: true, commentId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/blogs/comments:", error);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}

// DELETE: Deletes an anonymous comment by ID
export async function DELETE(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const { ObjectId } = await import("mongodb");
    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db.collection("comments").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Comment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/blogs/comments:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
