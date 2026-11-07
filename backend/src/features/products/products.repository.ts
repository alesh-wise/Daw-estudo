import nedb from '@seald-io/nedb'
import DataStore from '@seald-io/nedb'
import path from 'node:path';
import type { Product } from '../../../../shared/types.js';
import { ProductCategory } from '../../../../shared/types.js';

type Datastore = InstanceType<typeof DataStore>

export class ProductsRepository {
    private readonly db: Datastore;
    private readonly seedBooks: Product[] = [
        // ...Estrutura de livros de teste definida nos laboratórios anteriores
    ];
    constructor() {
        // TODO: Inicializar a instância do Datastore apontando para o ficheiro 'books.db' com autoload: true
        this.db = new DataStore({ filename: path.join(process.cwd(), 'products.db'), autoload: true })
        // TODO: Iniciar a sementeira automatizada de dados chamando método adicional this.seedIfNeeded()
        this.seedIfNeeded().catch(err => { console.error("Erro ao semear dados") })
    }
    private async seedIfNeeded(): Promise<void> {
        // TODO: Verificar a contagem de documentos ou efetuar db.find({})
        const count = await new Promise<Number>((resolve, reject) => {
            this.db.count({}, (err: Error | null, docs: any) => {
                if (err) return reject(err);
                resolve(docs);
            })
        })
        // TODO: Se a coleção estiver vazia, inserir os seedBooks usando db.insert
        if (count === 0) {
            await new Promise<void>((resolve, reject) => {
                this.db.insert(this.seedBooks.map(p => { return { ...p, _id: p.id } }), (err) => {
                    if (err) { return reject(err) }
                    resolve()
                })
            })
        }
    }

    public async getAll(): Promise<Product[]> {
        // TODO: Wrap do método db.find({}, ...) numa Promise compatível com async/await
        return new Promise<Product[]>((resolve, reject) => {
            this.db.find({}, (err: Error | null, docs: any) => {
                if (err) { return reject(err) }
                resolve(docs)
            })
        })
    }

    public async getById(id: string): Promise<Product | null> {
        // TODO: Wrap do método db.findOne({ _id: id }, ...) ou pesquisa equivalente numa Promise
        return new Promise<Product>((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, docs: any) => {
                if (err) { return reject(err) }
                resolve(docs)
            })
        })
    }
    public async create(product: Product): Promise<Product> {
        const docToInsert = {
            ...product,
            _id: product.id || `ebk-${Date.now()}` // Mapeia o id do domínio para a chave primária NoSQL
        };

        return new Promise<Product>((resolve, reject) => {
            this.db.insert(docToInsert, (err: Error | null, newDoc: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ ...newDoc, id: newDoc._id } as Product);
            });
        });
    }

    public async update(id: string, ProductData: Partial<Product>): Promise<Product |
        null> {
        // TODO: Wrap do método db.update({ _id: id }, { $set: bookData }, {}, ...) numa Promise
        return new Promise<Product | null>((resolve, reject) => {
            this.db.update({ _id: id }, { $set: ProductData }, { returnUpdatedDocs: true }, (err: Error | null, numReplaced: number, updatedDoc: any) => {
                if (err) reject(err);
                else if (numReplaced === 0) { resolve(null) }
                else {
                    const { _id, ...rest } = updatedDoc as any;
                    resolve({ id: _id, ...rest } as Product)
                }
            })
        })
    }

    public async delete(id: string): Promise<boolean> {
        // TODO: Wrap do método db.remove({ _id: id }, {}, ...) numa Promise e devolver true se removido com sucesso
        return new Promise<boolean>((resolve, reject) => {
            this.db.remove({ _id: id }, (err: Error | null, numRemoved: number) => {
                if (err) reject(err);
                else resolve(numRemoved > 0)
            })
        })
    }
}