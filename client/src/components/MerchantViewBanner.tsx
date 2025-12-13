import { useMerchantView } from "@/hooks/useMerchantView";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function MerchantViewBanner() {
  const { isViewingMerchant, viewingMerchant, exitMerchantView } = useMerchantView();
  const [, setLocation] = useLocation();

  if (!isViewingMerchant || !viewingMerchant) {
    return null;
  }

  const handleExit = () => {
    // Navigate first, then clear context to ensure clean transition
    setLocation("/team/merchants/approved");
    // Small delay to ensure navigation starts before clearing context
    setTimeout(() => exitMerchantView(), 50);
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-violet-600 text-white px-4 py-2 flex items-center justify-between shadow-md"
      data-testid="banner-merchant-view"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">Viewing as:</span>
        <span className="font-bold" data-testid="text-viewing-merchant-name">
          {viewingMerchant.dba || viewingMerchant.legalBusinessName || "Unnamed Merchant"}
        </span>
        {viewingMerchant.dba && viewingMerchant.legalBusinessName && (
          <span className="text-violet-200 text-sm">
            ({viewingMerchant.legalBusinessName})
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExit}
        className="text-white hover:bg-violet-700 hover:text-white"
        data-testid="button-exit-merchant-view"
      >
        <X className="h-4 w-4 mr-1" />
        Exit View
      </Button>
    </div>
  );
}
