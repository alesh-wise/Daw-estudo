import { Router, Request, Response } from 'express';
import { ProductsRepository } from './products.repository.js';
import { ProductCategory } from '../../../../shared/types.js';
import type { Product } from '../../../../shared/types.js';
import { validateSchema } from '../../middlewares/validation.middleware.js';
import { productValidationSchema } from './products.schema.js';
const router = Router();
const productRepo = new ProductsRepository();
// NOTA: Vamos buscar/escrever todo o repositório de livros aquando damanipulação
// TODO: GET /api/books para listar todo o catálogo de livros com status 200 (tratar erros com status 500)... como feito no Lab 2
router.get("/products", async (req: Request, res: Response) => {
    try {
        const products = await productRepo.getAll();
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ 'message': "Erro ao comunicar com o servidor" })
    }
})

// TODO: GET /api/books/:id para obter um livro específico por ID (retornar status 404 se não for encontrado)
router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const productsArray = await productRepo.getAll();
        const product = productsArray.find(p => {
            return p.id === req.params.id
        })
        if (!product) {
            return res.status(404).json({ 'message': "Produto não encontrado" })
        }
        res.status(200).json(product)
    }
    catch {
        res.status(500).json({ 'message': "Erro ao comunicar com o servidor" })
    }
})

// TODO: POST /api/books para criar um livro no catálogo com validação de campos obrigatórios; status 201 Created, 400 se campos em falta e 500 se erro de escrita
router.post("/products", validateSchema(productValidationSchema),async (req: Request, res: Response) => {
    try {
        const { name, supplier, price, stock, category, description } = req.body;

        if (!name || !supplier || price === undefined || stock === undefined) {
            return res.status(400).json({ 'message': "Faltam campos obrigatorios" })
        }
        const product: Product = {
            id: Date.now().toString(),
            name: name,
            supplier: supplier,
            price: Number(price),
            stock: Number(stock),
            category: category as ProductCategory,
            description: description ?? ""
        }

        await productRepo.create(product)

        res.status(201).json(product)

    } catch (error) {
        res.status(500).json({ 'message': "Erro ao conectar com o servidor" })

    }
})

// TODO: PUT /api/books/:id para atualizar dados de um livro existente.
router.put("/products/:id",validateSchema(productValidationSchema), async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const { name, supplier, price, category, stock, description } = req.body;
        const products = await productRepo.getAll();
        if(!products){
            return res.status(404).json({'message': "Não existem produtos"})
        }
        const index = products.findIndex(p => p.id === id);
        const existing = products[index];
        if (index === -1 || !existing) {
            return res.status(404).json({ 'message': "Id invalido" })
        }
        const newproduct = {
            ...existing,
            name: name ?? existing.name,
            supplier: supplier ?? existing.supplier,
            price: price ?? existing.price,
            stock: stock ?? existing.stock,
            category: category ?? existing.category,
            description: description ?? existing.description
        }
        await productRepo.update(existing.id,newproduct);
        res.status(200).json(newproduct);
    }
    catch (error) {
        res.status(500).json({ 'message': "Erro ao conectar com o servidor" })
    }
})

// TODO: DELETE /api/books/:id para remover um livro do catálogo (retornar status 200 ou 204 No Content no sucesso)
router.delete("/products", async (req: Request,res: Response) => {
 try {
        const productId = req.params.id;
        const products = await productRepo.getAll();

        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Não existe livro associado ao id' });
        }

        const productWanted = products[productIndex];
        
        if (!productWanted) {
            return res.status(404).json({ message: 'Não existe livro associado ao id' });
        }
        await productRepo.delete(productWanted.id)
        return res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });

    }
})


// TODO: GET /api/events do canal Server-Sent Events (SSE) integrado ao
router.get('/events', (req: Request, res: Response) => {
    res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });

    res.write(`data: ${JSON.stringify({ message: 'Bem vindo ao stream de notificações do supermercado!' })}\n\n`)

    const interval = setInterval(async () => {
        try {
            const products = await productRepo.getAll();
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

    req.on('close', () => {
        clearInterval(interval);
    })
});

//Express (definir cabeçalhos res.writeHead, temporizador setInterval a cada 5s e limpeza com req.on('close'))...como feito no Lab 2
export default router;