import { connectToDatabase } from "@/db";
import { NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;
const ALLOWED_ORIGINS = ["https://checkifmichaelisfat.org", "https://www.checkifmichaelisfat.org", "http://localhost:3000"];

function isOriginAllowed(origin) {
    return ALLOWED_ORIGINS.includes(origin);
}

export async function middleware(req) {
    const origin = req.headers.get("origin");
    if (!isOriginAllowed(origin)) {
        return new Response(JSON.stringify({ error: "CORS Error: Origin not allowed" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== API_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const csrfToken = req.headers.get("x-csrf-token");
    const expectedCsrfToken = process.env.CSRF_TOKEN;
    if (csrfToken !== expectedCsrfToken) {
      return new Response(JSON.stringify({ error: "CSRF Error: Invalid token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.next();
  }

export async function POST(req) {
    const middlewareResponse = await middleware(req);
    if (middlewareResponse) return middlewareResponse;

    const db = await connectToDatabase();
    const body = await req.json();
    const { 
        type,
        distance,
        elevation,
        weight,
        time_of_day, 
        level,
        count,
        time,
        calories,
        date,
        notes 
    } = body;
    const result = await db.run(
        `
        INSERT INTO fitness_data (
            type,
            distance,
            elevation,
            weight,
            time_of_day,
            level,
            count,
            time,
            calories,
            date,
            notes
        ) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
            type,
            distance,
            elevation,
            weight,
            time_of_day, 
            level,
            count,
            time,
            calories,
            date,
            notes 
        ]
    );
    return new Response(JSON.stringify({ id: result.lastID}), {status: 201});
}

export async function GET(req) {
    const middlewareResponse = await middleware(req);
    if (middlewareResponse) return middlewareResponse;

    const db = await connectToDatabase();
    const rows = await db.all(`SELECT * FROM fitness_data`);
    return new Response(JSON.stringify(rows), {status: 200});
}