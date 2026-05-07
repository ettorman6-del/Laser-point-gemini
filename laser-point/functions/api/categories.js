export async function onRequest(context) {
    const { request, env } = context;
    const KV = env.PRODUCTS_KV;
    const auth = request.headers.get('Authorization');

    // Lettura categorie (GET)
    if (request.method === "GET") {
        const data = await KV.get("CONFIG_CATEGORIES");
        return new Response(data || "[]", {
            headers: { "Content-Type": "application/json" }
        });
    }

    // Salvataggio categorie (POST)
    if (request.method === "POST") {
        if (auth !== env.ADMIN_SECRET_TOKEN) return new Response("Unauthorized", { status: 401 });
        
        const newCategories = await request.json(); // Riceve l'array completo aggiornato
        await KV.put("CONFIG_CATEGORIES", JSON.stringify(newCategories));
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response("Method not allowed", { status: 405 });
}