import { NextResponse } from "next/server";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DB_NAME = "betopia_group";
const COLLECTION_NAME = "activity_logs";
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "activity_logs.json");
const BLOCKED_NAMES = ["your name", "name", "test", "demo"];
const BLOCKED_DESIGNATIONS = ["your designation", "designation", "test", "demo"];
let localWriteQueue = Promise.resolve();

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return NextResponse.json(body, { ...init, headers });
}

function getStatsPassword(request) {
  const headerPassword = request.headers.get("x-stats-password");
  if (headerPassword) {
    return headerPassword;
  }

  const { searchParams } = new URL(request.url);
  return searchParams.get("password");
}

function mapAction(item, index) {
  return {
    id: String(item._id ?? item.id ?? `${item.action}-${item.timestamp}-${index}`),
    action: item.action,
    name: item.name,
    designation: item.designation,
    timestamp: item.timestamp,
  };
}

function validateDownload(name, designation) {
  const trimmedName = (name || "").trim();
  const trimmedDesignation = (designation || "").trim();

  if (!trimmedName || !trimmedDesignation) {
    return { error: "Name and designation are required" };
  }

  if (BLOCKED_NAMES.includes(trimmedName.toLowerCase())) {
    return { error: "Please enter a valid name" };
  }

  if (BLOCKED_DESIGNATIONS.includes(trimmedDesignation.toLowerCase())) {
    return { error: "Please enter a valid designation" };
  }

  return { trimmedName, trimmedDesignation };
}

async function readLocalLogs() {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeLocalLogs(logs) {
  await mkdir(DATA_DIR, { recursive: true });
  const tempFile = `${DATA_FILE}.tmp`;
  await writeFile(tempFile, JSON.stringify(logs, null, 2), "utf8");
  await rename(tempFile, DATA_FILE);
}

async function appendLocalLog(logEntry) {
  localWriteQueue = localWriteQueue.then(async () => {
    const logs = await readLocalLogs();
    logs.push(logEntry);
    await writeLocalLogs(logs);
  });

  return localWriteQueue;
}

async function getMongoCollection() {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const { default: clientPromise } = await import("@/lib/mongodb");
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

export async function GET(request) {
  const password = getStatsPassword(request);

  if (!password || password !== process.env.STATS_PASSWORD) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collection = await getMongoCollection();

    if (collection) {
      const downloadActions = await collection
        .find({ action: "download" })
        .sort({ timestamp: -1 })
        .toArray();

      return jsonResponse({
        views: 0,
        downloads: downloadActions.length,
        actions: downloadActions.map(mapAction),
      });
    }

    const logs = await readLocalLogs();
    const downloadActions = logs
      .filter((item) => item.action === "download")
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return jsonResponse({
      views: 0,
      downloads: downloadActions.length,
      actions: downloadActions.map(mapAction),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return jsonResponse({ error: "Failed to read database logs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, name, designation } = await request.json();

    if (action !== "download") {
      return jsonResponse(
        { error: "Only download actions are tracked" },
        { status: 400 },
      );
    }

    const validation = validateDownload(name, designation);
    if (validation.error) {
      return jsonResponse({ error: validation.error }, { status: 400 });
    }

    const logEntry = {
      id: crypto.randomUUID(),
      action: "download",
      name: validation.trimmedName,
      designation: validation.trimmedDesignation,
      timestamp: new Date().toISOString(),
    };

    const collection = await getMongoCollection();

    if (collection) {
      const mongoEntry = { ...logEntry, _id: logEntry.id };
      delete mongoEntry.id;
      await collection.insertOne(mongoEntry);
    } else {
      await appendLocalLog(logEntry);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Database write error:", error);
    return jsonResponse({ error: "Failed to update logs" }, { status: 500 });
  }
}
