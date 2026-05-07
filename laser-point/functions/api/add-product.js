// functions/api/add-product.js

export async function onRequestPost(context) {
    const { request, env } = context;
    const KV = env.PRODUCTS_KV;
    
    // 1. RECUPERO DELLE CREDENZIALI SICURE (lato server)
    const CORRECT_TOKEN = env.ADMIN_SECRET_TOKEN;

    try {
        // 2. CONTROLLO AUTENTICAZIONE
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || authHeader !== CORRECT_TOKEN) {
            return new Response(JSON.stringify({ error: "Accesso Negato. Token invalido." }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 3. RECUPERO DATI DAL FRONTEND
        const productData = await request.json();

        // Validazione base (assicuriamoci che ci siano i dati essenziali)
        if (!productData.name || !productData.price) {
             return new Response(JSON.stringify({ error: "Nome e Prezzo sono obbligatori." }), {
                status: 400
            });
        }

        // Creiamo una chiave univoca per il prodotto basata sul tempo per evitare duplicati
        const productId = `prod_${Date.now()}`;

        // 4. SCRITTURA NEL DATABASE KV
        await KV.put(productId, JSON.stringify({
            name: productData.name,
            description: productData.description || '',
            price: productData.price,
            image: productData.image || '', // Link dell'immagine (es da ImgBB)
            material: productData.material || 'Legno'
        }));

        return new Response(JSON.stringify({ message: "Prodotto aggiunto con successo!", id: productId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Errore durante il salvataggio." }), {
            status: 500
        });
    }
}