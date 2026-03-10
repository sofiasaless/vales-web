import { BottomNav } from "@/components/BottomNav";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { IncentiveProvider } from "@/context/IncentiveContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Auth Pages
import RestaurantLoginScreen from "@/pages/RestaurantLoginScreen";
import SelectManagerScreen from "@/pages/SelectManagerScreen";

// Pages
import CategoryExpensesScreen from "@/pages/CategoryExpensesScreen";
import EditEmployeeScreen from "@/pages/EditEmployeeScreen";
import EmployeeDetailScreen from "@/pages/EmployeeDetailScreen";
import EmployeeListScreen from "@/pages/EmployeeListScreen";
import EmployeeManagementScreen from "@/pages/EmployeeManagementScreen";
import FinancesScreen from "@/pages/FinancesScreen";
import IncentiveHistoryScreen from "@/pages/IncentiveHistoryScreen";
import IncentiveSalesScreen from "@/pages/IncentiveSalesScreen";
import ManagersScreen from "@/pages/ManagersScreen";
import MenuManagementScreen from "@/pages/MenuManagementScreen";
import MenuScreen from "@/pages/MenuScreen";
import NewEmployeeScreen from "@/pages/NewEmployeeScreen";
import NotFound from "@/pages/NotFound";
import PaymentConfirmationScreen from "@/pages/PaymentConfirmationScreen";
import PaymentHistoryScreen from "@/pages/PaymentHistoryScreen";
import SettingsScreen from "@/pages/SettingsScreen";
import SubscriptionsScreen from "@/pages/SubscriptionsScreen";
import { App as AntApp, ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import ContractSignatureScreen from "./pages/ContractSignatureScreen";
import NewEmployeeContractScreen from "./pages/NewEmployeeContractScreen";
import PaymentSignatureScreen from "./pages/PaymentSignature";
import { antdTheme } from "./theme/antTheme";
import { EmpresaGuard } from "./guards/EmpresaGuard";

const queryClient = new QueryClient();

const App = () => (
  <ConfigProvider theme={antdTheme} locale={ptBR}>
    <AntApp>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <EmployeeProvider>
              <IncentiveProvider>
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
                    },
                  }}
                />
                <BrowserRouter>
                  <div className="min-h-screen bg-background">
                    <Routes>
                      <Route
                        path="/login"
                        element={<RestaurantLoginScreen />}
                      />

                      <Route
                        path="/select-manager"
                        element={
                          <EmpresaGuard>
                            <SelectManagerScreen />
                          </EmpresaGuard>
                        }
                      />

                      {/* Protected Routes */}
                      <Route
                        path="/"
                        element={
                          <EmpresaGuard>
                            <EmployeeListScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/new-employee"
                        element={
                          <EmpresaGuard>
                            <NewEmployeeScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/contract-employee"
                        element={
                          <EmpresaGuard>
                            <NewEmployeeContractScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/contract-signature"
                        element={
                          <EmpresaGuard>
                            <ContractSignatureScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <EmpresaGuard>
                            <SettingsScreen />
                          </EmpresaGuard>
                        }
                      />

                      {/* Employee Stack */}
                      <Route
                        path="/employee/:id"
                        element={
                          <EmpresaGuard>
                            <EmployeeManagementScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/employee/:id/details"
                        element={
                          <EmpresaGuard>
                            <EmployeeDetailScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/employee/edit"
                        element={
                          <EmpresaGuard>
                            <EditEmployeeScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/employee/:id/history"
                        element={
                          <EmpresaGuard>
                            <PaymentHistoryScreen />
                          </EmpresaGuard>
                        }
                      />

                      {/* Menu Stack */}
                      <Route
                        path="/menu/:employeeId"
                        element={
                          <EmpresaGuard>
                            <MenuScreen />
                          </EmpresaGuard>
                        }
                      />

                      {/* Payment Stack */}
                      <Route
                        path="/payment"
                        element={
                          <EmpresaGuard>
                            <PaymentConfirmationScreen />
                          </EmpresaGuard>
                        }
                      />

                      <Route
                        path="/payment-signature/:id"
                        element={
                          <EmpresaGuard>
                            <PaymentSignatureScreen />
                          </EmpresaGuard>
                        }
                      />

                      {/* Settings Stack */}
                      <Route
                        path="/settings/menu"
                        element={
                          <EmpresaGuard>
                            <MenuManagementScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/subscriptions"
                        element={
                          <EmpresaGuard>
                            <SubscriptionsScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/finances"
                        element={
                          <EmpresaGuard>
                            <FinancesScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/finances/:categoryId"
                        element={
                          <EmpresaGuard>
                            <CategoryExpensesScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/incentives"
                        element={
                          <EmpresaGuard>
                            <IncentiveHistoryScreen />
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/managers"
                        element={
                          <EmpresaGuard>
                            <ManagersScreen />
                          </EmpresaGuard>
                        }
                      />

                      {/* Incentive Stack */}
                      <Route
                        path="/incentive/sales"
                        element={
                          <EmpresaGuard>
                            <IncentiveSalesScreen />
                          </EmpresaGuard>
                        }
                      />

                      {/* Catch-all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <BottomNav />
                  </div>
                </BrowserRouter>
              </IncentiveProvider>
            </EmployeeProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AntApp>
  </ConfigProvider>
);

export default App;
