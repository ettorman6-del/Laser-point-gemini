// functions/api/delete-product.js
export async function onRequestPost(context) {
    const { request, env } = context;
    const KV = env.PRODUCTS_KV;
    const CORRECT_TOKEN = env.ADMIN_SECRET_TOKEN;

    try {
        const { id, token } = await request.json();

        // Controllo Password
        if (!token || token !== CORRECT_TOKEN) {
            return new Response(JSON.stringify({ error: "Non autorizzato" }), { status: 401 });
        }

        // Eliminazione dal KV
        await KV.delete(id);

        return new Response(JSON.stringify({ message: "Prodotto rimosso!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Errore durante l'eliminazione" }), { status: 500 });
    }
}