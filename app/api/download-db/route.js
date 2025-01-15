import path from 'path';
import fs from 'fs';

const DATABASE_PATH = './database/fitness_data.db';

export async function GET() {
    try {
        const absolutePath = path.resolve(DATABASE_PATH);

        if (!fs.existsSync(absolutePath)) {
            return new Response(JSON.stringify({ error: "Database file not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const currentDate = new Date();
        const formattedDate = currentDate
            .toISOString()
            .split('T')[0];
        const fileName = `fitness_data_${formattedDate}.db`;

        const fileStream = fs.createReadStream(absolutePath);

        return new Response(fileStream, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error("Error serving database file:", error);
        return new Response(JSON.stringify({ error: "Failed to serve the database file" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}