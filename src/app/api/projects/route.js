import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured", fallback: true }, { status: 200 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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

    const { title, tech, githubUrl, deployedUrl, description, category } = body;

    if (!title || !tech || !githubUrl) {
      return NextResponse.json({ error: "Title, Tech Stack, and GitHub URL are compulsory fields" }, { status: 400 });
    }

    // Convert comma-separated string of tech to formatted array
    const techArray = Array.isArray(tech) 
      ? tech 
      : tech.split(",").map(item => item.trim()).filter(Boolean);

    const newProject = {
      title,
      description: description || "No description provided.",
      link: githubUrl, // Compulsory GitHub link
      deployedUrl: deployedUrl || null, // Optional deployed link
      tech: techArray,
      category: category || "web",
      stars: Math.floor(Math.random() * 15) + 1, // Generate premium initial stars count
      created_at: new Date(),
    };

    const result = await db.collection("projects").insertOne(newProject);
    return NextResponse.json({ success: true, insertedId: result.insertedId, project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/projects:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const body = await request.json();
    const { id, title, tech, githubUrl, deployedUrl, description, category } = body;

    if (!id || !title || !tech || !githubUrl) {
      return NextResponse.json({ error: "ID, Title, Tech Stack, and GitHub URL are required fields" }, { status: 400 });
    }

    const techArray = Array.isArray(tech) 
      ? tech 
      : tech.split(",").map(item => item.trim()).filter(Boolean);

    const client = await clientPromise;
    const db = client.db("portfolio");
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description: description || "No description provided.",
          link: githubUrl,
          deployedUrl: deployedUrl || null,
          tech: techArray,
          category: category || "web",
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/projects:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action"); // "star" or "unstar"
    
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const increment = action === "unstar" ? -1 : 1;
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      { $inc: { stars: increment } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch updated project stars
    const updatedProject = await db.collection("projects").findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, stars: updatedProject.stars }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/projects:", error);
    return NextResponse.json({ error: "Failed to update stars" }, { status: 500 });
  }
}
