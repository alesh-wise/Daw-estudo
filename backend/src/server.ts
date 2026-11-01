import http from 'http';
import type {Product} from '../../shared/types'
import { ProductCategory} from '../../shared/types'
const PORT = 3000;
const server = http.createServer((req, res) => {
 // TODO: Configurar os cabeçalhos de CORS elementares (Access-Control-AllowOrigin, Access-Control-Allow-Methods e Access-Control-Allow-Headers)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 // TODO: Tratar o pedido de pré-visto (OPTIONS) enviado pelo browser
 if (req.method === 'OPTIONS') {
 // Escreve aqui o tratamento da resposta 204 No Content
    res.writeHead(204);
    res.end();
    return
 }
 // TODO: Implementar a rota do Alive Check (GET /api/alive)
 if (req.url === '/api/alive' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
 // 1. Definir o cabeçalho 'Content-Type': 'application/json' com status 200
    const sampleProduct: Product ={
        id:"pt-1",
        name: "Feijoada",
        supplier:"Ualg",
        price: 15.99,
        stock:5,
        category:ProductCategory.Fresh
    }
 // 2. Criar uma constante 'sampleBook' do tipo 'Book' com dados de teste
    res.end(JSON.stringify({
        preview: sampleProduct,
        message:"Servidor de foodStore ativo",
        status: "healthy",
        timestamp: new Date().toISOString()

    }))
 // 3. Devolver em JSON um objeto contendo: message, status, timestamp e preview (sampleBook)
 } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro 404: Rota não encontrada');
 // TODO: Tratar rotas inexistentes devolvendo status 404 e mensagem de erro em texto simples
 }
});
server.listen(PORT, () => {
 console.log(`[Backend] Servidor de teste a correr em
http://localhost:${PORT}`);
});