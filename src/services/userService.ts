import { db } from "@/db";
import { User } from "@/types";
import { hashPassword, verifyPassword } from "@/utils/passwordHasher";

export const UserService = {
  async getAllUsers(): Promise<User[]> {
    return await db.users.toArray();
  },

  async createUser(userData: {
    username: string;
    password: string;
    phone: string;
    role: User["role"];
    creditLimit?: number;
    creditBalance?: number;
  }): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);

    const limit = userData.creditLimit ?? userData.creditBalance ?? 0;
    const balance = userData.creditBalance ?? userData.creditLimit ?? 0;

    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      passwordHash: hashedPassword,
      phone: userData.phone,
      role: userData.role,
      creditLimit: limit,
      creditBalance: balance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.users.add(newUser);
    return newUser;
  },

  async updateCreditBalance(userId: string, newBalance: number): Promise<void> {
    await db.users.update(userId, {
      creditBalance: newBalance,
      updatedAt: new Date().toISOString(),
    });
  },

  async deductCredit(userId: string, amount: number): Promise<void> {
    const user = await db.users.get(userId);
    if (!user) throw new Error("المستخدم غير موجود");

    const newBalance = (user.creditBalance || 0) - amount;
    await db.users.update(userId, { creditBalance: newBalance });
  },

  async authenticate(username: string, password: string): Promise<User | null> {
    const users = await db.users
      .where("username")
      .equalsIgnoreCase(username)
      .toArray();
    const user = users[0];
    if (!user) return null;

    const isValid = await verifyPassword(password, user.passwordHash);
    return isValid ? user : null;
  },
};
