import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, User, AlertCircle, CheckCircle2 } from "lucide-react";

const customers = [
  { name: "Alice Smith", email: "alice@test.com", volume: "$12,450", txns: 142, firstSeen: "Jan 12, 2025", risk: "Low" },
  { name: "John Doe", email: "john@example.com", volume: "$8,220", txns: 85, firstSeen: "Feb 04, 2025", risk: "Low" },
  { name: "Robert Jones", email: "rob@corp.net", volume: "$45,900", txns: 320, firstSeen: "Dec 20, 2024", risk: "Medium" },
  { name: "Emma Wilson", email: "emma@studio.io", volume: "$2,100", txns: 12, firstSeen: "Nov 15, 2025", risk: "High" },
];

export default function Customers() {
  return (
    <Layout title="Customers">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-customers-title">
              Customers
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your customer database
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers by name or email..." className="pl-9" />
          </div>
          <Button>Add Customer</Button>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Volume</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>First Seen</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c, i) => (
                  <TableRow key={i} className="group cursor-pointer hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        {c.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell>{c.volume}</TableCell>
                    <TableCell>{c.txns}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.firstSeen}</TableCell>
                    <TableCell>
                      {c.risk === "Low" && <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50"><CheckCircle2 className="h-3 w-3"/> Low</span>}
                      {c.risk === "Medium" && <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium px-2 py-1 rounded-full bg-amber-50"><AlertCircle className="h-3 w-3"/> Medium</span>}
                      {c.risk === "High" && <span className="inline-flex items-center gap-1 text-rose-600 text-xs font-medium px-2 py-1 rounded-full bg-rose-50"><AlertCircle className="h-3 w-3"/> High</span>}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground group-hover:text-primary">
                      View
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
