import { 
  users, transactions, customers, invoices, invoiceItems, payouts, bankfulImports, wixIntegrations,
  merchants, merchantOwners, merchantUsers, onboardingTasks, merchantNotes, merchantEvents, checkoutSettings,
  type User, type UpsertUser,
  type Transaction, type InsertTransaction,
  type Customer, type InsertCustomer,
  type Invoice, type InsertInvoice,
  type InvoiceItem, type InsertInvoiceItem,
  type Payout, type InsertPayout,
  type BankfulImport, type InsertBankfulImport,
  type WixIntegration, type InsertWixIntegration,
  type Merchant, type InsertMerchant,
  type MerchantOwner, type InsertMerchantOwner,
  type MerchantUser, type InsertMerchantUser,
  type OnboardingTask, type InsertOnboardingTask,
  type MerchantNote, type InsertMerchantNote,
  type MerchantEvent, type InsertMerchantEvent,
  type CheckoutSettings, type InsertCheckoutSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql, ne } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: { email: string; password?: string | null; firstName?: string | null; lastName?: string | null; profileImageUrl?: string; role?: string | null }): Promise<User>;
  updateUser(id: string, data: { firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getPigBankTeamMembers(): Promise<User[]>;

  // Transactions
  getTransactions(userId: string, limit?: number, offset?: number, search?: string): Promise<Transaction[]>;
  getTransaction(userId: string, id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionCount(userId: string): Promise<number>;

  // Customers
  getCustomers(userId: string, limit?: number, offset?: number, search?: string): Promise<Customer[]>;
  getCustomer(userId: string, id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(userId: string, id: string, customer: Partial<Customer>): Promise<Customer | undefined>;

  // Invoices
  getInvoices(userId: string, limit?: number, offset?: number): Promise<Invoice[]>;
  getInvoice(userId: string, id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<Invoice>;
  updateInvoice(userId: string, id: string, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  deleteInvoice(userId: string, id: string): Promise<boolean>;

  // Invoice Items
  getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>;

  // Payouts
  getPayouts(userId: string, limit?: number, offset?: number): Promise<Payout[]>;
  getPayout(userId: string, id: string): Promise<Payout | undefined>;
  createPayout(payout: InsertPayout): Promise<Payout>;

  // Bankful Imports
  getBankfulImports(userId: string, limit?: number): Promise<BankfulImport[]>;
  createBankfulImport(data: InsertBankfulImport): Promise<BankfulImport>;
  updateBankfulImport(id: string, data: Partial<BankfulImport>): Promise<BankfulImport | undefined>;
  createTransactionIfNotExists(transaction: InsertTransaction): Promise<Transaction | null>;

  // Wix Integrations
  getWixIntegrations(userId: string): Promise<WixIntegration[]>;
  getWixIntegration(userId: string, id: string): Promise<WixIntegration | undefined>;
  createWixIntegration(data: InsertWixIntegration): Promise<WixIntegration>;
  updateWixIntegration(userId: string, id: string, data: Partial<WixIntegration>): Promise<WixIntegration | undefined>;
  deleteWixIntegration(userId: string, id: string): Promise<boolean>;

  // Merchants
  getMerchant(id: string): Promise<Merchant | undefined>;
  getMerchants(limit?: number, offset?: number, status?: string, search?: string, excludeApproved?: boolean): Promise<Merchant[]>;
  getMerchantCount(status?: string, excludeApproved?: boolean): Promise<number>;
  createMerchant(data: InsertMerchant): Promise<Merchant>;
  updateMerchant(id: string, data: Partial<Merchant>): Promise<Merchant | undefined>;
  deleteMerchant(id: string): Promise<boolean>;

  // Merchant Owners
  getMerchantOwners(merchantId: string): Promise<MerchantOwner[]>;
  createMerchantOwner(data: InsertMerchantOwner): Promise<MerchantOwner>;
  updateMerchantOwner(id: string, data: Partial<MerchantOwner>): Promise<MerchantOwner | undefined>;
  deleteMerchantOwner(id: string): Promise<boolean>;

  // Merchant Users
  getMerchantUsers(merchantId: string): Promise<(MerchantUser & { user: User })[]>;
  createMerchantUser(data: InsertMerchantUser): Promise<MerchantUser>;
  updateMerchantUser(id: string, data: Partial<MerchantUser>): Promise<MerchantUser | undefined>;
  deleteMerchantUser(id: string): Promise<boolean>;

  // Onboarding Tasks
  getOnboardingTasks(merchantId: string): Promise<OnboardingTask[]>;
  upsertOnboardingTask(data: InsertOnboardingTask): Promise<OnboardingTask>;

  // Merchant Notes
  getMerchantNotes(merchantId: string): Promise<(MerchantNote & { author: User })[]>;
  createMerchantNote(data: InsertMerchantNote): Promise<MerchantNote>;

  // Merchant Events
  getMerchantEvents(merchantId: string): Promise<MerchantEvent[]>;
  createMerchantEvent(data: InsertMerchantEvent): Promise<MerchantEvent>;

  // User Merchant Management
  linkUserToMerchant(userId: string, merchantId: string): Promise<User>;
  updateUserRole(userId: string, role: string | null): Promise<User | undefined>;

  // Staff - Merchant Data Access
  getTransactionsByMerchant(merchantId: string, limit?: number, offset?: number, search?: string): Promise<Transaction[]>;
  getInvoicesByMerchant(merchantId: string, limit?: number, offset?: number): Promise<Invoice[]>;
  getPayoutsByMerchant(merchantId: string, limit?: number, offset?: number): Promise<Payout[]>;
  getCustomersByMerchant(merchantId: string, limit?: number, offset?: number, search?: string): Promise<Customer[]>;

  // Checkout Settings
  getCheckoutSettings(merchantId: string): Promise<CheckoutSettings | undefined>;
  upsertCheckoutSettings(merchantId: string, data: Partial<InsertCheckoutSettings>): Promise<CheckoutSettings>;

  // Demo Management
  setUserDemoActive(userId: string, active: boolean): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: { email: string; password?: string | null; firstName?: string | null; lastName?: string | null; profileImageUrl?: string; role?: string | null; merchantId?: string | null }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: userData.password || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        role: userData.role ?? 'merchant_pending',
        merchantId: userData.merchantId || null,
      })
      .returning();
    return user;
  }

  async getPigBankTeamMembers(): Promise<User[]> {
    return await db.select().from(users)
      .where(or(eq(users.role, 'pigbank_admin'), eq(users.role, 'pigbank_staff')))
      .orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, data: { firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User | undefined> {
    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.profileImageUrl !== undefined) updateData.profileImageUrl = data.profileImageUrl;
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Transactions
  async getTransactions(userId: string, limit: number = 50, offset: number = 0, search?: string): Promise<Transaction[]> {
    if (search) {
      return await db.select().from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            or(
              like(transactions.transactionId, `%${search}%`),
              like(transactions.customerName, `%${search}%`),
              like(transactions.customerEmail, `%${search}%`)
            )
          )
        )
        .orderBy(desc(transactions.date))
        .limit(limit)
        .offset(offset);
    }
    
    return await db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(limit)
      .offset(offset);
  }

  async getTransaction(userId: string, id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransactionCount(userId: string): Promise<number> {
    const result = await db.select({ count: transactions.id }).from(transactions)
      .where(eq(transactions.userId, userId));
    return result.length;
  }

  // Customers
  async getCustomers(userId: string, limit: number = 50, offset: number = 0, search?: string): Promise<Customer[]> {
    if (search) {
      return await db.select().from(customers)
        .where(
          and(
            eq(customers.userId, userId),
            or(
              like(customers.name, `%${search}%`),
              like(customers.email, `%${search}%`)
            )
          )
        )
        .orderBy(desc(customers.firstSeen))
        .limit(limit)
        .offset(offset);
    }
    
    return await db.select().from(customers)
      .where(eq(customers.userId, userId))
      .orderBy(desc(customers.firstSeen))
      .limit(limit)
      .offset(offset);
  }

  async getCustomer(userId: string, id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers)
      .where(and(eq(customers.id, id), eq(customers.userId, userId)));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  async updateCustomer(userId: string, id: string, updateData: Partial<Customer>): Promise<Customer | undefined> {
    const allowedFields = ['name', 'email', 'totalTransactions', 'totalSpent', 'riskLevel', 'status'];
    const sanitizedData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in updateData) {
        sanitizedData[field] = (updateData as any)[field];
      }
    }
    
    if (Object.keys(sanitizedData).length === 0) {
      return this.getCustomer(userId, id);
    }
    
    const [customer] = await db
      .update(customers)
      .set(sanitizedData)
      .where(and(eq(customers.id, id), eq(customers.userId, userId)))
      .returning();
    return customer || undefined;
  }

  // Invoices
  async getInvoices(userId: string, limit: number = 50, offset: number = 0): Promise<Invoice[]> {
    return await db.select().from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getInvoice(userId: string, id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
    return invoice || undefined;
  }

  async createInvoice(insertInvoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(insertInvoice)
      .returning();

    // Insert invoice items
    if (items.length > 0) {
      await db.insert(invoiceItems).values(
        items.map(item => ({ ...item, invoiceId: invoice.id }))
      );
    }

    return invoice;
  }

  async updateInvoice(userId: string, id: string, updateData: Partial<Invoice>): Promise<Invoice | undefined> {
    const allowedFields = ['customerId', 'customerName', 'customerEmail', 'status', 'dueDate', 'subtotal', 'tax', 'total', 'notes', 'paidAt'];
    const sanitizedData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in updateData) {
        sanitizedData[field] = (updateData as any)[field];
      }
    }
    
    if (Object.keys(sanitizedData).length === 0) {
      return this.getInvoice(userId, id);
    }
    
    const [invoice] = await db
      .update(invoices)
      .set(sanitizedData)
      .where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
      .returning();
    return invoice || undefined;
  }

  async deleteInvoice(userId: string, id: string): Promise<boolean> {
    const result = await db.delete(invoices).where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Invoice Items
  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
  }

  // Payouts
  async getPayouts(userId: string, limit: number = 50, offset: number = 0): Promise<Payout[]> {
    return await db.select().from(payouts)
      .where(eq(payouts.userId, userId))
      .orderBy(desc(payouts.date))
      .limit(limit)
      .offset(offset);
  }

  async getPayout(userId: string, id: string): Promise<Payout | undefined> {
    const [payout] = await db.select().from(payouts)
      .where(and(eq(payouts.id, id), eq(payouts.userId, userId)));
    return payout || undefined;
  }

  async createPayout(insertPayout: InsertPayout): Promise<Payout> {
    const [payout] = await db
      .insert(payouts)
      .values(insertPayout)
      .returning();
    return payout;
  }

  // Bankful Imports
  async getBankfulImports(userId: string, limit: number = 10): Promise<BankfulImport[]> {
    return await db.select().from(bankfulImports)
      .where(eq(bankfulImports.userId, userId))
      .orderBy(desc(bankfulImports.startedAt))
      .limit(limit);
  }

  async createBankfulImport(data: InsertBankfulImport): Promise<BankfulImport> {
    const [importRecord] = await db
      .insert(bankfulImports)
      .values(data)
      .returning();
    return importRecord;
  }

  async updateBankfulImport(id: string, data: Partial<BankfulImport>): Promise<BankfulImport | undefined> {
    const [updated] = await db
      .update(bankfulImports)
      .set(data)
      .where(eq(bankfulImports.id, id))
      .returning();
    return updated || undefined;
  }

  async createTransactionIfNotExists(transaction: InsertTransaction): Promise<Transaction | null> {
    const existing = await db.select().from(transactions)
      .where(eq(transactions.transactionId, transaction.transactionId))
      .limit(1);
    
    if (existing.length > 0) {
      return null;
    }

    const [created] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return created;
  }

  // Wix Integrations
  async getWixIntegrations(userId: string): Promise<WixIntegration[]> {
    return await db.select().from(wixIntegrations)
      .where(eq(wixIntegrations.userId, userId))
      .orderBy(desc(wixIntegrations.createdAt));
  }

  async getWixIntegration(userId: string, id: string): Promise<WixIntegration | undefined> {
    const [integration] = await db.select().from(wixIntegrations)
      .where(and(eq(wixIntegrations.id, id), eq(wixIntegrations.userId, userId)));
    return integration || undefined;
  }

  async createWixIntegration(data: InsertWixIntegration): Promise<WixIntegration> {
    const [integration] = await db
      .insert(wixIntegrations)
      .values(data)
      .returning();
    return integration;
  }

  async updateWixIntegration(userId: string, id: string, data: Partial<WixIntegration>): Promise<WixIntegration | undefined> {
    const updateData: Record<string, any> = { updatedAt: new Date() };
    const allowedFields = ['siteId', 'siteName', 'apiKey', 'accountId', 'isActive', 'webhookUrl', 'lastSyncAt'];
    for (const field of allowedFields) {
      if (field in data) {
        updateData[field] = (data as any)[field];
      }
    }

    const [updated] = await db
      .update(wixIntegrations)
      .set(updateData)
      .where(and(eq(wixIntegrations.id, id), eq(wixIntegrations.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteWixIntegration(userId: string, id: string): Promise<boolean> {
    const result = await db.delete(wixIntegrations)
      .where(and(eq(wixIntegrations.id, id), eq(wixIntegrations.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Demo/Utility methods
  async clearUserData(userId: string): Promise<void> {
    await db.delete(transactions).where(eq(transactions.userId, userId));
    await db.delete(customers).where(eq(customers.userId, userId));
    await db.delete(payouts).where(eq(payouts.userId, userId));
    // Delete invoice items first (foreign key), then invoices
    const userInvoices = await db.select({ id: invoices.id }).from(invoices).where(eq(invoices.userId, userId));
    for (const inv of userInvoices) {
      await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, inv.id));
    }
    await db.delete(invoices).where(eq(invoices.userId, userId));
    
    // Delete demo merchants (those not linked to a real user via merchantId on users table)
    // First get all merchant IDs that are linked to real users
    const realUserMerchants = await db.select({ merchantId: users.merchantId })
      .from(users)
      .where(and(
        sql`${users.merchantId} IS NOT NULL`,
        ne(users.password, 'demo-user-no-login')
      ));
    const realMerchantIds = realUserMerchants.map(u => u.merchantId).filter(Boolean) as string[];
    
    // Delete demo users (users with password = 'demo-user-no-login')
    await db.delete(users).where(eq(users.password, 'demo-user-no-login'));
    
    // Delete demo merchants (merchants not linked to real users)
    const allMerchants = await db.select({ id: merchants.id }).from(merchants);
    for (const m of allMerchants) {
      if (!realMerchantIds.includes(m.id)) {
        // Delete merchant related data first
        await db.delete(merchantUsers).where(eq(merchantUsers.merchantId, m.id));
        await db.delete(merchantOwners).where(eq(merchantOwners.merchantId, m.id));
        await db.delete(merchantNotes).where(eq(merchantNotes.merchantId, m.id));
        await db.delete(merchantEvents).where(eq(merchantEvents.merchantId, m.id));
        await db.delete(onboardingTasks).where(eq(onboardingTasks.merchantId, m.id));
        await db.delete(merchants).where(eq(merchants.id, m.id));
      }
    }
  }

  async createTransactionWithDate(transaction: InsertTransaction, date: Date): Promise<Transaction> {
    const [created] = await db
      .insert(transactions)
      .values({ ...transaction, date })
      .returning();
    return created;
  }

  async createPayoutWithDate(payout: InsertPayout, date: Date): Promise<Payout> {
    const [created] = await db
      .insert(payouts)
      .values({ ...payout, date })
      .returning();
    return created;
  }

  async createInvoiceSimple(invoice: InsertInvoice): Promise<Invoice> {
    const [created] = await db
      .insert(invoices)
      .values(invoice)
      .returning();
    return created;
  }

  // Merchants
  async getMerchant(id: string): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.id, id));
    return merchant || undefined;
  }

  async getMerchants(limit: number = 50, offset: number = 0, status?: string, search?: string, excludeApproved: boolean = false): Promise<Merchant[]> {
    let query = db.select().from(merchants);
    const conditions: any[] = [];
    
    if (status && status !== 'all') {
      conditions.push(eq(merchants.status, status));
    }
    if (excludeApproved) {
      conditions.push(ne(merchants.status, 'approved'));
    }
    if (search) {
      conditions.push(or(
        like(merchants.legalBusinessName, `%${search}%`),
        like(merchants.dba, `%${search}%`)
      ));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(merchants.createdAt)).limit(limit).offset(offset);
  }

  async getMerchantCount(status?: string, excludeApproved: boolean = false): Promise<number> {
    const conditions: any[] = [];
    if (status && status !== 'all') {
      conditions.push(eq(merchants.status, status));
    }
    if (excludeApproved) {
      conditions.push(ne(merchants.status, 'approved'));
    }
    
    if (conditions.length > 0) {
      const result = await db.select({ count: sql<number>`count(*)` }).from(merchants)
        .where(and(...conditions));
      return Number(result[0]?.count || 0);
    }
    const result = await db.select({ count: sql<number>`count(*)` }).from(merchants);
    return Number(result[0]?.count || 0);
  }

  async createMerchant(data: InsertMerchant): Promise<Merchant> {
    const [merchant] = await db.insert(merchants).values(data).returning();
    return merchant;
  }

  async updateMerchant(id: string, data: Partial<Merchant>): Promise<Merchant | undefined> {
    const [updated] = await db
      .update(merchants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(merchants.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMerchant(id: string): Promise<boolean> {
    // Delete related records first (cascade)
    await db.delete(merchantOwners).where(eq(merchantOwners.merchantId, id));
    await db.delete(merchantUsers).where(eq(merchantUsers.merchantId, id));
    await db.delete(onboardingTasks).where(eq(onboardingTasks.merchantId, id));
    await db.delete(merchantNotes).where(eq(merchantNotes.merchantId, id));
    await db.delete(merchantEvents).where(eq(merchantEvents.merchantId, id));
    
    // Delete the merchant
    const result = await db.delete(merchants).where(eq(merchants.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Merchant Owners
  async getMerchantOwners(merchantId: string): Promise<MerchantOwner[]> {
    return await db.select().from(merchantOwners).where(eq(merchantOwners.merchantId, merchantId));
  }

  async createMerchantOwner(data: InsertMerchantOwner): Promise<MerchantOwner> {
    const [owner] = await db.insert(merchantOwners).values(data).returning();
    return owner;
  }

  async updateMerchantOwner(id: string, data: Partial<MerchantOwner>): Promise<MerchantOwner | undefined> {
    const [updated] = await db
      .update(merchantOwners)
      .set(data)
      .where(eq(merchantOwners.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMerchantOwner(id: string): Promise<boolean> {
    const result = await db.delete(merchantOwners).where(eq(merchantOwners.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Merchant Users
  async getMerchantUsers(merchantId: string): Promise<(MerchantUser & { user: User })[]> {
    const result = await db.select().from(merchantUsers)
      .innerJoin(users, eq(merchantUsers.userId, users.id))
      .where(eq(merchantUsers.merchantId, merchantId));
    return result.map(r => ({ ...r.merchant_users, user: r.users }));
  }

  async createMerchantUser(data: InsertMerchantUser): Promise<MerchantUser> {
    const [mu] = await db.insert(merchantUsers).values(data).returning();
    return mu;
  }

  async updateMerchantUser(id: string, data: Partial<MerchantUser>): Promise<MerchantUser | undefined> {
    const [updated] = await db
      .update(merchantUsers)
      .set(data)
      .where(eq(merchantUsers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMerchantUser(id: string): Promise<boolean> {
    const result = await db.delete(merchantUsers).where(eq(merchantUsers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Onboarding Tasks
  async getOnboardingTasks(merchantId: string): Promise<OnboardingTask[]> {
    return await db.select().from(onboardingTasks).where(eq(onboardingTasks.merchantId, merchantId));
  }

  async upsertOnboardingTask(data: InsertOnboardingTask): Promise<OnboardingTask> {
    const [task] = await db
      .insert(onboardingTasks)
      .values(data)
      .onConflictDoUpdate({
        target: [onboardingTasks.merchantId, onboardingTasks.taskKey],
        set: { status: data.status, internalNotes: data.internalNotes, updatedAt: new Date() },
      })
      .returning();
    return task;
  }

  // Merchant Notes
  async getMerchantNotes(merchantId: string): Promise<(MerchantNote & { author: User })[]> {
    const result = await db.select().from(merchantNotes)
      .innerJoin(users, eq(merchantNotes.authorId, users.id))
      .where(eq(merchantNotes.merchantId, merchantId))
      .orderBy(desc(merchantNotes.createdAt));
    return result.map(r => ({ ...r.merchant_notes, author: r.users }));
  }

  async createMerchantNote(data: InsertMerchantNote): Promise<MerchantNote> {
    const [note] = await db.insert(merchantNotes).values(data).returning();
    return note;
  }

  // Merchant Events
  async getMerchantEvents(merchantId: string): Promise<MerchantEvent[]> {
    return await db.select().from(merchantEvents)
      .where(eq(merchantEvents.merchantId, merchantId))
      .orderBy(desc(merchantEvents.createdAt));
  }

  async createMerchantEvent(data: InsertMerchantEvent): Promise<MerchantEvent> {
    const [event] = await db.insert(merchantEvents).values(data).returning();
    return event;
  }

  // User Merchant Management
  async linkUserToMerchant(userId: string, merchantId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ merchantId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserRole(userId: string, role: string | null): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  // Staff - Merchant Data Access
  async getTransactionsByMerchant(merchantId: string, limit: number = 50, offset: number = 0, search?: string): Promise<Transaction[]> {
    const merchantUserIds = await db.select({ userId: users.id })
      .from(users)
      .where(eq(users.merchantId, merchantId));
    
    if (merchantUserIds.length === 0) return [];
    
    const userIds = merchantUserIds.map(u => u.userId);
    const conditions: any[] = [sql`${transactions.userId} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`];
    
    if (search) {
      conditions.push(or(
        like(transactions.transactionId, `%${search}%`),
        like(transactions.customerName, `%${search}%`),
        like(transactions.customerEmail, `%${search}%`)
      ));
    }
    
    return await db.select().from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.date))
      .limit(limit)
      .offset(offset);
  }

  async getInvoicesByMerchant(merchantId: string, limit: number = 50, offset: number = 0): Promise<Invoice[]> {
    const merchantUserIds = await db.select({ userId: users.id })
      .from(users)
      .where(eq(users.merchantId, merchantId));
    
    if (merchantUserIds.length === 0) return [];
    
    const userIds = merchantUserIds.map(u => u.userId);
    return await db.select().from(invoices)
      .where(sql`${invoices.userId} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`)
      .orderBy(desc(invoices.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getPayoutsByMerchant(merchantId: string, limit: number = 50, offset: number = 0): Promise<Payout[]> {
    const merchantUserIds = await db.select({ userId: users.id })
      .from(users)
      .where(eq(users.merchantId, merchantId));
    
    if (merchantUserIds.length === 0) return [];
    
    const userIds = merchantUserIds.map(u => u.userId);
    return await db.select().from(payouts)
      .where(sql`${payouts.userId} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`)
      .orderBy(desc(payouts.date))
      .limit(limit)
      .offset(offset);
  }

  async getCustomersByMerchant(merchantId: string, limit: number = 50, offset: number = 0, search?: string): Promise<Customer[]> {
    const merchantUserIds = await db.select({ userId: users.id })
      .from(users)
      .where(eq(users.merchantId, merchantId));
    
    if (merchantUserIds.length === 0) return [];
    
    const userIds = merchantUserIds.map(u => u.userId);
    const conditions: any[] = [sql`${customers.userId} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`];
    
    if (search) {
      conditions.push(or(
        like(customers.name, `%${search}%`),
        like(customers.email, `%${search}%`)
      ));
    }
    
    return await db.select().from(customers)
      .where(and(...conditions))
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // Checkout Settings
  async getCheckoutSettings(merchantId: string): Promise<CheckoutSettings | undefined> {
    const [settings] = await db.select().from(checkoutSettings)
      .where(eq(checkoutSettings.merchantId, merchantId));
    return settings || undefined;
  }

  async upsertCheckoutSettings(merchantId: string, data: Partial<InsertCheckoutSettings>): Promise<CheckoutSettings> {
    const existing = await this.getCheckoutSettings(merchantId);
    
    if (existing) {
      const [updated] = await db.update(checkoutSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(checkoutSettings.merchantId, merchantId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(checkoutSettings)
        .values({ ...data, merchantId })
        .returning();
      return created;
    }
  }

  // Demo Management
  async setUserDemoActive(userId: string, active: boolean): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ demoActive: active, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }
}

export const storage = new DatabaseStorage();
