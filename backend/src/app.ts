import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import path from 'node:path';
import compression from 'compression';
import productsRouter from './features/products/products.routes.js';
import cors from 'cors'
const app: Express = express();
// TODO: Configurar Middleware de CORS Customizado (Access-Control-AllowOrigin, Methods, Headers) e responder 204 nos pedidos OPTIONS
app.use(cors())
// TODO: Registar o Middleware Global de Compressão Gzip (compression)
// TODO: Registar o Parser de Payloads JSON incorporado na framework
app.use(compression());
app.use(express.json()); //converte o content-type: application/json em objeto javascript
// TODO: Servir os ficheiros estáticos do frontend compilado a partir da pasta do frontend (express.static)
const frontendPath = path.join(process.cwd(), '../frontend');
app.use(express.static(frontendPath));

// TODO: Montar o Router de livros (booksRouter) no prefixo '/api'
app.use('/api', productsRouter)
// TODO: Registar rota de fallback para responder com status 404 em endpoints '/api/*' inexistentes
app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({ message: 'Endpoint não encontrado' });
})
export { app };