import { Employee, MenuProduct, Manager } from '@/types';

export const mockManager: Manager = {
  id: 'manager-1',
  name: 'Carlos Oliveira',
  email: 'carlos@restaurante.com',
  restaurantName: 'Restaurante Sabor & Arte',
};

export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Maria Silva',
    birthDate: new Date('1990-05-15'),
    baseSalary: 2500,
    type: 'FIXO',
    cpf: '123.456.789-00',
    admissionDate: new Date('2022-03-10'),
    payday: 5,
    role: 'Cozinheira',
    currentVoucher: [
      {
        id: 'v1',
        productId: 'prod-1',
        name: 'Marmita Grande',
        unitPrice: 18,
        quantity: 5,
        addedAt: new Date('2024-01-10'),
      },
      {
        id: 'v2',
        productId: 'prod-3',
        name: 'Refrigerante Lata',
        unitPrice: 5,
        quantity: 10,
        addedAt: new Date('2024-01-12'),
      },
    ],
    paymentHistory: [
      {
        id: 'pay-1',
        employeeId: 'emp-1',
        date: new Date('2023-12-05'),
        baseSalary: 2500,
        voucherTotal: 180,
        amountPaid: 2320,
        voucherItems: [
          { id: 'vh1', productId: 'prod-1', name: 'Marmita Grande', unitPrice: 18, quantity: 10, addedAt: new Date('2023-11-15') },
        ],
      },
    ],
  },
  {
    id: 'emp-2',
    name: 'João Santos',
    birthDate: new Date('1985-08-22'),
    baseSalary: 2200,
    type: 'FIXO',
    cpf: '987.654.321-00',
    admissionDate: new Date('2021-06-01'),
    payday: 5,
    role: 'Garçom',
    currentVoucher: [
      {
        id: 'v3',
        productId: 'prod-2',
        name: 'Marmita Média',
        unitPrice: 15,
        quantity: 8,
        addedAt: new Date('2024-01-08'),
      },
    ],
    paymentHistory: [],
  },
  {
    id: 'emp-3',
    name: 'Ana Pereira',
    birthDate: new Date('1995-12-03'),
    baseSalary: 150,
    type: 'DIARISTA',
    cpf: '456.789.123-00',
    admissionDate: new Date('2023-09-15'),
    payday: 15,
    role: 'Auxiliar de Cozinha',
    currentVoucher: [],
    paymentHistory: [
      {
        id: 'pay-2',
        employeeId: 'emp-3',
        date: new Date('2024-01-02'),
        baseSalary: 150,
        voucherTotal: 25,
        amountPaid: 125,
        voucherItems: [
          { id: 'vh2', productId: 'prod-4', name: 'Suco Natural', unitPrice: 8, quantity: 2, addedAt: new Date('2023-12-28') },
          { id: 'vh3', productId: 'prod-5', name: 'Café', unitPrice: 3, quantity: 3, addedAt: new Date('2023-12-29') },
        ],
      },
    ],
  },
];

export const mockMenuProducts: MenuProduct[] = [
  { id: 'prod-1', name: 'Marmita Grande', category: 'Refeições', price: 18, available: true },
  { id: 'prod-2', name: 'Marmita Média', category: 'Refeições', price: 15, available: true },
  { id: 'prod-3', name: 'Refrigerante Lata', category: 'Bebidas', price: 5, available: true },
  { id: 'prod-4', name: 'Suco Natural', category: 'Bebidas', price: 8, available: true },
  { id: 'prod-5', name: 'Café', category: 'Bebidas', price: 3, available: true },
  { id: 'prod-6', name: 'Água Mineral', category: 'Bebidas', price: 3, available: true },
  { id: 'prod-7', name: 'Sobremesa do Dia', category: 'Sobremesas', price: 10, available: true },
];
