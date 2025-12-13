import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/ChatWidget";
import { MerchantViewBanner } from "@/components/MerchantViewBanner";
import { useAuth } from "@/hooks/useAuth";
import { MerchantViewProvider, useMerchantView } from "@/hooks/useMerchantView";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Terminal from "@/pages/Terminal";
import HostedCheckout from "@/pages/HostedCheckout";
import Checks from "@/pages/Checks";
import Fraud from "@/pages/Fraud";
import Developers from "@/pages/Developers";
import Payouts from "@/pages/Payouts";
import Themes from "@/pages/Themes";
import CreateInvoice from "@/pages/CreateInvoice";
import InvoicesList from "@/pages/InvoicesList";
import Subscriptions from "@/pages/Subscriptions";
import Chargebacks from "@/pages/Chargebacks";
import PayByLink from "@/pages/PayByLink";
import PayByLinkDetail from "@/pages/PayByLinkDetail";
import Integrations from "@/pages/Integrations";
import WixIntegration from "@/pages/WixIntegration";
import PublicIntegrations from "@/pages/PublicIntegrations";
import PublicPricing from "@/pages/PublicPricing";
import PublicContact from "@/pages/PublicContact";
import DataImport from "@/pages/DataImport";
import Onboarding from "@/pages/Onboarding";
import TeamMerchants from "@/pages/TeamMerchants";
import TeamApprovedMerchants from "@/pages/TeamApprovedMerchants";
import TeamMerchantDetail from "@/pages/TeamMerchantDetail";
import TeamLogin from "@/pages/TeamLogin";
import Team from "@/pages/Team";
import PigBankTeam from "@/pages/PigBankTeam";
import AdminConsole from "@/pages/AdminConsole";
import CustomerSupport from "@/pages/CustomerSupport";
import PigBankMessages from "@/pages/PigBankMessages";
import ComplianceHub from "@/pages/ComplianceHub";
import Settings from "@/pages/Settings";

function Router() {
  const { isAuthenticated, isLoading, isMerchantPending, isPigBankStaff } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/team-login" component={TeamLogin} />
          <Route path="/landing" component={Landing} />
          <Route path="/team/merchants/approved" component={TeamApprovedMerchants} />
          <Route path="/team/merchants/:id" component={TeamMerchantDetail} />
          <Route path="/team/merchants" component={TeamMerchants} />
          <Route path="/pigbank-team" component={PigBankTeam} />
          <Route path="/public-integrations" component={PublicIntegrations} />
          <Route path="/public-pricing" component={PublicPricing} />
          <Route path="/public-contact" component={PublicContact} />
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/terminal" component={Terminal} />
          <Route path="/hosted-checkout" component={HostedCheckout} />
          <Route path="/checks" component={Checks} />
          <Route path="/invoices/create" component={CreateInvoice} />
          <Route path="/invoices" component={InvoicesList} />
          <Route path="/subscriptions" component={Subscriptions} />
          <Route path="/chargebacks" component={Chargebacks} />
          <Route path="/fraud" component={Fraud} />
          <Route path="/developers" component={Developers} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/integrations/wix" component={WixIntegration} />
          <Route path="/data-import" component={DataImport} />
          <Route path="/payouts" component={Payouts} />
          <Route path="/pay-by-link/:id" component={PayByLinkDetail} />
          <Route path="/pay-by-link" component={PayByLink} />
          <Route path="/team" component={Team} />
          <Route path="/admin" component={AdminConsole} />
          <Route path="/support" component={CustomerSupport} />
          <Route path="/settings" component={Settings} />
          <Route path="/themes" component={Themes} />
          <Route path="/onboarding" component={Onboarding} />
          <Route component={Landing} />
      </Switch>
    );
  }

  if (isPigBankStaff) {
    return (
      <Switch>
        <Route path="/public-integrations" component={PublicIntegrations} />
        <Route path="/public-pricing" component={PublicPricing} />
        <Route path="/public-contact" component={PublicContact} />
        <Route path="/team/merchants/approved" component={TeamApprovedMerchants} />
        <Route path="/team/merchants/:id" component={TeamMerchantDetail} />
        <Route path="/team/merchants" component={TeamMerchants} />
        <Route path="/team-login" component={TeamLogin} />
        <Route path="/themes" component={Themes} />
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/invoices/create" component={CreateInvoice} />
        <Route path="/invoices" component={InvoicesList} />
        <Route path="/payouts" component={Payouts} />
        <Route path="/fraud" component={Fraud} />
        <Route path="/chargebacks" component={Chargebacks} />
        <Route path="/hosted-checkout" component={HostedCheckout} />
        <Route path="/terminal" component={Terminal} />
        <Route path="/pay-by-link/:id" component={PayByLinkDetail} />
        <Route path="/pay-by-link" component={PayByLink} />
        <Route path="/developers" component={Developers} />
        <Route path="/integrations" component={Integrations} />
        <Route path="/data-import" component={DataImport} />
        <Route path="/team" component={Team} />
        <Route path="/admin" component={AdminConsole} />
        <Route path="/support" component={CustomerSupport} />
        <Route path="/settings" component={Settings} />
        <Route path="/pigbank-messages" component={PigBankMessages} />
        <Route path="/compliance-hub" component={ComplianceHub} />
        <Route path="/pigbank-team" component={PigBankTeam} />
        <Route path="/landing" component={Landing} />
        <Route>
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    );
  }

  if (isMerchantPending) {
    return (
      <Switch>
        <Route path="/public-integrations" component={PublicIntegrations} />
        <Route path="/public-pricing" component={PublicPricing} />
        <Route path="/public-contact" component={PublicContact} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/themes" component={Themes} />
        <Route path="/login" component={Login} />
        <Route path="/team-login" component={TeamLogin} />
        <Route path="/landing" component={Landing} />
        <Route>
          <Redirect to="/onboarding" />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/public-integrations" component={PublicIntegrations} />
      <Route path="/public-pricing" component={PublicPricing} />
      <Route path="/public-contact" component={PublicContact} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/landing" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/pay-by-link/:id" component={PayByLinkDetail} />
      <Route path="/pay-by-link" component={PayByLink} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/terminal" component={Terminal} />
      <Route path="/hosted-checkout" component={HostedCheckout} />
      <Route path="/checks" component={Checks} />
      <Route path="/invoices/create" component={CreateInvoice} />
      <Route path="/invoices" component={InvoicesList} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/chargebacks" component={Chargebacks} />
      <Route path="/fraud" component={Fraud} />
      <Route path="/developers" component={Developers} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/integrations/wix" component={WixIntegration} />
      <Route path="/data-import" component={DataImport} />
      <Route path="/payouts" component={Payouts} />
      <Route path="/team" component={Team} />
      <Route path="/admin" component={AdminConsole} />
      <Route path="/support" component={CustomerSupport} />
      <Route path="/settings" component={Settings} />
      <Route path="/themes" component={Themes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isPigBankStaff } = useAuth();
  const { isViewingMerchant } = useMerchantView();
  
  return (
    <>
      {isPigBankStaff && isViewingMerchant && <MerchantViewBanner />}
      <div className={isPigBankStaff && isViewingMerchant ? "pt-10" : ""}>
        <Router />
      </div>
      {isAuthenticated && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="templar-ui-theme">
      <QueryClientProvider client={queryClient}>
        <MerchantViewProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </MerchantViewProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
