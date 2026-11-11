import nedb from "@seald-io/nedb";
import path from "node:path";
import { ProductCategory } from "../../../../shared/types.js";
import type { Product } from "../../../../shared/types.js";

const DataStore = nedb;
type DataStore = InstanceType<typeof DataStore>;

export class ProductsRepository {
  private readonly db: DataStore;

  // Catálogo inicial para seeding
  private readonly seedProducts: Product[] = [
    {
      id: "pdt-001",
      name: "Cozido à Portuguesa",
      supplier: "UAlg",
      price: 5.6,
      category: ProductCategory.Frozen,
      stock: 50,
      description:
        "Uma especialidade saborosa e prática, preparada para uma refeição rápida e deliciosa.",
    },
    {
      id: "pdt-002",
      name: "Arroz de pato",
      supplier: "Cantina Ualg",
      price: 3.0,
      category: ProductCategory.Frozen,
      stock: 300,
      description:
        "O pato, o arroz, os enchidos e os temperos para o caldo e o refogado.",
    },
    {
      id: "pdt-003",
      name: "Pizza Margarita",
      supplier: "Alô Pizza",
      price: 19.99,
      category: ProductCategory.Frozen,
      stock: 300,
      description:
        "molho de tomate natural, queijo mozzarella fresco e folhas de manjericão fresco.",
    },
  ];

  constructor() {
    // TODO: Inicializar a instância do Datastore apontando para o ficheiro 'books.db' com autoload: true
    this.db = new DataStore({
      filename: path.join(process.cwd(), "products.db"),
      autoload: true,
    });
    // TODO: Iniciar a sementeira automatizada de dados chamando método adicional this.seedIfNeeded()
    this.seedIfNeeded().catch((err) =>
      console.error("Erro ao semear dados: " + err.message),
    );
  }

  private async seedIfNeeded(): Promise<void> {
    // TODO: Verificar a contagem de documentos ou efetuar db.find({})
    const count = await new Promise<number>((resolve, reject) => {
      this.db.count({}, (err, total) => {
        if (err) {
          return reject(err);
        }
        resolve(total);
      });
    });

    // TODO: Se a coleção estiver vazia, inserir os seedBooks usando db.insert
    if (count === 0) {
      await new Promise<void>((resolve, reject) => {
        this.db.insert(
          this.seedProducts.map((p) => ({ ...p, _id: p.id })),
          (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          },
        );
      });
    }
  }

  /**
   * Lê todos os livros armazenados em ProdcutsCategorys.json de forma assíncrona.
   */

  public async getAll(): Promise<Product[]> {
    // TODO: Wrap do método db.find({}, ...) numa Promise compatível comasync/await
    return new Promise((resolve, reject) => {
      this.db.find({}, (err: Error, data: Product[]) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  public async getById(id: string): Promise<Product | null> {
    // TODO: Wrap do método db.findOne({ _id: id }, ...) ou pesquisa equivalente numa Promise
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err: Error | null, docs: any) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  public async create(product: Product): Promise<Product> {
    const docToInsert = {
      ...product,
      _id: product.id || `pdt-${Date.now()}`, // Mapeia o id do domínio para a chave primária NoSQL
    };
    return new Promise<Product>((resolve, reject) => {
      this.db.insert(docToInsert, (err: Error | null, newDoc: any) => {
        if (err) reject(err);
        else resolve({ ...newDoc, id: newDoc._id } as Product);
      });
    });
  }

  public async update(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    // TODO: Wrap do método db.update({ _id: id }, { $set: bookData }, {}, ...) numa Promise
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $set: productData },
        { returnUpdatedDocs: true },
        (err: Error | null, numReplaced: number, updatedDoc: any) => {
          if (err) {
            reject(err);
          } else if (numReplaced === 0) {
            resolve(null);
          } else {
            const { _id, ...rest } = updatedDoc as any;
            resolve({ id: _id, ...rest } as Product);
          }
        },
      );
    });
  }

  public async delete(id: string): Promise<boolean> {
    // TODO: Wrap do método db.remove({ _id: id }, {}, ...) numa Promise e devolver true se removido com sucesso
    return new Promise<boolean>((resolve, reject) => {
      this.db.remove(
        { _id: id },
        {},
        (err: Error | null, numRemoved: number) => {
          if (err) reject(err);
          else resolve(numRemoved > 0);
        },
      );
    });
  }
}