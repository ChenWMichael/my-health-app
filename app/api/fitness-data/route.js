import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API_KEY = process.env.API_KEY;
const CSRF_TOKEN = process.env.CSRF_TOKEN;
const ALLOWED_ORIGINS = [
  "https://checkifmichaelisfat.org", 
  "https://www.checkifmichaelisfat.org", 
  "http://localhost:3000"
];

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
    if (csrfToken !== CSRF_TOKEN) {
      return new Response(JSON.stringify({ error: "CSRF Error: Invalid token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return null;
  }

export async function POST(req) {
    const middlewareResponse = await middleware(req);
    if (middlewareResponse) return middlewareResponse;

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
    const { data, error } = await supabase
        .from('fitness_data')
        .insert([{
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
        }]);
    if (error) {
        console.error("Error inserting data:", error);
        return new Response(JSON.stringify({ error: "Failed to insert data" }), { status: 500 });
    }
    return new Response(JSON.stringify({ data }), { status: 201 });
}

export async function GET(req) {
    // const middlewareResponse = await middleware(req);
    // if (middlewareResponse) return middlewareResponse;
    const { data, error } = await supabase
        .from('fitness_data')
        .select('*');
    if (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
    // console.log("Data retrieved from the database:", rows);
    return new Response(JSON.stringify(data), { status: 200 });
}