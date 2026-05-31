import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export const dynamic = "force-dynamic";

// Self-contained User-Agent Parser matching main analytics
function parseUserAgent(ua) {
  let browser = "Other";
  let os = "Other";
  let device = "Desktop";

  if (!ua) return { browser, os, device };

  // Determine Browser
  if (ua.includes("Firefox") && !ua.includes("Seamonkey")) browser = "Firefox";
  else if (ua.includes("Chrome") && !ua.includes("Chromium")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium")) browser = "Safari";
  else if (ua.includes("Edge") || ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("MSIE") || ua.includes("Trident/")) browser = "Internet Explorer";

  // Determine OS
  if (ua.includes("Windows NT")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) os = "iOS";

  // Determine Device Type
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = "Mobile";
  } else if (/Tablet|iPad|PlayBook|Silk/i.test(ua)) {
    device = "Tablet";
  }

  return { browser, os, device };
}

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not configured", logs: [] }, { status: 200 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");

    const logs = await db
      .collection("blog_analytics")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({ logs }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/blogs/analytics:", error);
    return NextResponse.json({ error: "Failed to fetch blog traffic logs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ success: false, message: "Database not configured" }, { status: 200 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");

    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body not present
    }

    const { blogId, action, content, screenResolution, windowSize, language, referrer } = body;

    if (!blogId || !action) {
      return NextResponse.json({ success: false, message: "Blog ID and Action are required" }, { status: 400 });
    }

    // Resolve real Blog Title
    let blogTitle = "Static Fallback Blog";
    try {
      let matchedBlog;
      if (ObjectId.isValid(blogId)) {
        matchedBlog = await db.collection("blogs").findOne({ _id: new ObjectId(blogId) });
      } else {
        matchedBlog = await db.collection("blogs").findOne({ _id: blogId });
      }
      if (matchedBlog && matchedBlog.title) {
        blogTitle = matchedBlog.title;
      }
    } catch (err) {
      console.error("Failed to query blog title on server:", err);
    }

    // Resolve IP address
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Skip logging for local requests inside telemetry database
    const isLocalhostIp =
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.16.") ||
      ip.startsWith("172.17.") ||
      ip.startsWith("172.18.") ||
      ip.startsWith("172.19.") ||
      ip.startsWith("172.2") ||
      ip.startsWith("172.3");

    if (isLocalhostIp) {
      return NextResponse.json({ success: false, message: "Skipped: localhost visit not logged" }, { status: 200 });
    }

    const city = request.headers.get("x-vercel-ip-city") || "";
    const region = request.headers.get("x-vercel-ip-country-region") || "";
    const country = request.headers.get("x-vercel-ip-country") || "";

    let location = "Localhost Development";
    let lat = null;
    let lon = null;
    let isp = "Localhost Network";
    let asn = "Localhost Org";

    if (country) {
      location = `${city ? city + ", " : ""}${region ? region + ", " : ""}${country}`;
      const latitude = request.headers.get("x-vercel-ip-latitude");
      const longitude = request.headers.get("x-vercel-ip-longitude");
      if (latitude && longitude) {
        lat = parseFloat(latitude);
        lon = parseFloat(longitude);
      }
    }

    // Geolocation Lookup via ip-api
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

      const geoRes = await fetch(`http://ip-api.com/json/${ip}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      const geoData = await geoRes.json();
      if (geoData && geoData.status === "success") {
        const parts = [];
        if (geoData.city) parts.push(geoData.city);
        if (geoData.regionName) parts.push(geoData.regionName);
        if (geoData.country) parts.push(geoData.country);
        location = parts.length > 0 ? parts.join(", ") : "Unknown Location";
        lat = geoData.lat || null;
        lon = geoData.lon || null;
        isp = geoData.isp || "Unknown ISP";
        asn = geoData.as || "Unknown AS";
      } else {
        location = "Unknown Geolocation";
      }
    } catch (err) {
      console.error("Failed to query blog geolocation for IP:", ip, err);
      location = "Unknown Geolocation";
    }

    const uaString = request.headers.get("user-agent") || "";
    const { browser, os, device } = parseUserAgent(uaString);

    const logEntry = {
      blogId,
      blogTitle,
      action, // "view", "like", "reflection"
      content: content || "",
      ip,
      location,
      lat,
      lon,
      isp,
      asn,
      screenResolution: screenResolution || "Unknown",
      windowSize: windowSize || "Unknown",
      language: language || "Unknown",
      referrer: referrer || "Direct",
      browser,
      os,
      device,
      userAgent: uaString.substring(0, 150),
      timestamp: new Date(),
    };

    await db.collection("blog_analytics").insertOne(logEntry);

    return NextResponse.json({ success: true, log: logEntry }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/blogs/analytics:", error);
    return NextResponse.json({ error: "Failed to log blog interaction" }, { status: 500 });
  }
}
