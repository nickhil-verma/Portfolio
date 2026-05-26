import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// Self-contained lightweight User-Agent Parser
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
      return NextResponse.json({ error: "Database not configured", totalViews: 0, uniqueViews: 0, logs: [] }, { status: 200 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const logs = await db
      .collection("analytics")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    // Calculate quick metrics
    const totalViews = logs.length;
    const uniqueIPs = new Set(logs.map(log => log.ip)).size;

    return NextResponse.json({ totalViews, uniqueViews: uniqueIPs, logs }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/analytics:", error);
    return NextResponse.json({ error: "Failed to fetch traffic logs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ success: false, message: "Database not configured" }, { status: 200 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Resolve IP address
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Resolve Geolocation from Next.js / Vercel Edge headers
    const city = request.headers.get("x-vercel-ip-city") || "";
    const region = request.headers.get("x-vercel-ip-country-region") || "";
    const country = request.headers.get("x-vercel-ip-country") || "";
    
    let location = "Localhost Development";
    if (country) {
      location = `${city ? city + ", " : ""}${region ? region + ", " : ""}${country}`;
    } else if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      location = "Localhost Development";
    } else {
      // Dynamic live geolocation lookup from public API
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
        } else {
          location = "Unknown Geolocation";
        }
      } catch (err) {
        console.error("Failed to query geolocation for IP:", ip, err);
        location = "Unknown Geolocation";
      }
    }

    // Parse Device and OS from User-Agent
    const uaString = request.headers.get("user-agent") || "";
    const { browser, os, device } = parseUserAgent(uaString);

    const logEntry = {
      ip,
      location,
      browser,
      os,
      device,
      userAgent: uaString.substring(0, 150),
      timestamp: new Date(),
    };

    await db.collection("analytics").insertOne(logEntry);
    
    return NextResponse.json({ success: true, log: logEntry }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/analytics:", error);
    return NextResponse.json({ error: "Failed to log visit" }, { status: 500 });
  }
}
