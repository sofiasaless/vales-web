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
import { ManagerGuard } from "./guards/ManagerGuard";
import { BuildingPage } from "./components/BuildingPage";
import { LoginGuard } from "./guards/LoginGuard";

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
                        element={
                          <LoginGuard>
                            <RestaurantLoginScreen />
                          </LoginGuard>
                      }
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
                            <ManagerGuard permission="AUXILIAR">
                              <EmployeeListScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/new-employee"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <NewEmployeeScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/contract-employee"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <NewEmployeeContractScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/contract-signature"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <ContractSignatureScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard permission="AUXILIAR">
                              <SettingsScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />

                      {/* Employee Stack */}
                      <Route
                        path="/employee/:id"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard permission="AUXILIAR">
                              <EmployeeManagementScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/employee/:id/details"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <EmployeeDetailScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/employee/edit"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <EditEmployeeScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/employee/:id/history"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <PaymentHistoryScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />

                      {/* Menu Stack */}
                      <Route
                        path="/menu/:employeeId"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard permission="AUXILIAR">
                              <MenuScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />

                      {/* Payment Stack */}
                      <Route
                        path="/payment"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <PaymentConfirmationScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />

                      <Route
                        path="/payment-signature/:id"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <PaymentSignatureScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />

                      {/* Settings Stack */}
                      <Route
                        path="/settings/menu"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <MenuManagementScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/subscriptions"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <SubscriptionsScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/finances"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <BuildingPage pageName="Finanças" />
                              {/* <FinancesScreen /> */}
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/finances/:categoryId"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <CategoryExpensesScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/incentives"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <BuildingPage pageName="Incentivos" />
                              {/* <IncentiveHistoryScreen /> */}
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />
                      <Route
                        path="/settings/managers"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <ManagersScreen />
                            </ManagerGuard>
                          </EmpresaGuard>
                        }
                      />

                      {/* Incentive Stack */}
                      <Route
                        path="/incentive/sales"
                        element={
                          <EmpresaGuard>
                            <ManagerGuard>
                              <IncentiveSalesScreen />
                            </ManagerGuard>
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
