import { connectToDatabase } from "@/db";

const API_KEY = process.env.API_KEY;

export async function middleware(req) {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== API_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return NextResponse.next();
  }

export async function POST(req) {
    await middleware(req);
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
    await middleware(req);
    const db = await connectToDatabase();
    const rows = await db.all(`SELECT * FROM fitness_data`);
    return new Response(JSON.stringify(rows), {status: 200});
}