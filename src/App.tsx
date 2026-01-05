import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { BottomNav } from "@/components/BottomNav";

// Pages
import EmployeeListScreen from "@/pages/EmployeeListScreen";
import EmployeeManagementScreen from "@/pages/EmployeeManagementScreen";
import EmployeeDetailScreen from "@/pages/EmployeeDetailScreen";
import PaymentHistoryScreen from "@/pages/PaymentHistoryScreen";
import PaymentConfirmationScreen from "@/pages/PaymentConfirmationScreen";
import MenuScreen from "@/pages/MenuScreen";
import NewEmployeeScreen from "@/pages/NewEmployeeScreen";
import SettingsScreen from "@/pages/SettingsScreen";
import MenuManagementScreen from "@/pages/MenuManagementScreen";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EmployeeProvider>
        <Toaster />
        <Sonner 
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "bg-card border-border text-foreground",
              title: "text-foreground",
              description: "text-muted-foreground",
              success: "border-success/30",
              error: "border-danger/30",
            }
          }}
        />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Main Tabs */}
              <Route path="/" element={<EmployeeListScreen />} />
              <Route path="/new-employee" element={<NewEmployeeScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              
              {/* Employee Stack */}
              <Route path="/employee/:id" element={<EmployeeManagementScreen />} />
              <Route path="/employee/:id/details" element={<EmployeeDetailScreen />} />
              <Route path="/employee/:id/history" element={<PaymentHistoryScreen />} />
              
              {/* Menu Stack */}
              <Route path="/menu/:employeeId" element={<MenuScreen />} />
              
              {/* Payment Stack */}
              <Route path="/payment/:employeeId" element={<PaymentConfirmationScreen />} />
              
              {/* Settings Stack */}
              <Route path="/settings/menu" element={<MenuManagementScreen />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </EmployeeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
