// Tipos principais do sistema de vales

export type EmployeeType = 'DIARISTA' | 'FIXO';

export interface Employee {
  id: string;
  name: string;
  birthDate: Date;
  baseSalary: number;
  type: EmployeeType;
  cpf: string;
  admissionDate: Date;
  payday: number; // Dia do mês
  role: string;
  currentVoucher: VoucherItem[]; // Vale ATUAL
  paymentHistory: Payment[]; // Histórico
}

export interface VoucherItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  addedAt: Date;
}

export interface Payment {
  id: string;
  employeeId: string;
  date: Date;
  baseSalary: number;
  voucherTotal: number;
  amountPaid: number;
  voucherItems: VoucherItem[];
}

export interface MenuProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  restaurantName: string;
}
