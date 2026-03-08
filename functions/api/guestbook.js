// /functions/api/guestbook.js

export async function onRequestGet(context) {
    // Fetch all entries, newest first
    const { results } = await context.env.DB.prepare(
        "SELECT * FROM guestbook ORDER BY id DESC LIMIT 50"
    ).all();
    return Response.json(results);
}

export async function onRequestPost(context) {
    try {
        const data = await context.request.json();
        
        // Basic validation
        if (!data.name || !data.message) {
            return new Response("Missing name or message", { status: 400 });
        }

        // Insert into the database
        await context.env.DB.prepare(
            "INSERT INTO guestbook (name, message) VALUES (?, ?)"
        ).bind(data.name, data.message).run();

        return new Response("Success", { status: 200 });
    } catch (err) {
        return new Response("Error processing request", { status: 500 });
    }
}