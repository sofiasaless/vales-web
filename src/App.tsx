import { ConfigProvider, App as AntApp } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { antdTheme } from '@/theme/antdTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EmployeeProvider } from '@/context/EmployeeContext';
import { IncentiveProvider } from '@/context/IncentiveContext';
import { AuthProvider } from '@/context/AuthContext';
import { BottomNav } from '@/components/BottomNav';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth Pages
import RestaurantLoginScreen from '@/pages/RestaurantLoginScreen';
import SelectManagerScreen from '@/pages/SelectManagerScreen';

// Pages
import EmployeeListScreen from '@/pages/EmployeeListScreen';
import EmployeeManagementScreen from '@/pages/EmployeeManagementScreen';
import EmployeeDetailScreen from '@/pages/EmployeeDetailScreen';
import PaymentHistoryScreen from '@/pages/PaymentHistoryScreen';
import PaymentConfirmationScreen from '@/pages/PaymentConfirmationScreen';
import MenuScreen from '@/pages/MenuScreen';
import NewEmployeeScreen from '@/pages/NewEmployeeScreen';
import SettingsScreen from '@/pages/SettingsScreen';
import MenuManagementScreen from '@/pages/MenuManagementScreen';
import SubscriptionsScreen from '@/pages/SubscriptionsScreen';
import FinancesScreen from '@/pages/FinancesScreen';
import CategoryExpensesScreen from '@/pages/CategoryExpensesScreen';
import IncentiveHistoryScreen from '@/pages/IncentiveHistoryScreen';
import IncentiveSalesScreen from '@/pages/IncentiveSalesScreen';
import ManagersScreen from '@/pages/ManagersScreen';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <ConfigProvider theme={antdTheme} locale={ptBR}>
    <AntApp>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <EmployeeProvider>
            <IncentiveProvider>
              <BrowserRouter>
                <div style={{ minHeight: '100vh', background: '#111827' }}>
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<RestaurantLoginScreen />} />
                    <Route path="/select-manager" element={<SelectManagerScreen />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute><EmployeeListScreen /></ProtectedRoute>} />
                    <Route path="/new-employee" element={<ProtectedRoute><NewEmployeeScreen /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
                    
                    {/* Employee Stack */}
                    <Route path="/employee/:id" element={<ProtectedRoute><EmployeeManagementScreen /></ProtectedRoute>} />
                    <Route path="/employee/:id/details" element={<ProtectedRoute><EmployeeDetailScreen /></ProtectedRoute>} />
                    <Route path="/employee/:id/history" element={<ProtectedRoute><PaymentHistoryScreen /></ProtectedRoute>} />
                    
                    {/* Menu Stack */}
                    <Route path="/menu/:employeeId" element={<ProtectedRoute><MenuScreen /></ProtectedRoute>} />
                    
                    {/* Payment Stack */}
                    <Route path="/payment/:employeeId" element={<ProtectedRoute><PaymentConfirmationScreen /></ProtectedRoute>} />
                    
                    {/* Settings Stack */}
                    <Route path="/settings/menu" element={<ProtectedRoute><MenuManagementScreen /></ProtectedRoute>} />
                    <Route path="/settings/subscriptions" element={<ProtectedRoute><SubscriptionsScreen /></ProtectedRoute>} />
                    <Route path="/settings/finances" element={<ProtectedRoute><FinancesScreen /></ProtectedRoute>} />
                    <Route path="/settings/finances/:categoryId" element={<ProtectedRoute><CategoryExpensesScreen /></ProtectedRoute>} />
                    <Route path="/settings/incentives" element={<ProtectedRoute><IncentiveHistoryScreen /></ProtectedRoute>} />
                    <Route path="/settings/managers" element={<ProtectedRoute><ManagersScreen /></ProtectedRoute>} />
                    
                    {/* Incentive Stack */}
                    <Route path="/incentive/sales" element={<ProtectedRoute><IncentiveSalesScreen /></ProtectedRoute>} />
                    
                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomNav />
                </div>
              </BrowserRouter>
            </IncentiveProvider>
          </EmployeeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AntApp>
  </ConfigProvider>
);

export default App;
