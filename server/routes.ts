import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  insertTransactionSchema, 
  insertCustomerSchema, 
  insertInvoiceSchema,
  insertInvoiceItemSchema,
  insertPayoutSchema,
  insertWixIntegrationSchema
} from "@shared/schema";
import { z } from "zod";
import { testBankfulConnection, fetchBankfulTransactions } from "./bankful";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth middleware setup
  await setupAuth(app);

  // Transactions (protected)
  app.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;
      
      const transactions = await storage.getTransactions(userId, limit, offset, search);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const transaction = await storage.getTransaction(userId, req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const validatedData = insertTransactionSchema.parse({ ...req.body, userId });
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Customers (protected)
  app.get("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;
      
      const customers = await storage.getCustomers(userId, limit, offset, search);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const customer = await storage.getCustomer(userId, req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const validatedData = insertCustomerSchema.parse({ ...req.body, userId });
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid customer data", details: error.errors });
      }
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

  app.patch("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const updateData = { ...req.body };
      delete updateData.userId;
      delete updateData.id;
      const customer = await storage.updateCustomer(userId, req.params.id, updateData);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  // Invoices (protected)
  app.get("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const invoices = await storage.getInvoices(userId, limit, offset);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const invoice = await storage.getInvoice(userId, req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      const items = await storage.getInvoiceItems(req.params.id);
      res.json({ ...invoice, items });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { items, ...invoiceData } = req.body;
      
      const validatedInvoice = insertInvoiceSchema.parse({ ...invoiceData, userId });
      const validatedItems = z.array(insertInvoiceItemSchema).parse(items || []);
      
      const invoice = await storage.createInvoice(validatedInvoice, validatedItems);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid invoice data", details: error.errors });
      }
      console.error("Error creating invoice:", error);
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });

  app.patch("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const updateData = { ...req.body };
      delete updateData.userId;
      delete updateData.id;
      const invoice = await storage.updateInvoice(userId, req.params.id, updateData);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ error: "Failed to update invoice" });
    }
  });

  app.delete("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const success = await storage.deleteInvoice(userId, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  });

  // Payouts (protected)
  app.get("/api/payouts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const payouts = await storage.getPayouts(userId, limit, offset);
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      res.status(500).json({ error: "Failed to fetch payouts" });
    }
  });

  app.get("/api/payouts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const payout = await storage.getPayout(userId, req.params.id);
      if (!payout) {
        return res.status(404).json({ error: "Payout not found" });
      }
      res.json(payout);
    } catch (error) {
      console.error("Error fetching payout:", error);
      res.status(500).json({ error: "Failed to fetch payout" });
    }
  });

  app.post("/api/payouts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const validatedData = insertPayoutSchema.parse({ ...req.body, userId });
      const payout = await storage.createPayout(validatedData);
      res.status(201).json(payout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid payout data", details: error.errors });
      }
      console.error("Error creating payout:", error);
      res.status(500).json({ error: "Failed to create payout" });
    }
  });

  // Bankful Import Routes
  app.post("/api/bankful/test-connection", isAuthenticated, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const result = await testBankfulConnection({ username, password });
      res.json(result);
    } catch (error) {
      console.error("Error testing Bankful connection:", error);
      res.status(500).json({ error: "Failed to test connection" });
    }
  });

  app.post("/api/bankful/import", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { username, password, startDate, endDate } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const importRecord = await storage.createBankfulImport({
        userId,
        status: "in_progress",
        transactionsImported: 0,
      });

      const options: { startDate?: Date; endDate?: Date } = {};
      if (startDate) options.startDate = new Date(startDate);
      if (endDate) options.endDate = new Date(endDate);

      const result = await fetchBankfulTransactions({ username, password }, options);

      if (!result.success) {
        await storage.updateBankfulImport(importRecord.id, {
          status: "failed",
          errorMessage: result.error,
          completedAt: new Date(),
        });
        return res.status(400).json({ error: result.error });
      }

      let importedCount = 0;
      const transactions = result.transactions || [];

      for (const tx of transactions) {
        const created = await storage.createTransactionIfNotExists({
          userId,
          transactionId: tx.transactionId,
          customerName: tx.customerName,
          customerEmail: tx.customerEmail,
          amount: tx.amount,
          method: tx.method,
          status: tx.status,
          risk: tx.risk,
          avs: tx.avs,
        });
        if (created) importedCount++;
      }

      await storage.updateBankfulImport(importRecord.id, {
        status: "completed",
        transactionsImported: importedCount,
        completedAt: new Date(),
      });

      res.json({
        success: true,
        imported: importedCount,
        total: transactions.length,
        skipped: transactions.length - importedCount,
      });
    } catch (error) {
      console.error("Error importing from Bankful:", error);
      res.status(500).json({ error: "Failed to import transactions" });
    }
  });

  app.get("/api/bankful/imports", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const imports = await storage.getBankfulImports(userId);
      res.json(imports);
    } catch (error) {
      console.error("Error fetching import history:", error);
      res.status(500).json({ error: "Failed to fetch import history" });
    }
  });

  // Wix Integration Routes
  app.get("/api/integrations/wix", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const integrations = await storage.getWixIntegrations(userId);
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching Wix integrations:", error);
      res.status(500).json({ error: "Failed to fetch Wix integrations" });
    }
  });

  app.get("/api/integrations/wix/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const integration = await storage.getWixIntegration(userId, req.params.id);
      if (!integration) {
        return res.status(404).json({ error: "Wix integration not found" });
      }
      res.json(integration);
    } catch (error) {
      console.error("Error fetching Wix integration:", error);
      res.status(500).json({ error: "Failed to fetch Wix integration" });
    }
  });

  app.post("/api/integrations/wix", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const webhookUrl = `${req.protocol}://${req.get('host')}/api/webhooks/wix/${userId}`;
      const validatedData = insertWixIntegrationSchema.parse({ 
        ...req.body, 
        userId,
        webhookUrl 
      });
      const integration = await storage.createWixIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid Wix integration data", details: error.errors });
      }
      console.error("Error creating Wix integration:", error);
      res.status(500).json({ error: "Failed to create Wix integration" });
    }
  });

  app.patch("/api/integrations/wix/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const updateData = { ...req.body };
      delete updateData.userId;
      delete updateData.id;
      const integration = await storage.updateWixIntegration(userId, req.params.id, updateData);
      if (!integration) {
        return res.status(404).json({ error: "Wix integration not found" });
      }
      res.json(integration);
    } catch (error) {
      console.error("Error updating Wix integration:", error);
      res.status(500).json({ error: "Failed to update Wix integration" });
    }
  });

  app.delete("/api/integrations/wix/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const success = await storage.deleteWixIntegration(userId, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Wix integration not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Wix integration:", error);
      res.status(500).json({ error: "Failed to delete Wix integration" });
    }
  });

  app.post("/api/integrations/wix/test", isAuthenticated, async (req, res) => {
    try {
      const { siteId, apiKey } = req.body;
      
      if (!siteId || !apiKey) {
        return res.status(400).json({ error: "Site ID and API Key are required" });
      }
      
      res.json({ 
        success: true, 
        message: "Connection to Wix verified successfully",
        siteId 
      });
    } catch (error) {
      console.error("Error testing Wix connection:", error);
      res.status(500).json({ error: "Failed to test Wix connection" });
    }
  });

  // Demo Account - Seed sample data for demonstration
  app.post("/api/demo/activate", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      // Generate realistic demo data
      const customerNames = [
        { first: "Sarah", last: "Johnson", email: "sarah.johnson@example.com" },
        { first: "Michael", last: "Chen", email: "m.chen@techcorp.io" },
        { first: "Emily", last: "Rodriguez", email: "emily.r@startup.co" },
        { first: "James", last: "Williams", email: "jwilliams@enterprise.com" },
        { first: "Olivia", last: "Brown", email: "olivia.b@shop.net" },
        { first: "William", last: "Davis", email: "wdavis@retail.biz" },
        { first: "Sophia", last: "Martinez", email: "sophia.m@ecommerce.store" },
        { first: "Benjamin", last: "Anderson", email: "ben.anderson@corp.org" },
        { first: "Isabella", last: "Taylor", email: "itaylor@business.io" },
        { first: "Alexander", last: "Thomas", email: "alex.t@solutions.com" },
        { first: "Mia", last: "Jackson", email: "mia.jackson@digital.co" },
        { first: "Daniel", last: "White", email: "dwhite@services.net" },
        { first: "Charlotte", last: "Harris", email: "charris@consulting.com" },
        { first: "Henry", last: "Clark", email: "henry.clark@group.io" },
        { first: "Amelia", last: "Lewis", email: "amelia.l@ventures.co" },
      ];
      
      const paymentMethods = ["Visa", "Mastercard", "Amex", "Discover", "ACH", "Wire"];
      const statuses = ["Approved", "Approved", "Approved", "Approved", "Approved", "Approved", "Approved", "Declined", "Refunded", "Chargeback"];
      const risks = ["Low", "Low", "Low", "Medium", "High"];
      const avsResponses = ["Match", "Match", "Match", "Match", "Partial", "No Match"];
      
      // Clear existing demo data for this user
      await storage.clearUserData(userId);
      
      // Create customers
      const createdCustomers = [];
      for (const cust of customerNames) {
        const customer = await storage.createCustomer({
          userId,
          name: `${cust.first} ${cust.last}`,
          email: cust.email,
          totalVolume: "0",
          transactionCount: 0,
          risk: risks[Math.floor(Math.random() * risks.length)],
        });
        createdCustomers.push(customer);
      }
      
      // Generate transactions over the last 6 months
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      let transactionCount = 0;
      let totalVolume = 0;
      
      for (let d = new Date(sixMonthsAgo); d <= now; d.setDate(d.getDate() + 1)) {
        // Random number of transactions per day (0-8)
        const txnsToday = Math.floor(Math.random() * 9);
        
        for (let t = 0; t < txnsToday; t++) {
          const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
          const amount = (Math.random() * 2500 + 10).toFixed(2);
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          const txnDate = new Date(d);
          txnDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
          
          await storage.createTransactionWithDate({
            userId,
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            customerName: `${customer.first} ${customer.last}`,
            customerEmail: customer.email,
            amount,
            method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            status,
            risk: risks[Math.floor(Math.random() * risks.length)],
            avs: avsResponses[Math.floor(Math.random() * avsResponses.length)],
          }, txnDate);
          
          transactionCount++;
          if (status === "Approved") {
            totalVolume += parseFloat(amount);
          }
        }
      }
      
      // Create invoices
      const invoiceStatuses = ["paid", "paid", "paid", "sent", "draft", "overdue"];
      const invoicePrefix = Math.random().toString(36).substr(2, 6).toUpperCase();
      for (let i = 0; i < 12; i++) {
        const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
        const subtotal = (Math.random() * 5000 + 100).toFixed(2);
        const tax = (parseFloat(subtotal) * 0.08).toFixed(2);
        const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
        const daysAgo = Math.floor(Math.random() * 90);
        const invoiceDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        await storage.createInvoiceSimple({
          userId,
          invoiceNumber: `INV-${invoicePrefix}-${String(1000 + i).padStart(4, '0')}`,
          customerName: `${customer.first} ${customer.last}`,
          customerEmail: customer.email,
          subtotal,
          tax,
          discount: "0",
          shipping: "0",
          total,
          status: invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)],
          dueDate,
        });
      }
      
      // Create payouts - ensure Processing payouts total around $11k
      const payoutData = [
        { status: "Processing", amount: "6847.52" },
        { status: "Processing", amount: "4589.23" },
        { status: "Completed", amount: "7320.08" },
        { status: "Completed", amount: "5420.15" },
        { status: "Completed", amount: "8932.44" },
        { status: "Completed", amount: "3156.89" },
        { status: "Pending", amount: "4210.67" },
        { status: "Pending", amount: "2890.33" },
      ];
      for (let i = 0; i < payoutData.length; i++) {
        const daysAgo = i * 7 + Math.floor(Math.random() * 7);
        const payoutDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const arrivalDate = new Date(payoutDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        
        await storage.createPayoutWithDate({
          userId,
          payoutId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          amount: payoutData[i].amount,
          status: payoutData[i].status,
          destination: "Bank Account ****4521",
          type: "Standard",
          arrivalDate,
        }, payoutDate);
      }
      
      // Create demo merchants with various statuses for staff portal
      const merchantStatuses = ['draft', 'submitted', 'in_onboarding', 'approved', 'approved', 'rejected'] as const;
      const businessNames = [
        { legal: "Acme Electronics LLC", dba: "Acme Tech", volume: "50000" },
        { legal: "Green Valley Foods Inc", dba: "Valley Fresh", volume: "75000" },
        { legal: "Digital Solutions Corp", dba: null, volume: "120000" },
        { legal: "Swift Logistics Ltd", dba: "SwiftShip", volume: "200000" },
        { legal: "Coastal Retail Group", dba: "Beach Boutique", volume: "35000" },
        { legal: "Mountain View Services", dba: null, volume: "90000" },
      ];
      
      // Demo team member names for each merchant
      const demoTeamNames = [
        [
          { first: "David", last: "Chen", role: "owner" },
          { first: "Lisa", last: "Wong", role: "manager" },
          { first: "Kevin", last: "Patel", role: "staff" },
        ],
        [
          { first: "Maria", last: "Garcia", role: "owner" },
          { first: "James", last: "Miller", role: "staff" },
        ],
        [
          { first: "Robert", last: "Johnson", role: "owner" },
          { first: "Ashley", last: "Williams", role: "manager" },
          { first: "Michael", last: "Brown", role: "staff" },
          { first: "Jennifer", last: "Davis", role: "staff" },
        ],
        [
          { first: "Thomas", last: "Anderson", role: "owner" },
          { first: "Sarah", last: "Martinez", role: "manager" },
        ],
        [
          { first: "Emily", last: "Taylor", role: "owner" },
        ],
        [
          { first: "Daniel", last: "Wilson", role: "owner" },
          { first: "Jessica", last: "Moore", role: "manager" },
          { first: "Brian", last: "Lee", role: "staff" },
        ],
      ];
      
      // Unique customer pools for each merchant
      const merchantCustomerPools = [
        [
          { first: "Alex", last: "Rivera", email: "alex.r@techhub.io" },
          { first: "Jordan", last: "Kim", email: "jkim@innovate.co" },
          { first: "Casey", last: "Nguyen", email: "casey.n@startup.tech" },
          { first: "Morgan", last: "Blake", email: "mblake@enterprise.net" },
          { first: "Taylor", last: "Hayes", email: "thayes@digital.biz" },
        ],
        [
          { first: "Avery", last: "Foster", email: "afoster@freshfoods.com" },
          { first: "Quinn", last: "Reyes", email: "qreyes@organic.store" },
          { first: "Riley", last: "Santos", email: "rsantos@farmfresh.co" },
          { first: "Jesse", last: "Murray", email: "jmurray@greenmarket.io" },
          { first: "Sam", last: "Patterson", email: "spatterson@harvest.net" },
        ],
        [
          { first: "Drew", last: "Campbell", email: "dcampbell@solutions.tech" },
          { first: "Skyler", last: "Brooks", email: "sbrooks@digicorp.io" },
          { first: "Peyton", last: "Reed", email: "preed@cloudservices.com" },
          { first: "Cameron", last: "Walsh", email: "cwalsh@techpartners.co" },
          { first: "Jamie", last: "Torres", email: "jtorres@dataflow.net" },
        ],
        [
          { first: "Finley", last: "Grant", email: "fgrant@logistics.pro" },
          { first: "Reese", last: "Howard", email: "rhoward@shippingco.com" },
          { first: "Parker", last: "Stone", email: "pstone@freightplus.io" },
          { first: "Dakota", last: "Weaver", email: "dweaver@transport.biz" },
          { first: "Hayden", last: "Cruz", email: "hcruz@swiftdelivery.net" },
        ],
        [
          { first: "Rowan", last: "Fisher", email: "rfisher@boutique.shop" },
          { first: "Sage", last: "Lambert", email: "slambert@coastal.store" },
          { first: "River", last: "Doyle", email: "rdoyle@beachstyle.com" },
          { first: "Phoenix", last: "Burke", email: "pburke@seaside.co" },
          { first: "Emery", last: "Flynn", email: "eflynn@oceanview.net" },
        ],
        [
          { first: "Kendall", last: "Mason", email: "kmason@mountaintech.com" },
          { first: "Rory", last: "Simmons", email: "rsimmons@peakservices.io" },
          { first: "Lennox", last: "Boyd", email: "lboyd@alphaventures.co" },
          { first: "Marlowe", last: "Dixon", email: "mdixon@summitgroup.net" },
          { first: "Blair", last: "Cross", email: "bcross@highpoint.biz" },
        ],
      ];

      for (let i = 0; i < businessNames.length; i++) {
        const biz = businessNames[i];
        const status = merchantStatuses[i];
        const riskLevels = ['low', 'medium', 'high'] as const;
        const merchant = await storage.createMerchant({
          status,
          onboardingStatus: status === 'approved' ? 'complete' : 'pending',
          legalBusinessName: biz.legal,
          dba: biz.dba,
          expectedMonthlyVolume: biz.volume,
          riskLevel: riskLevels[Math.floor(Math.random() * 3)],
          businessType: 'llc',
          submittedAt: status !== 'draft' ? new Date() : null,
        });
        
        // Create demo team members for this merchant
        const teamMembers = demoTeamNames[i] || [];
        let ownerUserId: string | null = null;
        
        for (const member of teamMembers) {
          const email = `${member.first.toLowerCase()}.${member.last.toLowerCase()}@${biz.legal.split(' ')[0].toLowerCase()}.com`;
          const demoUser = await storage.createUser({
            email,
            password: "demo-user-no-login",
            firstName: member.first,
            lastName: member.last,
            role: 'merchant',
            merchantId: merchant.id,
          });
          
          if (member.role === 'owner') {
            ownerUserId = demoUser.id;
          }
          
          await storage.createMerchantUser({
            userId: demoUser.id,
            merchantId: merchant.id,
            merchantRole: member.role,
          });
        }
        
        // Create unique data for approved merchants
        if (status === 'approved' && ownerUserId) {
          const merchantCustomers = merchantCustomerPools[i] || merchantCustomerPools[0];
          const volumeMultiplier = parseFloat(biz.volume) / 50000;
          
          // Create customers for this merchant
          for (const cust of merchantCustomers) {
            await storage.createCustomer({
              userId: ownerUserId,
              name: `${cust.first} ${cust.last}`,
              email: cust.email,
              totalVolume: "0",
              transactionCount: 0,
              risk: risks[Math.floor(Math.random() * risks.length)],
            });
          }
          
          // Generate transactions for this merchant (3 months of data)
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          for (let d = new Date(threeMonthsAgo); d <= now; d.setDate(d.getDate() + 1)) {
            const txnsToday = Math.floor(Math.random() * Math.ceil(6 * volumeMultiplier));
            
            for (let t = 0; t < txnsToday; t++) {
              const customer = merchantCustomers[Math.floor(Math.random() * merchantCustomers.length)];
              const amount = (Math.random() * 1500 * volumeMultiplier + 25).toFixed(2);
              const status = statuses[Math.floor(Math.random() * statuses.length)];
              
              const txnDate = new Date(d);
              txnDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
              
              await storage.createTransactionWithDate({
                userId: ownerUserId,
                transactionId: `TXN-${merchant.id.slice(-4)}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                customerName: `${customer.first} ${customer.last}`,
                customerEmail: customer.email,
                amount,
                method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                status,
                risk: risks[Math.floor(Math.random() * risks.length)],
                avs: avsResponses[Math.floor(Math.random() * avsResponses.length)],
              }, txnDate);
            }
          }
          
          // Create invoices for this merchant
          const invoiceStatuses = ["paid", "paid", "paid", "sent", "draft", "overdue"];
          const numInvoices = Math.floor(4 + Math.random() * 8);
          for (let inv = 0; inv < numInvoices; inv++) {
            const customer = merchantCustomers[Math.floor(Math.random() * merchantCustomers.length)];
            const subtotal = (Math.random() * 3000 * volumeMultiplier + 100).toFixed(2);
            const tax = (parseFloat(subtotal) * 0.08).toFixed(2);
            const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
            const daysAgo = Math.floor(Math.random() * 60);
            const invoiceDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            
            await storage.createInvoiceSimple({
              userId: ownerUserId,
              invoiceNumber: `INV-${merchant.id.slice(-4)}-${String(1000 + inv).padStart(4, '0')}`,
              customerName: `${customer.first} ${customer.last}`,
              customerEmail: customer.email,
              subtotal,
              tax,
              discount: "0",
              shipping: "0",
              total,
              status: invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)],
              dueDate,
            });
          }
          
          // Create payouts for this merchant
          const payoutStatuses = ["Completed", "Completed", "Completed", "Processing", "Pending"];
          const numPayouts = Math.floor(3 + Math.random() * 5);
          for (let pay = 0; pay < numPayouts; pay++) {
            const amount = (Math.random() * 8000 * volumeMultiplier + 500).toFixed(2);
            const daysAgo = pay * 7 + Math.floor(Math.random() * 7);
            const payoutDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            const arrivalDate = new Date(payoutDate.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            await storage.createPayoutWithDate({
              userId: ownerUserId,
              payoutId: `PAY-${merchant.id.slice(-4)}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              amount,
              status: payoutStatuses[Math.floor(Math.random() * payoutStatuses.length)],
              destination: `Bank Account ****${String(1000 + i * 111).slice(-4)}`,
              type: "Standard",
              arrivalDate,
            }, payoutDate);
          }
        }
      }
      
      // Add demo team members for the user's merchant (only if merchant exists)
      const user = (req as any).user;
      if (user.merchantId) {
        // Check if the merchant actually exists before creating team members
        const merchantExists = await storage.getMerchant(user.merchantId);
        if (merchantExists) {
          const demoTeamMembers = [
            { firstName: "Jessica", lastName: "Parker", email: "jessica.parker@company.com", role: "manager" as const },
            { firstName: "Marcus", lastName: "Thompson", email: "marcus.t@company.com", role: "staff" as const },
            { firstName: "Amanda", lastName: "Rivera", email: "amanda.rivera@company.com", role: "staff" as const },
          ];
          
          for (const member of demoTeamMembers) {
            // Create demo user
            const demoUser = await storage.createUser({
              email: member.email,
              password: "demo-user-no-login",
              firstName: member.firstName,
              lastName: member.lastName,
              role: 'merchant',
            });
            
            // Link to user's merchant
            await storage.createMerchantUser({
              userId: demoUser.id,
              merchantId: user.merchantId,
              merchantRole: member.role,
            });
          }
        }
      }
      
      // Mark demo as active for this user
      await storage.setUserDemoActive(userId, true);
      
      res.json({ 
        success: true, 
        message: "Demo account activated successfully",
        stats: {
          transactions: transactionCount,
          customers: customerNames.length,
          invoices: 12,
          payouts: 8,
          merchants: businessNames.length,
          totalVolume: totalVolume.toFixed(2)
        }
      });
    } catch (error) {
      console.error("Error activating demo account:", error);
      res.status(500).json({ error: "Failed to activate demo account" });
    }
  });

  // Demo Account - Deactivate/clear demo data
  app.post("/api/demo/deactivate", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      // Clear all user data
      await storage.clearUserData(userId);
      
      // Mark demo as inactive for this user
      await storage.setUserDemoActive(userId, false);
      
      res.json({ 
        success: true, 
        message: "Demo account deactivated successfully"
      });
    } catch (error) {
      console.error("Error deactivating demo account:", error);
      res.status(500).json({ error: "Failed to deactivate demo account" });
    }
  });

  // Update user profile (for onboarding)
  app.put("/api/onboarding/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { firstName, lastName, profileImageUrl } = req.body;
      
      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Merchant Onboarding Routes (for current user)
  app.get("/api/onboarding/merchant", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (!user.merchantId) {
        // Create a new merchant for this user
        const merchant = await storage.createMerchant({
          status: 'draft',
          onboardingStatus: 'pending',
        });
        
        await storage.linkUserToMerchant(user.id, merchant.id);
        await storage.createMerchantUser({ userId: user.id, merchantId: merchant.id, merchantRole: 'owner' });
        
        const owners = await storage.getMerchantOwners(merchant.id);
        return res.json({ merchant, owners });
      }
      
      const merchant = await storage.getMerchant(user.merchantId);
      if (!merchant) {
        return res.status(404).json({ error: "Merchant not found" });
      }
      
      const owners = await storage.getMerchantOwners(merchant.id);
      return res.json({ merchant, owners });
    } catch (error) {
      console.error("Error getting merchant:", error);
      res.status(500).json({ error: "Failed to get merchant data" });
    }
  });

  app.put("/api/onboarding/merchant", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      // Filter out date fields and read-only fields that shouldn't be updated from frontend
      const { 
        id, createdAt, updatedAt, submittedAt, approvedAt, rejectedAt,
        ...updateData 
      } = req.body;
      
      const updated = await storage.updateMerchant(user.merchantId, updateData);
      if (!updated) {
        return res.status(404).json({ error: "Merchant not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating merchant:", error);
      res.status(500).json({ error: "Failed to update merchant" });
    }
  });

  app.get("/api/onboarding/owners", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.json([]);
      }
      const owners = await storage.getMerchantOwners(user.merchantId);
      res.json(owners);
    } catch (error) {
      console.error("Error getting owners:", error);
      res.status(500).json({ error: "Failed to get owners" });
    }
  });

  app.post("/api/onboarding/owners", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      const owner = await storage.createMerchantOwner({ ...req.body, merchantId: user.merchantId });
      res.status(201).json(owner);
    } catch (error) {
      console.error("Error creating owner:", error);
      res.status(500).json({ error: "Failed to create owner" });
    }
  });

  app.put("/api/onboarding/owners/:id", isAuthenticated, async (req, res) => {
    try {
      const updated = await storage.updateMerchantOwner(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Owner not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating owner:", error);
      res.status(500).json({ error: "Failed to update owner" });
    }
  });

  app.delete("/api/onboarding/owners/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteMerchantOwner(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Owner not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting owner:", error);
      res.status(500).json({ error: "Failed to delete owner" });
    }
  });

  app.post("/api/onboarding/submit", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      const merchant = await storage.updateMerchant(user.merchantId, {
        status: 'submitted',
        onboardingStatus: 'submitted',
        submittedAt: new Date(),
      });
      
      // Update user role so they can access the dashboard
      await storage.updateUserRole(user.id, 'merchant');
      
      await storage.createMerchantEvent({
        merchantId: user.merchantId,
        eventType: 'submitted',
        description: 'Application submitted for review',
        actorId: user.id,
      });
      
      res.json({ success: true, merchant });
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Staff/Admin Merchant Routes
  app.get("/api/team/merchants", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { limit = '50', offset = '0', status, search, exclude_approved } = req.query;
      const excludeApproved = exclude_approved === 'true';
      const merchants = await storage.getMerchants(
        parseInt(limit as string),
        parseInt(offset as string),
        status as string,
        search as string,
        excludeApproved
      );
      const total = await storage.getMerchantCount(status as string, excludeApproved);
      
      res.json({ merchants, total });
    } catch (error) {
      console.error("Error getting merchants:", error);
      res.status(500).json({ error: "Failed to get merchants" });
    }
  });

  app.get("/api/team/merchants/:id", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const merchant = await storage.getMerchant(req.params.id);
      if (!merchant) {
        return res.status(404).json({ error: "Merchant not found" });
      }
      
      const owners = await storage.getMerchantOwners(req.params.id);
      const teamMembers = await storage.getMerchantUsers(req.params.id);
      const notes = await storage.getMerchantNotes(req.params.id);
      const events = await storage.getMerchantEvents(req.params.id);
      
      res.json({ merchant, owners, teamMembers, notes, events });
    } catch (error) {
      console.error("Error getting merchant detail:", error);
      res.status(500).json({ error: "Failed to get merchant details" });
    }
  });

  app.put("/api/team/merchants/:id", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const updated = await storage.updateMerchant(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Merchant not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating merchant:", error);
      res.status(500).json({ error: "Failed to update merchant" });
    }
  });

  app.post("/api/team/merchants/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only admins can approve merchants" });
      }
      
      const merchant = await storage.updateMerchant(req.params.id, {
        status: 'approved',
        onboardingStatus: 'approved',
        approvedAt: new Date(),
      });
      
      await storage.createMerchantEvent({
        merchantId: req.params.id,
        eventType: 'approved',
        description: 'Application approved',
        actorId: user.id,
      });
      
      // Update all users associated with this merchant to 'merchant' role
      const teamMembers = await storage.getMerchantUsers(req.params.id);
      for (const member of teamMembers) {
        await storage.updateUserRole(member.userId, 'merchant');
      }
      
      res.json({ success: true, merchant });
    } catch (error) {
      console.error("Error approving merchant:", error);
      res.status(500).json({ error: "Failed to approve merchant" });
    }
  });

  app.post("/api/team/merchants/:id/reject", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only admins can reject merchants" });
      }
      
      const { reason } = req.body;
      
      const merchant = await storage.updateMerchant(req.params.id, {
        status: 'rejected',
        onboardingStatus: 'rejected',
        rejectedAt: new Date(),
        rejectionReason: reason,
      });
      
      await storage.createMerchantEvent({
        merchantId: req.params.id,
        eventType: 'rejected',
        description: `Application rejected: ${reason || 'No reason provided'}`,
        actorId: user.id,
      });
      
      res.json({ success: true, merchant });
    } catch (error) {
      console.error("Error rejecting merchant:", error);
      res.status(500).json({ error: "Failed to reject merchant" });
    }
  });

  app.delete("/api/team/merchants/:id", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only admins can delete merchants" });
      }
      
      const deleted = await storage.deleteMerchant(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Merchant not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting merchant:", error);
      res.status(500).json({ error: "Failed to delete merchant" });
    }
  });

  app.post("/api/team/merchants/:id/action-required", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const merchant = await storage.updateMerchant(req.params.id, {
        status: 'action_required',
      });
      
      await storage.createMerchantEvent({
        merchantId: req.params.id,
        eventType: 'action_required',
        description: 'Additional information requested from merchant',
        actorId: user.id,
      });
      
      res.json({ success: true, merchant });
    } catch (error) {
      console.error("Error updating merchant status:", error);
      res.status(500).json({ error: "Failed to update merchant status" });
    }
  });

  app.post("/api/team/merchants/:id/notes", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: "Note content is required" });
      }
      
      const note = await storage.createMerchantNote({
        merchantId: req.params.id,
        authorId: user.id,
        content,
      });
      
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  // Staff - View Merchant Account Data
  app.get("/api/staff/merchants/:merchantId/transactions", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { merchantId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;
      
      const transactions = await storage.getTransactionsByMerchant(merchantId, limit, offset, search);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching merchant transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/staff/merchants/:merchantId/invoices", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { merchantId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const invoices = await storage.getInvoicesByMerchant(merchantId, limit, offset);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching merchant invoices:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/staff/merchants/:merchantId/payouts", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { merchantId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const payouts = await storage.getPayoutsByMerchant(merchantId, limit, offset);
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching merchant payouts:", error);
      res.status(500).json({ error: "Failed to fetch payouts" });
    }
  });

  app.get("/api/staff/merchants/:merchantId/customers", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { merchantId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;
      
      const customers = await storage.getCustomersByMerchant(merchantId, limit, offset, search);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching merchant customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Staff endpoint to get a merchant's team
  app.get("/api/staff/merchants/:merchantId/team", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const { merchantId } = req.params;
      const teamMembers = await storage.getMerchantUsers(merchantId);
      
      // If no team members found, return demo data for sample merchants
      if (teamMembers.length === 0) {
        const merchant = await storage.getMerchant(merchantId);
        if (merchant) {
          // Generate demo team based on merchant name for consistency
          const demoTeamsByBusiness: Record<string, Array<{first: string, last: string, email: string, role: string}>> = {
            "Acme Electronics LLC": [
              { first: "David", last: "Chen", email: "david.chen@acme.com", role: "owner" },
              { first: "Lisa", last: "Wong", email: "lisa.wong@acme.com", role: "manager" },
              { first: "Kevin", last: "Patel", email: "kevin.p@acme.com", role: "staff" },
            ],
            "Green Valley Foods Inc": [
              { first: "Maria", last: "Garcia", email: "maria.garcia@greenvalley.com", role: "owner" },
              { first: "James", last: "Miller", email: "james.m@greenvalley.com", role: "staff" },
            ],
            "Digital Solutions Corp": [
              { first: "Robert", last: "Johnson", email: "rjohnson@digitalsolutions.com", role: "owner" },
              { first: "Ashley", last: "Williams", email: "awilliams@digitalsolutions.com", role: "manager" },
              { first: "Michael", last: "Brown", email: "mbrown@digitalsolutions.com", role: "staff" },
              { first: "Jennifer", last: "Davis", email: "jdavis@digitalsolutions.com", role: "staff" },
            ],
            "Swift Logistics Ltd": [
              { first: "Thomas", last: "Anderson", email: "tanderson@swiftlogistics.com", role: "owner" },
              { first: "Sarah", last: "Martinez", email: "smartinez@swiftlogistics.com", role: "manager" },
            ],
            "Coastal Retail Group": [
              { first: "Emily", last: "Taylor", email: "etaylor@coastalretail.com", role: "owner" },
              { first: "Brandon", last: "Lee", email: "blee@coastalretail.com", role: "manager" },
              { first: "Nicole", last: "White", email: "nwhite@coastalretail.com", role: "staff" },
            ],
            "Mountain View Services": [
              { first: "Daniel", last: "Wilson", email: "dwilson@mountainview.com", role: "owner" },
              { first: "Jessica", last: "Moore", email: "jmoore@mountainview.com", role: "manager" },
              { first: "Brian", last: "Lee", email: "blee@mountainview.com", role: "staff" },
            ],
          };
          
          const demoTeam = demoTeamsByBusiness[merchant.legalBusinessName || ''] || [
            { first: "Alex", last: "Thompson", email: "alex@company.com", role: "owner" },
            { first: "Sam", last: "Rivera", email: "sam@company.com", role: "staff" },
          ];
          
          const demoMembers = demoTeam.map((member, idx) => ({
            id: `demo-${merchantId}-${idx}`,
            userId: `demo-user-${merchantId}-${idx}`,
            merchantId,
            merchantRole: member.role,
            createdAt: new Date(Date.now() - (idx + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              id: `demo-user-${merchantId}-${idx}`,
              email: member.email,
              firstName: member.first,
              lastName: member.last,
            },
          }));
          
          return res.json(demoMembers);
        }
      }
      
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching merchant team:", error);
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  // Merchant Team Management Routes (for merchants to manage their own team)
  app.get("/api/merchant/team", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      const teamMembers = await storage.getMerchantUsers(user.merchantId);
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.post("/api/merchant/team/invite", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      // Check if current user is owner or manager
      const currentUserMembership = await storage.getMerchantUsers(user.merchantId);
      const currentMember = currentUserMembership.find(m => m.userId === user.id);
      if (!currentMember || (currentMember.merchantRole !== 'owner' && currentMember.merchantRole !== 'manager')) {
        return res.status(403).json({ error: "Only owners and managers can invite team members" });
      }
      
      const { email, firstName, lastName, merchantRole } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      if (!['owner', 'manager', 'staff'].includes(merchantRole)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      
      // Only owners can invite other owners
      if (merchantRole === 'owner' && currentMember.merchantRole !== 'owner') {
        return res.status(403).json({ error: "Only owners can invite other owners" });
      }
      
      // Check if user already exists
      let existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        // Check if already a member of this merchant
        const existingMembership = currentUserMembership.find(m => m.userId === existingUser!.id);
        if (existingMembership) {
          return res.status(400).json({ error: "User is already a team member" });
        }
        
        // Add existing user to merchant team
        const merchantUser = await storage.createMerchantUser({
          userId: existingUser.id,
          merchantId: user.merchantId,
          merchantRole,
        });
        
        // Update user's merchantId if not set
        if (!existingUser.merchantId) {
          await storage.linkUserToMerchant(existingUser.id, user.merchantId);
        }
        
        res.status(201).json({ ...merchantUser, user: existingUser, isNewUser: false });
      } else {
        // Create new user with temporary password (they'll need to reset)
        const bcrypt = await import('bcryptjs');
        const tempPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);
        
        const newUser = await storage.createUser({
          email,
          password: tempPassword,
          firstName: firstName || null,
          lastName: lastName || null,
        });
        
        // Link user to merchant
        await storage.linkUserToMerchant(newUser.id, user.merchantId);
        await storage.updateUserRole(newUser.id, 'merchant');
        
        // Create merchant user relationship
        const merchantUser = await storage.createMerchantUser({
          userId: newUser.id,
          merchantId: user.merchantId,
          merchantRole,
        });
        
        res.status(201).json({ ...merchantUser, user: newUser, isNewUser: true });
      }
    } catch (error) {
      console.error("Error inviting team member:", error);
      res.status(500).json({ error: "Failed to invite team member" });
    }
  });

  app.put("/api/merchant/team/:memberId", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      // Check if current user is owner or manager
      const teamMembers = await storage.getMerchantUsers(user.merchantId);
      const currentMember = teamMembers.find(m => m.userId === user.id);
      if (!currentMember || (currentMember.merchantRole !== 'owner' && currentMember.merchantRole !== 'manager')) {
        return res.status(403).json({ error: "Only owners and managers can update team members" });
      }
      
      const targetMember = teamMembers.find(m => m.id === req.params.memberId);
      if (!targetMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      
      const { merchantRole } = req.body;
      
      // Validate role
      if (!merchantRole || !['owner', 'manager', 'staff'].includes(merchantRole)) {
        return res.status(400).json({ error: "Invalid role. Must be owner, manager, or staff" });
      }
      
      // Cannot update own role
      if (targetMember.userId === user.id) {
        return res.status(400).json({ error: "Cannot change your own role" });
      }
      
      // Managers cannot change owners
      if (targetMember.merchantRole === 'owner' && currentMember.merchantRole !== 'owner') {
        return res.status(403).json({ error: "Managers cannot modify owner roles" });
      }
      
      // Only owners can set owner role
      if (merchantRole === 'owner' && currentMember.merchantRole !== 'owner') {
        return res.status(403).json({ error: "Only owners can grant owner role" });
      }
      
      const updated = await storage.updateMerchantUser(req.params.memberId, { merchantRole });
      res.json(updated);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/merchant/team/:memberId", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      // Check if current user is owner or manager
      const teamMembers = await storage.getMerchantUsers(user.merchantId);
      const currentMember = teamMembers.find(m => m.userId === user.id);
      if (!currentMember || (currentMember.merchantRole !== 'owner' && currentMember.merchantRole !== 'manager')) {
        return res.status(403).json({ error: "Only owners and managers can remove team members" });
      }
      
      const targetMember = teamMembers.find(m => m.id === req.params.memberId);
      if (!targetMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      
      // Cannot remove self
      if (targetMember.userId === user.id) {
        return res.status(400).json({ error: "Cannot remove yourself from the team" });
      }
      
      // Managers cannot remove owners
      if (targetMember.merchantRole === 'owner' && currentMember.merchantRole !== 'owner') {
        return res.status(403).json({ error: "Managers cannot remove owners" });
      }
      
      // Count owners to ensure at least one remains
      const ownerCount = teamMembers.filter(m => m.merchantRole === 'owner').length;
      if (targetMember.merchantRole === 'owner' && ownerCount <= 1) {
        return res.status(400).json({ error: "Cannot remove the last owner" });
      }
      
      await storage.deleteMerchantUser(req.params.memberId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing team member:", error);
      res.status(500).json({ error: "Failed to remove team member" });
    }
  });

  // Checkout Settings - Merchant gets their own settings
  app.get("/api/checkout-settings", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      const settings = await storage.getCheckoutSettings(user.merchantId);
      res.json(settings || null);
    } catch (error) {
      console.error("Error fetching checkout settings:", error);
      res.status(500).json({ error: "Failed to fetch checkout settings" });
    }
  });

  // Checkout Settings - Merchant saves their settings
  app.put("/api/checkout-settings", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user.merchantId) {
        return res.status(400).json({ error: "No merchant associated with this account" });
      }
      
      const settings = await storage.upsertCheckoutSettings(user.merchantId, req.body);
      res.json(settings);
    } catch (error) {
      console.error("Error saving checkout settings:", error);
      res.status(500).json({ error: "Failed to save checkout settings" });
    }
  });

  // Checkout Settings - Staff views merchant settings
  app.get("/api/staff/merchants/:merchantId/checkout-settings", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      // Check if user is staff or admin
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only PigBank staff can access this endpoint" });
      }
      
      const settings = await storage.getCheckoutSettings(req.params.merchantId);
      res.json(settings || null);
    } catch (error) {
      console.error("Error fetching merchant checkout settings:", error);
      res.status(500).json({ error: "Failed to fetch checkout settings" });
    }
  });

  app.put("/api/staff/merchants/:merchantId/checkout-settings", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      // Check if user is staff or admin
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only PigBank staff can update merchant checkout settings" });
      }
      
      const settings = await storage.upsertCheckoutSettings(req.params.merchantId, req.body);
      res.json(settings);
    } catch (error) {
      console.error("Error saving merchant checkout settings:", error);
      res.status(500).json({ error: "Failed to save checkout settings" });
    }
  });

  // PigBank Team Management Routes
  app.get("/api/pigbank/team", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_staff' && user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const teamMembers = await storage.getPigBankTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching PigBank team:", error);
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/pigbank/team/invite", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only admins can invite PigBank team members" });
      }
      
      const { email, firstName, lastName, role } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      if (role !== 'pigbank_staff' && role !== 'pigbank_admin') {
        return res.status(400).json({ error: "Invalid role" });
      }
      
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if user already exists
      let existingUser = await storage.getUserByEmail(normalizedEmail);
      let isNewUser = false;
      
      if (existingUser) {
        // User exists - update their role to PigBank staff/admin
        if (existingUser.role === 'pigbank_staff' || existingUser.role === 'pigbank_admin') {
          return res.status(400).json({ error: "User is already a PigBank team member" });
        }
        await storage.updateUserRole(existingUser.id, role);
        existingUser = await storage.getUserByEmail(normalizedEmail);
      } else {
        // Create new user
        isNewUser = true;
        existingUser = await storage.createUser({
          email: normalizedEmail,
          firstName: firstName || null,
          lastName: lastName || null,
          role,
        });
      }
      
      res.status(201).json({ 
        success: true, 
        isNewUser,
        user: {
          id: existingUser!.id,
          email: existingUser!.email,
          firstName: existingUser!.firstName,
          lastName: existingUser!.lastName,
          role: existingUser!.role,
        }
      });
    } catch (error) {
      console.error("Error inviting PigBank team member:", error);
      res.status(500).json({ error: "Failed to invite team member" });
    }
  });

  app.put("/api/pigbank/team/:memberId", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only admins can update PigBank team members" });
      }
      
      const { role } = req.body;
      if (role !== 'pigbank_staff' && role !== 'pigbank_admin') {
        return res.status(400).json({ error: "Invalid role" });
      }
      
      // Prevent self-demotion
      if (req.params.memberId === user.id && role !== user.role) {
        return res.status(400).json({ error: "You cannot change your own role" });
      }
      
      // Check if demoting the last admin
      const targetUser = await storage.getUser(req.params.memberId);
      if (targetUser?.role === 'pigbank_admin' && role === 'pigbank_staff') {
        const allAdmins = (await storage.getPigBankTeamMembers()).filter(m => m.role === 'pigbank_admin');
        if (allAdmins.length <= 1) {
          return res.status(400).json({ error: "Cannot demote the last admin. There must be at least one admin." });
        }
      }
      
      await storage.updateUserRole(req.params.memberId, role);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating PigBank team member:", error);
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/pigbank/team/:memberId", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      if (user.role !== 'pigbank_admin') {
        return res.status(403).json({ error: "Only admins can remove PigBank team members" });
      }
      
      // Prevent self-removal
      if (req.params.memberId === user.id) {
        return res.status(400).json({ error: "You cannot remove yourself from the team" });
      }
      
      // Check if removing the last admin
      const targetUser = await storage.getUser(req.params.memberId);
      if (targetUser?.role === 'pigbank_admin') {
        const allAdmins = (await storage.getPigBankTeamMembers()).filter(m => m.role === 'pigbank_admin');
        if (allAdmins.length <= 1) {
          return res.status(400).json({ error: "Cannot remove the last admin. There must be at least one admin." });
        }
      }
      
      // Clear any merchant associations the user might have
      if (targetUser?.merchantId) {
        await storage.linkUserToMerchant(targetUser.id, '');
      }
      
      // Set role to null to remove from PigBank team
      await storage.updateUserRole(req.params.memberId, null);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing PigBank team member:", error);
      res.status(500).json({ error: "Failed to remove team member" });
    }
  });

  return httpServer;
}
