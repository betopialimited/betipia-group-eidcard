import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "betopia_group";
const COLLECTION_NAME = "activity_logs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  // Authentication barrier
  if (!password || password !== process.env.STATS_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Only fetch download actions - views are not tracked
    const downloadActions = await collection
      .find({ action: "download" })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({
      views: 0,
      downloads: downloadActions.length,
      actions: downloadActions.map(item => ({
        id: item._id,
        action: item.action,
        name: item.name,
        designation: item.designation,
        timestamp: item.timestamp
      }))
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to read database logs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, name, designation } = await request.json();

    // Only allow download actions
    if (action !== "download") {
      return NextResponse.json({ error: "Only download actions are tracked" }, { status: 400 });
    }

    // Strict validation: must have real name and designation
    const trimmedName = (name || "").trim();
    const trimmedDesig = (designation || "").trim();

    // Block empty values
    if (!trimmedName || !trimmedDesig) {
      return NextResponse.json({ error: "Name and designation are required" }, { status: 400 });
    }

    // Block default placeholder values
    const blockedNames = ["your name", "name", "test", "demo"];
    const blockedDesigs = ["your designation", "designation", "test", "demo"];

    if (blockedNames.includes(trimmedName.toLowerCase())) {
      return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
    }
    if (blockedDesigs.includes(trimmedDesig.toLowerCase())) {
      return NextResponse.json({ error: "Please enter a valid designation" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const logEntry = {
      action: "download",
      name: trimmedName,
      designation: trimmedDesig,
      timestamp: new Date().toISOString(),
    };

    await collection.insertOne(logEntry);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database write error:", error);
    return NextResponse.json({ error: "Failed to update logs" }, { status: 500 });
  }
}
