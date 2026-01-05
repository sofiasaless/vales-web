import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Employee, VoucherItem, Payment, MenuProduct } from '@/types';
import { mockEmployees, mockMenuProducts } from '@/data/mockData';

// Estado
interface EmployeeState {
  employees: Employee[];
  menuProducts: MenuProduct[];
}

// Ações
type EmployeeAction =
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'ADD_VOUCHER_ITEMS'; payload: { employeeId: string; items: VoucherItem[] } }
  | { type: 'REMOVE_VOUCHER_ITEM'; payload: { employeeId: string; itemId: string } }
  | { type: 'UPDATE_VOUCHER_ITEM_QUANTITY'; payload: { employeeId: string; itemId: string; quantity: number } }
  | { type: 'CONFIRM_PAYMENT'; payload: { employeeId: string; payment: Payment } }
  | { type: 'ADD_MENU_PRODUCT'; payload: MenuProduct }
  | { type: 'UPDATE_MENU_PRODUCT'; payload: MenuProduct }
  | { type: 'DELETE_MENU_PRODUCT'; payload: string };

// Reducer
const employeeReducer = (state: EmployeeState, action: EmployeeAction): EmployeeState => {
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };

    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };

    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter((emp) => emp.id !== action.payload),
      };

    case 'ADD_VOUCHER_ITEMS':
      return {
        ...state,
        employees: state.employees.map((emp) => {
          if (emp.id === action.payload.employeeId) {
            // Merge items with same productId
            const updatedVoucher = [...emp.currentVoucher];
            action.payload.items.forEach((newItem) => {
              const existingIndex = updatedVoucher.findIndex(
                (v) => v.productId === newItem.productId
              );
              if (existingIndex >= 0) {
                updatedVoucher[existingIndex] = {
                  ...updatedVoucher[existingIndex],
                  quantity: updatedVoucher[existingIndex].quantity + newItem.quantity,
                };
              } else {
                updatedVoucher.push(newItem);
              }
            });
            return { ...emp, currentVoucher: updatedVoucher };
          }
          return emp;
        }),
      };

    case 'REMOVE_VOUCHER_ITEM':
      return {
        ...state,
        employees: state.employees.map((emp) => {
          if (emp.id === action.payload.employeeId) {
            return {
              ...emp,
              currentVoucher: emp.currentVoucher.filter(
                (item) => item.id !== action.payload.itemId
              ),
            };
          }
          return emp;
        }),
      };

    case 'UPDATE_VOUCHER_ITEM_QUANTITY':
      return {
        ...state,
        employees: state.employees.map((emp) => {
          if (emp.id === action.payload.employeeId) {
            return {
              ...emp,
              currentVoucher: emp.currentVoucher.map((item) =>
                item.id === action.payload.itemId
                  ? { ...item, quantity: action.payload.quantity }
                  : item
              ),
            };
          }
          return emp;
        }),
      };

    case 'CONFIRM_PAYMENT':
      return {
        ...state,
        employees: state.employees.map((emp) => {
          if (emp.id === action.payload.employeeId) {
            return {
              ...emp,
              currentVoucher: [], // Zera o vale
              paymentHistory: [action.payload.payment, ...emp.paymentHistory],
            };
          }
          return emp;
        }),
      };

    case 'ADD_MENU_PRODUCT':
      return {
        ...state,
        menuProducts: [...state.menuProducts, action.payload],
      };

    case 'UPDATE_MENU_PRODUCT':
      return {
        ...state,
        menuProducts: state.menuProducts.map((prod) =>
          prod.id === action.payload.id ? action.payload : prod
        ),
      };

    case 'DELETE_MENU_PRODUCT':
      return {
        ...state,
        menuProducts: state.menuProducts.filter((prod) => prod.id !== action.payload),
      };

    default:
      return state;
  }
};

// Context
interface EmployeeContextType {
  state: EmployeeState;
  dispatch: React.Dispatch<EmployeeAction>;
  // Helpers
  getEmployee: (id: string) => Employee | undefined;
  getVoucherTotal: (employeeId: string) => number;
  calculatePayment: (employeeId: string) => { baseSalary: number; voucherTotal: number; amountPaid: number } | null;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

// Provider
export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(employeeReducer, {
    employees: mockEmployees,
    menuProducts: mockMenuProducts,
  });

  const getEmployee = (id: string) => state.employees.find((emp) => emp.id === id);

  const getVoucherTotal = (employeeId: string) => {
    const employee = getEmployee(employeeId);
    if (!employee) return 0;
    return employee.currentVoucher.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
  };

  const calculatePayment = (employeeId: string) => {
    const employee = getEmployee(employeeId);
    if (!employee) return null;
    const voucherTotal = getVoucherTotal(employeeId);
    return {
      baseSalary: employee.baseSalary,
      voucherTotal,
      amountPaid: employee.baseSalary - voucherTotal,
    };
  };

  return (
    <EmployeeContext.Provider
      value={{ state, dispatch, getEmployee, getVoucherTotal, calculatePayment }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

// Hook
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
