import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Global user roles
export const globalRoles = ['merchant_pending', 'merchant', 'pigbank_staff', 'pigbank_admin'] as const;
export type GlobalRole = typeof globalRoles[number];

// Merchant team roles
export const merchantRoles = ['owner', 'manager', 'staff'] as const;
export type MerchantRole = typeof merchantRoles[number];

// Merchant status
export const merchantStatuses = ['draft', 'submitted', 'action_required', 'in_onboarding', 'approved', 'rejected', 'suspended'] as const;
export type MerchantStatus = typeof merchantStatuses[number];

// Onboarding task statuses
export const onboardingTaskStatuses = ['not_started', 'in_progress', 'complete'] as const;
export type OnboardingTaskStatus = typeof onboardingTaskStatuses[number];

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull().default('merchant_pending'),
  merchantId: varchar("merchant_id"),
  demoActive: boolean("demo_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Merchants table - main merchant profile
export const merchants = pgTable("merchants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default('draft'),
  onboardingStatus: text("onboarding_status").notNull().default('pending'),
  riskLevel: text("risk_level"),
  chargebackRate: decimal("chargeback_rate", { precision: 5, scale: 2 }),
  monthlyVolume: decimal("monthly_volume", { precision: 12, scale: 2 }),
  
  // Business info
  legalBusinessName: text("legal_business_name"),
  dba: text("dba"),
  ein: text("ein"),
  businessAddress: text("business_address"),
  businessCity: text("business_city"),
  businessState: text("business_state"),
  businessZip: text("business_zip"),
  businessCountry: text("business_country"),
  businessType: text("business_type"),
  
  // Website & products
  websiteUrl: text("website_url"),
  productDescription: text("product_description"),
  mccCategory: text("mcc_category"),
  mccCategoryOther: text("mcc_category_other"),
  expectedMonthlyVolume: decimal("expected_monthly_volume", { precision: 12, scale: 2 }),
  averageTicketSize: decimal("average_ticket_size", { precision: 10, scale: 2 }),
  
  // Bank & payouts
  bankName: text("bank_name"),
  bankRoutingNumber: text("bank_routing_number"),
  bankAccountNumber: text("bank_account_number"),
  bankAccountType: text("bank_account_type"),
  
  // Documents
  articlesOfIncorporationUrl: text("articles_of_incorporation_url"),
  bankVerificationDocumentUrl: text("bank_verification_document_url"),
  
  // Notification preferences
  emailNotifications: boolean("email_notifications").notNull().default(true),
  smsNotifications: boolean("sms_notifications").notNull().default(false),
  notificationPhone: text("notification_phone"),
  notificationEmail: text("notification_email"),
  additionalEmails: text("additional_emails").array(),
  additionalPhones: text("additional_phones").array(),
  
  // First login tracking (for welcome modal)
  hasSeenWelcome: boolean("has_seen_welcome").notNull().default(false),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
});

