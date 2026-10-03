import http from 'http';
import type { Book } from "../../shared/type.js";
import { BookCategory } from "../../shared/type.js";
const PORT = 3000;
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    // TODO: Implementar a rota do Alive Check (GET /api/alive)
    if (req.url === '/api/alive' && req.method === 'GET') {
        const sampleBook = {
            id: 1,
            title: "Primeiro é pensar",
            author: "Goat Nenad",
            price: 15.99,
            category: BookCategory.Fiction,
            stock: 10,
            description: 'Ele sabeu'
        };

        res.writeHead(200, {
            'Content.Type': 'application.json'
        });

        res.end(JSON.stringify({
            message: 'Servidor bookstore ativo!',
            status: 'healthy',
            timeStamp: new Date().toISOString(),
            preview: sampleBook
        }));
        return;

    } else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end(`Rota não encontrada`);
    }
});
server.listen(PORT, () => {
    console.log(`[Backend] Servidor de teste a correr em
http://localhost:${PORT}`);
});