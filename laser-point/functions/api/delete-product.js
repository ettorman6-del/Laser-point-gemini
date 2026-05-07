export async function onRequestPost(context) {
    const { request, env } = context;
    const KV = env.PRODUCTS_KV;
    const auth = request.headers.get('Authorization');

    try {
        const { id, token } = await request.json();

        if (token !== env.ADMIN_SECRET_TOKEN) {
            return new Response(JSON.stringify({ error: "Non autorizzato" }), { status: 401 });
        }

        await KV.delete(id);
        return new Response(JSON.stringify({ message: "Eliminato con successo" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Errore durante l'eliminazione" }), { status: 500 });
    }
}
