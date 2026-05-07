export async function onRequestPost(context) {
    const { request, env } = context;
    const KV = env.PRODUCTS_KV;
    const auth = request.headers.get('Authorization');

    // Controllo sicurezza
    if (auth !== env.ADMIN_SECRET_TOKEN) {
        return new Response(JSON.stringify({ error: "Non autorizzato" }), { status: 401 });
    }

    try {
        const data = await request.json();

        // Se il dato ha il flag isCategory, salviamo una categoria
        if (data.isCategory) {
            const catId = `cat_${Date.now()}`;
            await KV.put(catId, JSON.stringify({ name: data.name }));
            return new Response(JSON.stringify({ message: "Categoria aggiunta" }), { status: 200 });
        }

        // Altrimenti salviamo un prodotto (nuovo o modifica)
        const id = data.id || `prod_${Date.now()}`;
        await KV.put(id, JSON.stringify({
            name: data.name,
            category: data.category || "Generale",
            material: data.material || "",
            description: data.description || "",
            price: data.price || "0",
            image: data.image || ""
        }));

        return new Response(JSON.stringify({ message: "Prodotto salvato" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
