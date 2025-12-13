import { db } from "./db";
import { transactions, customers, payouts } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Seed sample transactions
  const sampleTransactions = [
    { transactionId: "TXN-84920", customerName: "John Doe", customerEmail: "john@example.com", amount: "129.00", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84921", customerName: "Alice Smith", customerEmail: "alice@test.com", amount: "45.50", method: "ACH", status: "Declined", risk: "High", avs: "Mismatch" },
    { transactionId: "TXN-84922", customerName: "Robert Jones", customerEmail: "rob@corp.net", amount: "999.00", method: "Crypto", status: "Declined", risk: "High", avs: "Mismatch" },
    { transactionId: "TXN-84923", customerName: "Emma Wilson", customerEmail: "emma@studio.io", amount: "12.99", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84924", customerName: "Michael Brown", customerEmail: "mike@brown.com", amount: "249.00", method: "Card", status: "Pending", risk: "Medium", avs: "Matched" },
    { transactionId: "TXN-84925", customerName: "Sarah Davis", customerEmail: "sarah@davis.co", amount: "89.99", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84926", customerName: "James Wilson", customerEmail: "j.wilson@tech.net", amount: "1250.00", method: "ACH", status: "Refunded", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84927", customerName: "Patricia Moore", customerEmail: "patty@moore.com", amount: "34.50", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84928", customerName: "Jennifer Taylor", customerEmail: "jen@taylor.com", amount: "199.00", method: "Card", status: "Partially Refunded", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84929", customerName: "Charles Anderson", customerEmail: "charlie@anderson.org", amount: "59.00", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84930", customerName: "Linda Thomas", customerEmail: "linda@thomas.net", amount: "145.00", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84931", customerName: "David Jackson", customerEmail: "david@jackson.com", amount: "75.00", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84932", customerName: "Susan White", customerEmail: "susan@white.io", amount: "420.00", method: "Crypto", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84933", customerName: "Joseph Harris", customerEmail: "joe@harris.com", amount: "29.99", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
    { transactionId: "TXN-84934", customerName: "Karen Martin", customerEmail: "karen@martin.net", amount: "150.00", method: "Card", status: "Approved", risk: "Low", avs: "Matched" },
  ];

  await db.insert(transactions).values(sampleTransactions);
  console.log("✓ Seeded transactions");

  // Seed sample customers
  const sampleCustomers = [
    { name: "Alice Smith", email: "alice@test.com", totalVolume: "12450.00", transactionCount: 142, risk: "Low" },
    { name: "John Doe", email: "john@example.com", totalVolume: "8220.00", transactionCount: 85, risk: "Low" },
    { name: "Robert Jones", email: "rob@corp.net", totalVolume: "45900.00", transactionCount: 320, risk: "Medium" },
    { name: "Emma Wilson", email: "emma@studio.io", totalVolume: "2100.00", transactionCount: 12, risk: "High" },
  ];

  await db.insert(customers).values(sampleCustomers);
  console.log("✓ Seeded customers");

  // Seed sample payouts
  const samplePayouts = [
    { payoutId: "PO-001", amount: "12150.20", status: "Paid", destination: "Bank ****4521", type: "Standard", arrivalDate: new Date("2025-11-28") },
    { payoutId: "PO-002", amount: "8240.00", status: "In Transit", destination: "Bank ****4521", type: "Standard", arrivalDate: new Date("2025-11-30") },
    { payoutId: "PO-003", amount: "6065.00", status: "In Transit", destination: "Bank ****4521", type: "Instant", arrivalDate: new Date("2025-11-29") },
    { payoutId: "PO-004", amount: "3420.50", status: "Failed", destination: "Bank ****4521", type: "Standard", arrivalDate: new Date("2025-11-27") },
  ];

  for (let i = 5; i <= 25; i++) {
    const statuses = ["Paid", "In Transit", "Pending"];
    const types = ["Standard", "Instant"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = (Math.random() * 10000 + 1000).toFixed(2);
    
    samplePayouts.push({
      payoutId: `PO-${String(i).padStart(3, '0')}`,
      amount,
      status,
      destination: "Bank ****4521",
      type,
      arrivalDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
    });
  }

  await db.insert(payouts).values(samplePayouts);
  console.log("✓ Seeded payouts");

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
