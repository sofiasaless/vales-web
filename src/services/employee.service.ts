import { api } from "@/config/axios";
import { FuncionarioResponseBody } from "@/types/funcionario.type";
import { Vale } from "@/types/vale.type";

export interface VoucherMutation {
  employeeId: string,
  voucher: Vale
}

export const EmployeeService = {
  async list() {
    return (await api.get<FuncionarioResponseBody[]>(`/funcionario/listar`)).data
  },

  async find(employeeId: string) {
    return (await api.get<FuncionarioResponseBody>(`/funcionario/encontrar/${employeeId}`)).data
  },

  async removeVoucher(payload: VoucherMutation) {
    return await api.put(`/funcionario/vale/remover/${payload.employeeId}`, payload.voucher);
  },

  async addVoucher(payload: VoucherMutation) {
    return await api.put(`/funcionario/vale/adicionar/${payload.employeeId}`, payload.voucher);
  },

  async addMultipleVouchers(employeeId: string, vouchers: Vale[]) {
    return await api.put(`/funcionario/vale/adicionar-multiplos/${employeeId}`, vouchers);
  }

}