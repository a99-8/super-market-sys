import Dexie, { Table } from "dexie";
import {
  User,
  Product,
  DrawerSession,
  DrawerTransaction,
  Invoice,
} from "@/types";
import { INITIAL_USERS, INITIAL_PRODUCTS } from "./initial-data";
import { hashPassword } from "@/utils/passwordHasher";

export class AppDatabase extends Dexie {
  drawerSessions!: Table<DrawerSession, string>;
  drawerTransactions!: Table<DrawerTransaction, string>;
  invoices!: Table<Invoice, string>;
  products!: Table<Product, string>;
  users!: Table<User, string>;

  constructor() {
    super("SuperMarketDB");
    this.version(1).stores({
      drawerSessions: "++id, status, userId",
      drawerTransactions: "++id, sessionId, type, timestamp",
      invoices: "++id, createdAt, paymentMethod, customerId",
      products: "++id, barcode, name",
      users: "++id, username, phone",
    });
  }
}

export const db = new AppDatabase();

export async function seedDatabase() {
  const userCount = await db.users.count();
  if (userCount === 0) {
    const usersWithIds: User[] = await Promise.all(
      INITIAL_USERS.map(async (u, idx) => ({
        ...u,
        id: (idx + 1).toString(),
        passwordHash: await hashPassword(u.passwordHash),
      })),
    );
    await db.users.bulkAdd(usersWithIds);
  }

  const productCount = await db.products.count();
  if (productCount === 0) {
    const productsWithIds: Product[] = INITIAL_PRODUCTS.map((p, idx) => ({
      ...p,
      id: (idx + 1).toString(),
    }));
    await db.products.bulkAdd(productsWithIds);
  }
}
