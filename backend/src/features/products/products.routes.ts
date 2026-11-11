import { Router, type Request, type Response } from "express";
import { ProductsRepository } from "./products.repository.js";
import { ProductCategory } from "../../../../shared/types.js";
import type { Product } from "../../../../shared/types.js";
import { validateSchema } from "../../middlewares/validation.middleware.js";
import { productValidationSchema } from "./products.schema.js";
import {
  authenticateToken,
  requireRole,
} from "../../middlewares/auth.middleware.js";

const router = Router();
const productsRepository = new ProductsRepository();

// NOTA: Vamos buscar/escrever todo o repositório de livros aquando da manipulação
// TODO: GET /api/products para listar todo o catálogo de livros com status 200(tratar erros com status 500)... como feito no Lab 2
router.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await productsRepository.getAll();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Erro interno ao servidor" });
  }
  return;
});

// TODO: GET /api/Product/:id para obter um livro específico por ID (retornar status 404 se não for encontrado)
router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(404).json({ message: "Produto inválido" });
    }

    const product = await productsRepository.getById(productId.toString());

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: "Erro interno ao procurar o produto." });
  }
});

// TODO: POST /api/products para criar um livro no catálogo com validação de campos obrigatórios; status 201 Created, 400 se campos em falta e 500 se erro de escrita
// TODO: Intercetar a rota POST /books com o middleware validateSchema(bookValidationSchema) antes do handler principal
router.post(
  "/products",
  authenticateToken,
  requireRole("admin"),
  validateSchema(productValidationSchema),
  async (req: Request, res: Response) => {
    try {
      const { id, name, supplier, price, category, stock, description } =
        req.body;

      const newId = `pdt-${Date.now()}`;

      const newProduct: Product = {
        id: newId,
        name,
        supplier,
        price: price,
        category: Number(category) as ProductCategory,
        stock,
        description,
      };

      const created = await productsRepository.create(newProduct);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(500).json({ message: "Erro interno ao gravar o produto" });
    }
  },
);

// TODO: PUT /api/product/:id para atualizar dados de um livro existente.Atualização parcial com status 200, 404 livro não encontrado e 500 se erro de escrita...
// TODO: Intercetar a rota PUT /books/:id com o middleware validateSchema(bookValidationSchema) antes do handler principal
router.put(
  "/products/:id",
  authenticateToken,
  requireRole("admin"),
  validateSchema(productValidationSchema),
  async (req: Request, res: Response) => {
    try {
      // Atualização seletiva dos campos do livro (depois de obter todos os livros do repositório, e verificar se o índice existe)
      const productId = req.params.id;
      if (!productId) {
        return res
          .status(404)
          .json({ message: "Não existe elemento com id associado" });
      }

      const { name, supplier, price, category, stock, description } = req.body;

      const changes: Partial<Product> = {};
      if (name !== undefined) changes.name = name;
      if (supplier !== undefined) changes.supplier = supplier;
      if (price !== undefined) changes.price = Number(price);
      if (category !== undefined)
        changes.category = Number(category) as ProductCategory;
      if (stock !== undefined) changes.stock = Number(stock);
      if (description !== undefined) changes.description = description;

      const updatedProduct = await productsRepository.update(
        productId.toString(),
        changes,
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      return res.status(200).json({
        message: "Produto atualizado com sucesso",
        data: updatedProduct,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Erro interno ao gravar o produto" });
    }
  },
);

// Escrever todos os livros
// TODO: DELETE /api/Product/:id para remover um livro do catálogo (retornar status 200 ou 204 No Content no sucesso)
router.delete(
  "/products/:id",
  authenticateToken,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const productId = req.params.id;
      if (!productId) {
        return res.status(404).json({ message: "Produto inválido" });
      }

      const deleted = await productsRepository.delete(productId.toString());

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Não existe elemento com id associado" });
      }
      return res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
);

// TODO: GET /api/events do canal Server-Sent Events (SSE) integrado ao
// Express(definir cabeçalhos res.writeHead, temporizador setInterval a cada 5s e limpeza com req.on('close'))
router.get("/events", (req: Request, res: Response) => {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  res.write(
    `data: ${JSON.stringify({ message: "Bem vindo ao stream de notificações do supermercado!" })}\n\n`,
  );
  res.flush(); // força o envio imediato (o middleware compression faz buffer)

  const interval = setInterval(async () => {
    try {
      const products = await productsRepository.getAll();
      if (products.length === 0) return;

      const product = products[Math.floor(Math.random() * products.length)];
      if (!product) return;

      const notification = {
        type: "sale",
        name: product.name,
        timestamp: new Date().toLocaleString("pt-PT"),
        message: `Vendido: ${product.name} `,
      };

      res.write(
        `data: ${JSON.stringify({ message: notification.message + ` às ${notification.timestamp}` })}\n\n`,
      );
      res.flush();
    } catch (error) {
      console.error("Erro ao enviar notificação", error);
    }
  }, 5000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

export default router;