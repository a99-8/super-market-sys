import { db } from "@/db";
import { DrawerSession, DrawerTransaction, DenominationCount } from "@/types";

export const drawerService = {
  async getActiveSession(): Promise<DrawerSession | undefined> {
    return await db.drawerSessions.where("status").equals("OPEN").first();
  },

  async openSession(
    userId: string,
    initialDenominations: DenominationCount[],
    initialBalance: number,
  ): Promise<string> {
    const active = await this.getActiveSession();
    if (active) {
      throw new Error("يوجد جلسة درج مفتوحة بالفعل. يجب تصفية الدرج أولاً.");
    }

    const newSession: Omit<DrawerSession, "id"> = {
      userId,
      openedAt: new Date().toISOString(),
      startTime: new Date().toISOString(),
      initialBalance,
      currentBalance: initialBalance,
      totalAmount: initialBalance,
      denominations: initialDenominations,
      status: "OPEN",
    };

    const id = await db.drawerSessions.add(newSession as DrawerSession);
    return id.toString();
  },

  async addTransaction(
    sessionId: string,
    type: "DEPOSIT" | "WITHDRAW" | "SALE" | "REFUND" | "EXCHANGE",
    amount: number,
    reason: string,
    updatedDenominations: DenominationCount[],
  ): Promise<void> {
    const session = await db.drawerSessions.get(sessionId);
    if (!session || session.status !== "OPEN") {
      throw new Error("لا توجد جلسة درج مفتوحة للقيام بهذه العملية.");
    }

    const transaction: Omit<DrawerTransaction, "id"> = {
      sessionId,
      type: type as any,
      amount,
      reason,
      timestamp: new Date().toISOString(),
    };

    await db.transaction(
      "rw",
      [db.drawerSessions, db.drawerTransactions],
      async () => {
        await db.drawerTransactions.add(transaction as DrawerTransaction);

        let newBalance = session.currentBalance;
        if (type === "WITHDRAW" || type === "REFUND") {
          newBalance -= amount;
        } else if (type === "DEPOSIT" || type === "SALE") {
          newBalance += amount;
        }

        await db.drawerSessions.update(sessionId, {
          currentBalance: newBalance,
          totalAmount: newBalance,
          denominations: updatedDenominations,
        });
      },
    );
  },

  async exchangeDenominations(
    sessionId: string,
    updatedDenominations: DenominationCount[],
    exchangeDetails: string,
  ): Promise<void> {
    await this.addTransaction(
      sessionId,
      "EXCHANGE",
      0,
      `تبديل فئات نقدية: ${exchangeDetails}`,
      updatedDenominations,
    );
  },

  async closeSession(
    sessionId: string,
    finalDenominations: DenominationCount[],
  ): Promise<void> {
    const session = await db.drawerSessions.get(sessionId);
    if (!session || session.status !== "OPEN") {
      throw new Error("الجلسة غير موجودة أو مغلقة بالفعل.");
    }

    const finalBalance = finalDenominations.reduce(
      (sum, item) => sum + item.value * item.count,
      0,
    );

    await db.drawerSessions.update(sessionId, {
      endTime: new Date().toISOString(),
      currentBalance: finalBalance,
      totalAmount: finalBalance,
      denominations: finalDenominations,
      status: "CLOSED",
    });
  },
};
