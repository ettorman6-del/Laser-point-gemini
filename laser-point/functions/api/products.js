export async function onRequestGet(context) {
    const { env } = context;
    const KV = env.PRODUCTS_KV;

    // Controllo se il binding KV esiste
    if (!KV) {
        return new Response(JSON.stringify({ error: "Binding KV 'PRODUCTS_KV' non trovato nelle impostazioni di Cloudflare." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Recuperiamo la lista di tutte le chiavi che iniziano con 'prod_'
        const list = await KV.list({ prefix: 'prod_' });
        
        // Recuperiamo i dati per ogni chiave
        const products = await Promise.all(
            list.keys.map(async (key) => {
                const data = await KV.get(key.name, { type: 'json' });
                return { id: key.name, ...data };
            })
        );

        // Risposta con i prodotti (sarà un array vuoto [] se non ce ne sono ancora)
        return new Response(JSON.stringify(products), {
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache' // Evita che il browser mostri dati vecchi
            },
            status: 200
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Errore nel recupero dei dati dal database KV." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}