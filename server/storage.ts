import { type Prospect, type InsertProspect, prospects } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getAllProspects(): Promise<Prospect[]>;
  getProspect(id: number): Promise<Prospect | undefined>;
  createProspect(data: InsertProspect): Promise<Prospect>;
  updateProspect(id: number, data: Partial<InsertProspect>): Promise<Prospect | undefined>;
  deleteProspect(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getAllProspects(): Promise<Prospect[]> {
    return await db.select().from(prospects).orderBy(desc(prospects.createdAt));
  }

  async getProspect(id: number): Promise<Prospect | undefined> {
    const [result] = await db.select().from(prospects).where(eq(prospects.id, id));
    return result;
  }

  async createProspect(data: InsertProspect): Promise<Prospect> {
    const [result] = await db.insert(prospects).values(data).returning();
    return result;
  }

  async updateProspect(id: number, data: Partial<InsertProspect>): Promise<Prospect | undefined> {
    const [result] = await db
      .update(prospects)
      .set(data)
      .where(eq(prospects.id, id))
      .returning();
    return result;
  }

  async deleteProspect(id: number): Promise<boolean> {
    const result = await db.delete(prospects).where(eq(prospects.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
