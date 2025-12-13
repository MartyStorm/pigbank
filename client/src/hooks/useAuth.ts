import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export type GlobalRole = 'merchant_pending' | 'merchant' | 'pigbank_staff' | 'pigbank_admin';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role: GlobalRole;
  merchantId?: string | null;
  merchantName?: string | null;
  redirectUrl?: string;
  demoActive?: boolean;
}

export function getRedirectUrlForRole(role: GlobalRole | string | null | undefined): string {
  switch (role) {
    case 'merchant_pending':
      return '/onboarding';
    case 'merchant':
      return '/dashboard';
    case 'pigbank_staff':
    case 'pigbank_admin':
      return '/dashboard';
    default:
      return '/onboarding';
  }
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn<AuthUser | null>({ on401: "returnNull" }),
    retry: false,
  });

  const isMerchant = user?.role === 'merchant';
  const isMerchantPending = user?.role === 'merchant_pending';
  const isPigBankStaff = user?.role === 'pigbank_staff' || user?.role === 'pigbank_admin';
  const isPigBankAdmin = user?.role === 'pigbank_admin';

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isMerchant,
    isMerchantPending,
    isPigBankStaff,
    isPigBankAdmin,
    role: user?.role,
    redirectUrl: user ? getRedirectUrlForRole(user.role) : '/login',
  };
}
