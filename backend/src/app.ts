import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import path from "node:path";
import compression from "compression";
import productsRouter from "./features/products/products.routes.js";
import cors from "cors";
import authRouter from "./features/auth/auth.routes.js";

const app: Express = express();

// TODO: Registar o middleware oficial de CORS através de app.use(cors()) em substituição dos cabeçalhos manuais do Lab 3
app.use(cors());

// TODO: Registar o Middleware Global de Compressão Gzip (compression)
app.use(compression());

// TODO: Registar o Parser de Payloads JSON incorporado na framework (express.json())
app.use(express.json());

// TODO: Servir os ficheiros estáticos do frontend compilado a partir da pasta do frontend (express.static)
const frontendPath = path.join(process.cwd(), "../frontend");
app.use(express.static(frontendPath));

// TODO: Montar o Router de livros (booksRouter) no prefixo '/api'
app.use("/api/", productsRouter);

// TODO: Registar o router de autenticação usando app.use('/api/auth', authRouter)
app.use("/api/auth", authRouter);

// Fallback 404 para endpoints '/api/*' inexistentes (tem de ficar depois de todos os routers)
app.use("/api", (req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint não encontrado" });
});

export { app };