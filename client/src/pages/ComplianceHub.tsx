import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  FileText, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  DollarSign,
  Banknote,
  Edit,
  Eye,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function PoliciesTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Anti-Money Laundering (AML) Policy</CardTitle>
          <CardDescription>Procedures for detecting and preventing money laundering activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requirement</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Transaction Monitoring</TableCell>
                <TableCell>All transactions are monitored for suspicious patterns and structuring</TableCell>
                <TableCell>Real-time</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Suspicious Activity Reporting</TableCell>
                <TableCell>SARs filed with FinCEN within 30 days of detection</TableCell>
                <TableCell>As needed</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Currency Transaction Reports</TableCell>
                <TableCell>CTRs filed for cash transactions over $10,000</TableCell>
                <TableCell>Within 15 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Enhanced Due Diligence</TableCell>
                <TableCell>Additional scrutiny for high-risk merchants and transactions</TableCell>
                <TableCell>Ongoing</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Staff Training</TableCell>
                <TableCell>Annual AML training for all employees</TableCell>
                <TableCell>Annual</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Know Your Customer (KYC) Policy</CardTitle>
          <CardDescription>Customer identification and verification requirements for all merchants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Verification Type</TableHead>
                <TableHead>Required Documents</TableHead>
                <TableHead>Timing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Business Verification</TableCell>
                <TableCell>Articles of Incorporation, EIN documentation, business license</TableCell>
                <TableCell>Before approval</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Beneficial Owner ID</TableCell>
                <TableCell>Government-issued ID for all owners with 25%+ ownership</TableCell>
                <TableCell>Before approval</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Address Verification</TableCell>
                <TableCell>Utility bill or bank statement dated within 90 days</TableCell>
                <TableCell>Before approval</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bank Account Verification</TableCell>
                <TableCell>Voided check or bank letter confirming account ownership</TableCell>
                <TableCell>Before approval</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Periodic Review</TableCell>
                <TableCell>Re-verification of merchant information and documentation</TableCell>
                <TableCell>Annual</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OFAC Sanctions Screening Policy</CardTitle>
          <CardDescription>Procedures for screening against OFAC sanctions lists</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Screening Type</TableHead>
                <TableHead>Lists Checked</TableHead>
                <TableHead>Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Merchant Onboarding</TableCell>
                <TableCell>SDN List, Consolidated Sanctions List, Sectoral Sanctions</TableCell>
                <TableCell>At application</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Beneficial Owner Screening</TableCell>
                <TableCell>SDN List, PEP databases, adverse media</TableCell>
                <TableCell>At application</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Transaction Screening</TableCell>
                <TableCell>Country/region sanctions, blocked entities</TableCell>
                <TableCell>Real-time</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ongoing Monitoring</TableCell>
                <TableCell>All active merchants rescreened against updated lists</TableCell>
                <TableCell>Daily</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Match Resolution</TableCell>
                <TableCell>All potential matches reviewed within 24 hours</TableCell>
                <TableCell>As needed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Prevention Policy</CardTitle>
          <CardDescription>Framework for identifying and preventing fraudulent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Velocity Checks</TableCell>
                <TableCell>Monitor transaction frequency and amount patterns</TableCell>
                <TableCell>Auto-decline or manual review</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">AVS Verification</TableCell>
                <TableCell>Address Verification Service for all card transactions</TableCell>
                <TableCell>Decline on mismatch (configurable)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CVV Validation</TableCell>
                <TableCell>Card security code required for all CNP transactions</TableCell>
                <TableCell>Decline if missing/invalid</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">3D Secure</TableCell>
                <TableCell>Strong customer authentication for high-risk transactions</TableCell>
                <TableCell>Challenge flow triggered</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Device Fingerprinting</TableCell>
                <TableCell>Track device patterns to identify suspicious behavior</TableCell>
                <TableCell>Flag for review</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PCI DSS Compliance</CardTitle>
          <CardDescription>Payment Card Industry Data Security Standard requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requirement</TableHead>
                <TableHead>Implementation</TableHead>
                <TableHead>Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Secure Network</TableCell>
                <TableCell>Firewalls, secure configurations, no vendor defaults</TableCell>
                <TableCell>Quarterly scans</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Data Protection</TableCell>
                <TableCell>Encryption of cardholder data at rest and in transit</TableCell>
                <TableCell>Annual assessment</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Access Control</TableCell>
                <TableCell>Role-based access, unique IDs, MFA for admin access</TableCell>
                <TableCell>Quarterly review</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monitoring & Testing</TableCell>
                <TableCell>Logging, intrusion detection, penetration testing</TableCell>
                <TableCell>Annual pen test</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Security Policy</TableCell>
                <TableCell>Documented security policies and incident response plan</TableCell>
                <TableCell>Annual review</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank Secrecy Act (BSA) Compliance</CardTitle>
          <CardDescription>Federal reporting and recordkeeping requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requirement</TableHead>
                <TableHead>Threshold/Trigger</TableHead>
                <TableHead>Filing Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Currency Transaction Report</TableCell>
                <TableCell>Cash transactions exceeding $10,000</TableCell>
                <TableCell>15 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Suspicious Activity Report</TableCell>
                <TableCell>Known or suspected violations of law</TableCell>
                <TableCell>30 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Record Retention</TableCell>
                <TableCell>All transaction records and customer identification</TableCell>
                <TableCell>5 years</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Compliance Program</TableCell>
                <TableCell>Written policies, designated officer, training, audit</TableCell>
                <TableCell>Ongoing</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Independent Audit</TableCell>
                <TableCell>Third-party review of BSA/AML program</TableCell>
                <TableCell>Annual</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ReservePolicyTab() {
  const reserveTiers = [
    { 
      tier: "Standard", 
      holdPercent: 0, 
      rollingDays: 0, 
      criteria: "Low-risk merchants with 6+ months clean processing history, chargeback ratio under 0.5%",
      releaseSchedule: "No reserve required"
    },
    { 
      tier: "Moderate", 
      holdPercent: 5, 
      rollingDays: 7, 
      criteria: "Medium-risk industries, new merchants under 6 months, or chargeback ratio 0.5-1%",
      releaseSchedule: "Rolling 7-day release of oldest funds"
    },
    { 
      tier: "Elevated", 
      holdPercent: 10, 
      rollingDays: 14, 
      criteria: "High-risk MCC codes, chargeback ratio 1-1.5%, or previous compliance issues",
      releaseSchedule: "Rolling 14-day release of oldest funds"
    },
    { 
      tier: "Maximum", 
      holdPercent: 100, 
      rollingDays: 180, 
      criteria: "New high-risk accounts, chargeback ratio over 1.5%, or active dispute investigation",
      releaseSchedule: "Full hold for 180 days from last transaction"
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reserve Policy Overview</CardTitle>
          <CardDescription>Company-wide reserve requirements applied to merchants based on risk tier</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground">
            PigBank maintains a tiered reserve policy to mitigate risk exposure from chargebacks, refunds, and merchant defaults. 
            Reserve requirements are determined during underwriting and may be adjusted based on ongoing merchant performance.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reserve Tier Definitions</CardTitle>
          <CardDescription>Criteria and requirements for each reserve tier</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Hold %</TableHead>
                <TableHead>Rolling Days</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Release Schedule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reserveTiers.map((tier) => (
                <TableRow key={tier.tier}>
                  <TableCell>
                    <Badge variant="outline" className={
                      tier.tier === "Standard" ? "border-green-500 text-green-600" :
                      tier.tier === "Moderate" ? "border-yellow-500 text-yellow-600" :
                      tier.tier === "Elevated" ? "border-orange-500 text-orange-600" :
                      "border-red-500 text-red-600"
                    }>
                      {tier.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{tier.holdPercent}%</TableCell>
                  <TableCell>{tier.rollingDays > 0 ? `${tier.rollingDays} days` : "N/A"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">{tier.criteria}</TableCell>
                  <TableCell className="text-sm">{tier.releaseSchedule}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reserve Adjustment Triggers</CardTitle>
            <CardDescription>Events that may change a merchant's reserve tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-red-600">Tier Increase Triggers</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Chargeback ratio exceeds current tier threshold</li>
                  <li>• Refund ratio exceeds 15% of volume</li>
                  <li>• Fraud alert from card networks</li>
                  <li>• Compliance violation discovered</li>
                  <li>• Significant change in business model</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium text-green-600">Tier Decrease Triggers</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• 6 months of clean processing at current tier</li>
                  <li>• Chargeback ratio improves below threshold</li>
                  <li>• Successful completion of enhanced monitoring</li>
                  <li>• Upgrade to lower-risk MCC category</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reserve Release Policy</CardTitle>
            <CardDescription>Guidelines for releasing held reserves</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Rolling Reserve Release</p>
                  <p className="text-sm text-muted-foreground">
                    For Moderate and Elevated tiers, reserves are released on a rolling basis after the specified holding period.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Banknote className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Account Closure Release</p>
                  <p className="text-sm text-muted-foreground">
                    Upon account termination, reserves are held for 180 days from the last transaction to cover potential chargebacks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Early Release Request</p>
                  <p className="text-sm text-muted-foreground">
                    Merchants may request early release after 90 days of clean processing. Requires management approval.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Policy Document</CardTitle>
              <CardDescription>Download the complete reserve policy documentation</CardDescription>
            </div>
            <Button variant="outline" data-testid="button-download-reserve-policy">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">PigBank Reserve Policy v2.0</p>
                <p className="text-sm text-muted-foreground">Last updated: November 1, 2025</p>
              </div>
            </div>
            <Badge>Current Version</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ComplianceHub() {
  return (
    <Layout title="Compliance Hub">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-compliance-hub-title">Compliance Hub</h1>
          <p className="text-muted-foreground mt-1">
            Written policies and documentation for bank sponsorship
          </p>
        </div>

        <Tabs defaultValue="policies" className="w-full">
          <TabsList className="bg-[#386a1d] dark:bg-[#262626]">
            <TabsTrigger value="policies" className="flex items-center gap-2 text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-policies">
              <Shield className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="reserves" className="flex items-center gap-2 text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-reserves">
              <Banknote className="h-4 w-4" />
              Reserve Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="mt-6">
            <PoliciesTab />
          </TabsContent>
          <TabsContent value="reserves" className="mt-6">
            <ReservePolicyTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
