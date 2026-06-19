import { EmployeeStatus } from "@/enum/employee.enum";
import { FuncionarioResponseBody } from "@/types/funcionario.type";

export const isArchived = (emp: FuncionarioResponseBody) => {
  if (!emp.status) return false;
  return emp.status === EmployeeStatus.ARCHIVED;
}