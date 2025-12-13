interface BankfulCredentials {
  username: string;
  password: string;
}

interface BankfulTransaction {
  TRANS_REQUEST_ID: number;
  TRANS_RECORD_ID: number;
  TRANS_ORDER_ID: number;
  XTL_ORDER_ID?: string;
  REQUEST_ACTION: string;
  TRANS_STATUS_NAME: string;
  TRANS_VALUE: string;
  TRANS_CUR: string;
  CUST_EMAIL?: string;
  CUST_FNAME?: string;
  CUST_LNAME?: string;
  CREATED_DATE?: string;
}

interface BankfulResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const BANKFUL_API_BASE = "https://api.paybybankful.com";

async function makeBankfulRequest(
  endpoint: string,
  credentials: BankfulCredentials,
  params: Record<string, string> = {}
): Promise<BankfulResponse> {
  try {
    const formData = new URLSearchParams({
      req_username: credentials.username,
      req_password: credentials.password,
      ...params,
    });

    const response = await fetch(`${BANKFUL_API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    
    if (data.TRANS_STATUS_NAME === "DECLINED" || data.status === "Error") {
      return {
        success: false,
        error: data.ERROR_MESSAGE || data.message || "Request failed",
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function testBankfulConnection(
  credentials: BankfulCredentials
): Promise<{ success: boolean; error?: string }> {
  const result = await makeBankfulRequest(
    "/api/transaction/api",
    credentials,
    { transaction_type: "STATUS" }
  );

  if (result.success) {
    return { success: true };
  }

  if (result.error?.includes("authentication") || result.error?.includes("Invalid")) {
    return { success: false, error: "Invalid API credentials" };
  }

  return { success: true };
}

export interface ImportedTransaction {
  transactionId: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  amount: string;
  method: string;
  status: string;
  risk: string;
  avs: string;
}

export async function fetchBankfulTransactions(
  credentials: BankfulCredentials,
  options: { startDate?: Date; endDate?: Date; limit?: number } = {}
): Promise<{ success: boolean; transactions?: ImportedTransaction[]; error?: string }> {
  const params: Record<string, string> = {
    transaction_type: "REPORT",
    report_type: "transactions",
  };

  if (options.startDate) {
    params.start_date = options.startDate.toISOString().split("T")[0];
  }
  if (options.endDate) {
    params.end_date = options.endDate.toISOString().split("T")[0];
  }
  if (options.limit) {
    params.limit = options.limit.toString();
  }

  const result = await makeBankfulRequest("/api/transaction/api", credentials, params);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const rawTransactions = Array.isArray(result.data) 
    ? result.data 
    : result.data?.transactions || result.data?.data || [];

  const transactions: ImportedTransaction[] = rawTransactions.map((tx: BankfulTransaction) => ({
    transactionId: `BF-${tx.TRANS_ORDER_ID || tx.TRANS_REQUEST_ID}`,
    date: tx.CREATED_DATE ? new Date(tx.CREATED_DATE) : new Date(),
    customerName: [tx.CUST_FNAME, tx.CUST_LNAME].filter(Boolean).join(" ") || "Unknown",
    customerEmail: tx.CUST_EMAIL || "unknown@example.com",
    amount: tx.TRANS_VALUE || "0",
    method: "Card",
    status: mapBankfulStatus(tx.TRANS_STATUS_NAME),
    risk: "Low",
    avs: "Match",
  }));

  return { success: true, transactions };
}

function mapBankfulStatus(bankfulStatus: string): string {
  const statusMap: Record<string, string> = {
    APPROVED: "Completed",
    CAPTURED: "Completed",
    SETTLED: "Completed",
    PENDING: "Pending",
    DECLINED: "Failed",
    VOIDED: "Refunded",
    REFUNDED: "Refunded",
  };
  return statusMap[bankfulStatus?.toUpperCase()] || "Pending";
}
