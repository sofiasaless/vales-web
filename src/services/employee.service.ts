import { api } from "@/config/axios";
import { FuncionarioPostRequestBody, FuncionarioResponseBody } from "@/types/funcionario.type";
import { Vale } from "@/types/vale.type";

export interface VoucherMutation {
  employeeId: string,
  voucher: Vale
}

export interface VouchersMutation {
  employeeId: string,
  vouchers: Vale[]
}

export const EmployeeService = {
  async register(body: FuncionarioPostRequestBody) {
    return await api.post(`/funcionario/criar`, body)
  },
  
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

  async addMultipleVouchers(payload: VouchersMutation) {
    return await api.put(`/funcionario/vale/adicionar-multiplos/${payload.employeeId}`, payload.vouchers);
  }

}