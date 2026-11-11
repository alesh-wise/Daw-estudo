import nedb from "@seald-io/nedb";
import path from "node:path";
import { UserRole } from "../../../../shared/types.js";

const DataStore = nedb;
type DataStore = InstanceType<typeof DataStore>;

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

type UserDoc = Omit<User, "id"> & { _id: string };
export class UsersRepository {
  private readonly db: DataStore;
  constructor() {
    this.db = new DataStore({
      filename: path.join(process.cwd(), "users.db"),
      autoload: true,
    });
  }

  private toUser(doc: UserDoc): User {
    const { _id, ...rest } = doc;
    return { id: _id, ...rest };
  }
  /**
   * Procurar um utilizador pelo seu endereço de email de forma assíncrona.
   */
  public async getByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      // TODO: Envolver o método db.findOne({ email }, ...) numa Promise
      this.db.findOne(
        { email: email },
        (err: Error | null, doc: UserDoc | null) => {
          if (err) reject(err);
          // TODO: Devolver o utilizador encontrado ou null caso não exista
          else resolve(doc ? this.toUser(doc) : null);
        },
      );
    });
  }
  /**
   * Inserir um novo utilizador na coleção users.db.
   */
  public async create(user: Omit<User, "id">): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.db.insert(user, (err: Error | null, newDoc: UserDoc) => {
        if (err) reject(err);
        else resolve(this.toUser(newDoc));
      });
    });
  }
}