// Merchant owners for KYC
export const merchantOwners = pgTable("merchant_owners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  merchantId: varchar("merchant_id").notNull().references(() => merchants.id, { onDelete: 'cascade' }),
  fullName: text("full_name").notNull(),
  dateOfBirth: text("date_of_birth"),
  homeStreetAddress: text("home_street_address"),
  homeCity: text("home_city"),
  homeState: text("home_state"),
  homeZipCode: text("home_zip_code"),
  ssn: text("ssn"),
  governmentIdType: text("government_id_type"),
  governmentIdFrontUrl: text("government_id_front_url"),
  governmentIdBackUrl: text("government_id_back_url"),
  ownershipPercentage: decimal("ownership_percentage", { precision: 5, scale: 2 }),
  kycConsent: boolean("kyc_consent").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Merchant users - team roles within a merchant account
export const merchantUsers = pgTable("merchant_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  merchantId: varchar("merchant_id").notNull().references(() => merchants.id, { onDelete: 'cascade' }),
  merchantRole: text("merchant_role").notNull().default('staff'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Onboarding tasks tracking
export const onboardingTasks = pgTable("onboarding_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  merchantId: varchar("merchant_id").notNull().references(() => merchants.id, { onDelete: 'cascade' }),
  taskKey: text("task_key").notNull(),
  status: text("status").notNull().default('not_started'),
  internalNotes: text("internal_notes"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Internal notes for PigBank staff
export const merchantNotes = pgTable("merchant_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  merchantId: varchar("merchant_id").notNull().references(() => merchants.id, { onDelete: 'cascade' }),
  authorId: varchar("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Merchant events timeline
export const merchantEvents = pgTable("merchant_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  merchantId: varchar("merchant_id").notNull().references(() => merchants.id, { onDelete: 'cascade' }),
  eventType: text("event_type").notNull(),
  description: text("description"),
  actorId: varchar("actor_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  transactionId: text("transaction_id").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(),
  status: text("status").notNull(),
  risk: text("risk").notNull(),
  avs: text("avs").notNull(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  totalVolume: decimal("total_volume", { precision: 12, scale: 2 }).notNull().default('0'),
  transactionCount: integer("transaction_count").notNull().default(0),
  firstSeen: timestamp("first_seen").notNull().defaultNow(),
  risk: text("risk").notNull().default('Low'),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  billingAddress: text("billing_address"),
  shippingAddress: text("shipping_address"),
  date: timestamp("date").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default('0'),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default('0'),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default('draft'),
  notes: text("notes"),
  terms: text("terms"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  sku: text("sku"),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default('0'),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
});

export const payouts = pgTable("payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  payoutId: text("payout_id").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  destination: text("destination").notNull(),
  type: text("type").notNull(),
  arrivalDate: timestamp("arrival_date"),
});

// Bankful import history
export const bankfulImports = pgTable("bankful_imports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text("status").notNull().default('pending'),
  transactionsImported: integer("transactions_imported").notNull().default(0),
  customersImported: integer("customers_imported").notNull().default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Wix integrations
export const wixIntegrations = pgTable("wix_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  siteId: text("site_id").notNull(),
  siteName: text("site_name"),
  apiKey: text("api_key").notNull(),
  accountId: text("account_id"),
  isActive: boolean("is_active").notNull().default(true),
  webhookUrl: text("webhook_url"),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Checkout settings - merchant checkout page customization
export const checkoutSettings = pgTable("checkout_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  merchantId: varchar("merchant_id").notNull().references(() => merchants.id, { onDelete: 'cascade' }).unique(),
  brandName: text("brand_name"),
  primaryColor: text("primary_color").default('#0f172a'),
  logoUrl: text("logo_url"),
  showPhone: boolean("show_phone").default(true),
  showBillingAddress: boolean("show_billing_address").default(true),
  showCoupons: boolean("show_coupons").default(false),
  collectShipping: boolean("collect_shipping").default(false),
  buttonText: text("button_text").default('Pay Now'),
  showLockIcon: boolean("show_lock_icon").default(true),
  enableTimer: boolean("enable_timer").default(false),
  timerMinutes: integer("timer_minutes").default(10),
  showPciCompliant: boolean("show_pci_compliant").default(true),
  showSecureSsl: boolean("show_secure_ssl").default(true),
  backgroundStyle: text("background_style").default('light'),
  customCss: text("custom_css"),
  googleAnalyticsId: text("google_analytics_id"),
  facebookPixelId: text("facebook_pixel_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const invoicesRelations = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  date: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  firstSeen: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  date: true,
});

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({
  id: true,
});

export const insertPayoutSchema = createInsertSchema(payouts).omit({
  id: true,
  date: true,
});

export const insertBankfulImportSchema = createInsertSchema(bankfulImports).omit({
  id: true,
  startedAt: true,
});

export const insertWixIntegrationSchema = createInsertSchema(wixIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMerchantSchema = createInsertSchema(merchants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMerchantOwnerSchema = createInsertSchema(merchantOwners).omit({
  id: true,
  createdAt: true,
});

export const insertMerchantUserSchema = createInsertSchema(merchantUsers).omit({
  id: true,
  createdAt: true,
});

export const insertOnboardingTaskSchema = createInsertSchema(onboardingTasks).omit({
  id: true,
  updatedAt: true,
});

export const insertMerchantNoteSchema = createInsertSchema(merchantNotes).omit({
  id: true,
  createdAt: true,
});

export const insertMerchantEventSchema = createInsertSchema(merchantEvents).omit({
  id: true,
  createdAt: true,
});

export const insertCheckoutSettingsSchema = createInsertSchema(checkoutSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;

export type BankfulImport = typeof bankfulImports.$inferSelect;
export type InsertBankfulImport = z.infer<typeof insertBankfulImportSchema>;

export type WixIntegration = typeof wixIntegrations.$inferSelect;
export type InsertWixIntegration = z.infer<typeof insertWixIntegrationSchema>;

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;

export type MerchantOwner = typeof merchantOwners.$inferSelect;
export type InsertMerchantOwner = z.infer<typeof insertMerchantOwnerSchema>;

export type MerchantUser = typeof merchantUsers.$inferSelect;
export type InsertMerchantUser = z.infer<typeof insertMerchantUserSchema>;

export type OnboardingTask = typeof onboardingTasks.$inferSelect;
export type InsertOnboardingTask = z.infer<typeof insertOnboardingTaskSchema>;

export type MerchantNote = typeof merchantNotes.$inferSelect;
export type InsertMerchantNote = z.infer<typeof insertMerchantNoteSchema>;

export type MerchantEvent = typeof merchantEvents.$inferSelect;
export type InsertMerchantEvent = z.infer<typeof insertMerchantEventSchema>;

export type CheckoutSettings = typeof checkoutSettings.$inferSelect;
export type InsertCheckoutSettings = z.infer<typeof insertCheckoutSettingsSchema>;
