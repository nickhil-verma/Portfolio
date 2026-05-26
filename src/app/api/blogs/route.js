import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured", fallback: true }, { status: 200 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    const blogs = await db
      .collection("blogs")
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    const body = await request.json();

    const { title, excerpt, category, imageUrl, bannerUrl, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and Content are compulsory fields" }, { status: 400 });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const newBlog = {
      title,
      excerpt: excerpt || content.substring(0, 150) + "...",
      category: category || "Tech",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      content,
      readTime,
      likes: Math.floor(Math.random() * 10) + 1, // Generate a subtle premium initial likes count
      created_at: new Date(),
    };

    const result = await db.collection("blogs").insertOne(newBlog);
    return NextResponse.json({ success: true, insertedId: result.insertedId, blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/blogs:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/blogs:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const body = await request.json();
    const { id, title, excerpt, category, imageUrl, bannerUrl, content } = body;

    if (!id || !title || !content) {
      return NextResponse.json({ error: "ID, Title, and Content are required fields" }, { status: 400 });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db.collection("blogs").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          excerpt: excerpt || content.substring(0, 150) + "...",
          category: category || "Tech",
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
          bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
          content,
          readTime,
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/blogs:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}
