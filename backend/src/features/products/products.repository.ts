import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Product } from '../../../../shared/types.js';
import { ProductCategory } from '../../../../shared/types.js';
export class ProductRepository {
    private readonly filePath = path.join(process.cwd(), 'products.json');
    // Catálogo inicial para seeding
    private readonly seedProducts: Product[] = [
        {
            id: "ebk-101",
            name: "Introdução à Web",
            supplier: "Noélia Correia",
            price: 29.90,
            category: ProductCategory.Frozen,
            stock: 50,
            description: "A bíblia inicial para compreender arquiteturas Web modernas."
        },
        {
            id: "ebk-102",
            name: "Como Programar em TypeScript",
            supplier: "Prof. Web",
            price: 34.50,
            category: ProductCategory.Frozen,
            stock: 12,
            description: "Tipagem estrita e boas práticas de orientação a objetos."
        },
        {
            id: "ebk-103",
            name: "História da Internet",
            supplier: "Alan Turing",
            price: 19.99,
            category: ProductCategory.Frozen,
            stock: 5,
            description: "Uma viagem fascinante desde os primórdios da computação."
        }
    ];
    /**
    * Lê todos os livros armazenados em Products.json de forma assíncrona.
    * Se o ficheiro não existir (erro ENOENT), cria-o com os dados de
   seedProducts.
    */

    public async getAll(): Promise<Product[]> {
        try {
            // TODO: Ler o ficheiro local em 'this.filePath' usando fs.promises.readFile com codificação 'utf-8'
            const fileData = await fs.readFile(this.filePath, 'utf-8')
            // TODO: Converter o texto JSON lido para um array de objetos Product[] e devolvê-lo
            const produtos: Product[] = JSON.parse(fileData);
            return produtos
        }
        catch (error: any) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.filePath, JSON.stringify(this.seedProducts, null, 2), 'utf-8');
                return this.seedProducts;
            }
            throw error;

        }
        // TODO: Intercetar o erro caso o ficheiro não exista (error.code === 'ENOENT')
        // TODO: Se erro, criar Products.json usando fs.promises.writeFile com o conteúdo de this.seedProducts formatado em JSON, e devolver this.seedProducts
    }

    public async saveAll(products: Product[]) {
        try{
            const data = JSON.stringify(products, null, 2)
            await fs.writeFile(this.filePath, data,'utf-8')
        }
        catch(error: any){
            throw error
        }
    }
}
