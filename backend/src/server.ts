import http from 'http';
import type { Product } from '../../shared/types'
import { ProductCategory } from '../../shared/types'
import { ProductRepository } from './features/products/products.repository.js'
const PORT = 3000;
const server = http.createServer(async (req, res) => {
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
      res.writeHead(200, { 'Content-Type': 'application/json' });
      // 1. Definir o cabeçalho 'Content-Type': 'application/json' com status 200
      const sampleProduct: Product = {
         id: "pt-1",
         name: "Feijoada",
         supplier: "Ualg",
         price: 15.99,
         stock: 5,
         category: ProductCategory.Fresh
      }
      // 2. Criar uma constante 'sampleBook' do tipo 'Book' com dados de teste
      res.end(JSON.stringify({
         preview: sampleProduct,
         message: "Servidor de foodStore ativo",
         status: "healthy",
         timestamp: new Date().toISOString()

      }))
      return;
      // 3. Devolver em JSON um objeto contendo: message, status, timestamp e preview (sampleBook)
   }

   if (req.url === '/api/products' && req.method === 'GET') {

      try {
         const productRepo = new ProductRepository();
         const data = await productRepo.getAll();
         res.writeHead(200, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify(data));
      }
      catch (error: any) {
         res.writeHead(500, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify({ message: `Erro interno do servidor: ${error.message}` }))
      }
      return;
   }

   if (req.url === '/api/events' && req.method === 'GET') {
      res.writeHead(200,
         {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
         })
      res.write(`data: ${JSON.stringify({ message: "Bem vindo à loja" })}\n\n`)
      const productsRepository = new ProductRepository()
      const interval = setInterval(async () => {
         try {
            const products = await productsRepository.getAll();
            if (products.length === 0) return;

            const product = products[Math.floor(Math.random() * products.length)];
            if (!product) return;

            const notification = {
               type: 'sale',
               name: product.name,
               timestamp: new Date().toLocaleString('pt-PT'),
               message: `Vendido: ${product.name} `
            }

            res.write(`data: ${JSON.stringify({ message: notification.message + ` às ${notification.timestamp}` })}\n\n`)
         } catch (error) {
            console.error('Erro ao enviar notificação', error);
         }
      }, 5000)
      res.on('close', () => {
         clearInterval(interval);
      })

      return;

   }

   else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erro 404: Rota não encontrada');
      // TODO: Tratar rotas inexistentes devolvendo status 404 e mensagem de erro em texto simples
   }


});
server.listen(PORT, () => {
   console.log(`[Backend] Servidor de teste a correr em
http://localhost:${PORT}`);
});

