import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

let experiencesCache = null;

function sortExperiencesLatestFirst(expList) {
  return [...expList].sort((a, b) => {
    const aIsPresent = Boolean(a.isPresent || (a.endDate && a.endDate.toString().toLowerCase().includes("present")));
    const bIsPresent = Boolean(b.isPresent || (b.endDate && b.endDate.toString().toLowerCase().includes("present")));

    const parseStr = (s) => {
      if (!s) return 0;
      const d = new Date(s);
      if (!isNaN(d.getTime())) return d.getTime();
      const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
      const parts = s.toString().trim().split(/\s+|-|\//);
      if (parts.length >= 2) {
        const yr = parseInt(parts[parts.length - 1], 10);
        const mStr = parts[0].toLowerCase().slice(0, 4);
        const m = months[mStr] !== undefined ? months[mStr] : 0;
        if (!isNaN(yr)) return new Date(yr, m, 1).getTime();
      } else if (parts.length === 1) {
        const yr = parseInt(parts[0], 10);
        if (!isNaN(yr)) return new Date(yr, 0, 1).getTime();
      }
      return 0;
    };

    if (aIsPresent && !bIsPresent) return -1;
    if (!aIsPresent && bIsPresent) return 1;

    const endA = aIsPresent ? Date.now() : parseStr(a.endDate);
    const endB = bIsPresent ? Date.now() : parseStr(b.endDate);

    if (endB !== endA) {
      return endB - endA;
    }

    const startA = parseStr(a.startDate);
    const startB = parseStr(b.startDate);

    if (startB !== startA) {
      return startB - startA;
    }

    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

export async function GET() {
  try {
    if (experiencesCache) {
      return NextResponse.json(experiencesCache, { status: 200 });
    }

    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured", fallback: true }, { status: 200 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const experiences = await db
      .collection("experiences")
      .find({})
      .toArray();

    const sortedExperiences = sortExperiencesLatestFirst(experiences);
    experiencesCache = sortedExperiences;
    return NextResponse.json(sortedExperiences, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    experiencesCache = null;
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const body = await request.json();

    const {
      title,
      company,
      logoUrl,
      startDate,
      endDate,
      isPresent,
      location,
      description,
    } = body;

    if (!title || !company) {
      return NextResponse.json(
        { error: "Title and Company name are required fields" },
        { status: 400 }
      );
    }

    // Process description into array of string bullet points if passed as multiline string
    let descriptionArray = [];
    if (Array.isArray(description)) {
      descriptionArray = description.filter(Boolean);
    } else if (typeof description === "string") {
      descriptionArray = description
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }

    // Format period string
    let periodStr = "";
    if (startDate) {
      periodStr = isPresent
        ? `${startDate} – Present`
        : endDate
        ? `${startDate} – ${endDate}`
        : startDate;
    } else {
      periodStr = isPresent ? "Present" : "N/A";
    }

    const newExperience = {
      title,
      company,
      logoUrl: logoUrl || null,
      startDate: startDate || "",
      endDate: isPresent ? "Present" : endDate || "",
      isPresent: Boolean(isPresent),
      period: periodStr,
      location: location || "",
      description: descriptionArray,
      created_at: new Date(),
    };

    const result = await db.collection("experiences").insertOne(newExperience);
    return NextResponse.json(
      { success: true, insertedId: result.insertedId, experience: newExperience },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/experiences:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    experiencesCache = null;
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const body = await request.json();

    const {
      id,
      title,
      company,
      logoUrl,
      startDate,
      endDate,
      isPresent,
      location,
      description,
    } = body;

    if (!id || !title || !company) {
      return NextResponse.json(
        { error: "ID, Title, and Company name are required fields" },
        { status: 400 }
      );
    }

    let descriptionArray = [];
    if (Array.isArray(description)) {
      descriptionArray = description.filter(Boolean);
    } else if (typeof description === "string") {
      descriptionArray = description
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }

    let periodStr = "";
    if (startDate) {
      periodStr = isPresent
        ? `${startDate} – Present`
        : endDate
        ? `${startDate} – ${endDate}`
        : startDate;
    } else {
      periodStr = isPresent ? "Present" : "N/A";
    }

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const result = await db.collection("experiences").updateOne(
      query,
      {
        $set: {
          title,
          company,
          logoUrl: logoUrl || null,
          startDate: startDate || "",
          endDate: isPresent ? "Present" : endDate || "",
          isPresent: Boolean(isPresent),
          period: periodStr,
          location: location || "",
          description: descriptionArray,
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Experience updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/experiences:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    experiencesCache = null;
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Experience ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const result = await db
      .collection("experiences")
      .deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Experience deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/experiences:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
