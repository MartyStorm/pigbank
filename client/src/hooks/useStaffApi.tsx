import { useMerchantView } from "./useMerchantView";
import { useAuth } from "./useAuth";

export function useStaffApi() {
  const { isPigBankStaff } = useAuth();
  const { viewingMerchant, isViewingMerchant, isInitialized } = useMerchantView();

  const getApiUrl = (baseEndpoint: string): string => {
    if (isPigBankStaff && isViewingMerchant && viewingMerchant) {
      const merchantId = viewingMerchant.id;
      switch (baseEndpoint) {
        case "/api/transactions":
          return `/api/staff/merchants/${merchantId}/transactions`;
        case "/api/invoices":
          return `/api/staff/merchants/${merchantId}/invoices`;
        case "/api/payouts":
          return `/api/staff/merchants/${merchantId}/payouts`;
        case "/api/customers":
          return `/api/staff/merchants/${merchantId}/customers`;
        default:
          return baseEndpoint;
      }
    }
    return baseEndpoint;
  };

  const getQueryKey = (baseEndpoint: string, ...additionalParams: unknown[]): unknown[] => {
    if (isPigBankStaff && isViewingMerchant && viewingMerchant) {
      return [getApiUrl(baseEndpoint), viewingMerchant.id, ...additionalParams];
    }
    return [baseEndpoint, ...additionalParams];
  };

  return {
    getApiUrl,
    getQueryKey,
    isStaffViewingMerchant: isPigBankStaff && isViewingMerchant,
    viewingMerchant,
    isInitialized,
  };
}
