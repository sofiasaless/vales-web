import { FuncionarioResponseBody } from "@/types/funcionario.type";
import { GanhosIncentivo } from "@/types/incentivo.type";
import { Vale } from "@/types/vale.type";

export const calculateTotalVaucher = (item: Vale): number => {
  return item.preco_unit * item.quantidade;
};

export const calculateTotalVauchers = (items: Vale[] | undefined): number => {
  if (!items) return 0;
  return items.reduce((total, item) => total + calculateTotalVaucher(item), 0);
};

export const calculateAmount = (employee: FuncionarioResponseBody) => {
  const totalVoucher = calculateTotalVauchers(employee.vales);
  const amount = calcularBaseSalary(employee) - totalVoucher
  return amount
}

export const calcularBaseSalary = (employee: FuncionarioResponseBody) => {
  let salary = 0
  if (employee.tipo === 'FIXO') {
    salary = employee.salario / 2
  } else {
    salary = employee.salario * employee.dias_trabalhados_semanal
  }
  return salary
}

export const calculateTotalIncentive = (items: GanhosIncentivo[]) => {
  return items.reduce((total, item) => total + item.valor, 0);
}