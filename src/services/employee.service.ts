import { api } from "@/config/axios";
import { EmployeeStatus } from "@/enum/employee.enum";
import {
  FuncionarioPostRequestBody,
  FuncionarioResponseBody,
  FuncionarioUpdateRequestBody,
} from "@/types/funcionario.type";
import { Vale } from "@/types/vale.type";

export interface VoucherMutation {
  employeeId: string;
  voucher: Vale;
}

export interface VouchersMutation {
  employeeId: string;
  vouchers: Vale[];
}

export const EmployeeService = {
  async register(body: FuncionarioPostRequestBody) {
    return await api.post(`/funcionario/criar`, body);
  },

  async list(status: EmployeeStatus) {
    return (
      await api.get<FuncionarioResponseBody[]>(
        `/funcionario/listar?status=${status}`,
      )
    ).data;
  },

  async find(employeeId: string) {
    return (
      await api.get<FuncionarioResponseBody>(
        `/funcionario/encontrar/${employeeId}`,
      )
    ).data;
  },

  async removeVoucher(payload: VoucherMutation) {
    return await api.put(`/funcionario/vale/remover/${payload.employeeId}`, {
      vale: payload.voucher,
    });
  },

  async addVoucher(payload: VoucherMutation) {
    return await api.put(`/funcionario/vale/adicionar/${payload.employeeId}`, {
      vale: payload.voucher,
    });
  },

  async addMultipleVouchers(payload: VouchersMutation) {
    return await api.put(
      `/funcionario/vale/adicionar-multiplos/${payload.employeeId}`,
      { vales: payload.vouchers },
    );
  },

  async update(employeeId: string, body: FuncionarioUpdateRequestBody) {
    return await api.put(`/funcionario/atualizar/${employeeId}`, body);
  },

  async delete(employeeId: string) {
    return await api.delete(`/funcionario/excluir/${employeeId}`);
  },

  async archive(employeeId: string, type: 'archive' | 'unarchive') {
    const action = type === 'archive' ? 'arquivar' : 'desarquivar';
    return await api.put(`/funcionario/${action}/${employeeId}`);
  },
};
