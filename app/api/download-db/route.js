import { createClient } from "@supabase/supabase-js";
import { Readable } from "stream";

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET() {
    try {
        const { data, error } = await supabase.from("fitness_data").select("*");

        if (error) {
            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: "Failed to fetch data from Supabase" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!data || data.length === 0) {
            return new Response(JSON.stringify({ error: "No data available" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Convert data to CSV
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(","), // Header row
            ...data.map((row) =>
                headers.map((field) => JSON.stringify(row[field] || "")).join(",")
            ), // Data rows
        ].join("\n");

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        const fileName = `fitness_data_${formattedDate}.csv`;

        // Serve CSV as a downloadable file
        const csvStream = Readable.from(csvContent);

        return new Response(csvStream, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error("Error generating CSV file:", error);
        return new Response(JSON.stringify({ error: "Failed to generate CSV file" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}