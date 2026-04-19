import { useListPayments } from "@/hooks/usePayment";
import { FuncionarioResponseBody } from "@/types/funcionario.type";
import { getToday } from "@/utils/date";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface EmployeeCardControllerProps {
  employee: FuncionarioResponseBody | undefined;
}

export function useEmployeeCardController({
  employee,
}: EmployeeCardControllerProps) {
  const navigate = useNavigate();

  const voucherTotal = employee.vales.reduce(
    (total, item) => total + item.preco_unit * item.quantidade,
    0,
  );

  const { data: payments } = useListPayments(employee.id);

  const paymentStatus = useMemo((): {
    status: "pending" | "paid" | "today" | "due";
    label?: string;
  } => {
    const today = new Date().getDate();
    const firstDueDay = Number(employee.primeiro_dia_pagamento);
    const secondDueDay = Number(employee.segundo_dia_pagamento);
    if (employee.tipo === "FIXO") {
      if (payments && payments.length) {
        const lastPayment = new Date(
          payments[payments.length - 1].data_pagamento,
        );
        if (lastPayment.getDate() === getToday().getDate()) {
          return {
            status: "paid",
            label: `Pago hoje`,
          };
        }
        if (lastPayment.getDate() === getToday().getDate() - 1) {
          return {
            status: "paid",
            label: `Pago ontem`,
          };
        }
      }

      if (today === firstDueDay || today === secondDueDay) {
        return {
          status: "due",
          label: `Pagar hoje`,
        };
      }
      if (today === firstDueDay - 1 || today === firstDueDay - 2) {
        return {
          status: "pending",
          label: `Pagar amanhã`,
        };
      }
      if (today < firstDueDay) {
        const missedDays = firstDueDay - today;
        return {
          status: "pending",
          label: `Pagar em ${missedDays} dias`,
        };
      }
      if (today < secondDueDay) {
        const missedDays = secondDueDay - today;
        return {
          status: "pending",
          label: `Pagar em ${missedDays} dias`,
        };
      }
    }
    return {
      status: "pending",
      label: "Diarista",
    };
  }, [
    employee.primeiro_dia_pagamento,
    employee.segundo_dia_pagamento,
    employee.tipo,
    payments,
  ]);

  return {
    navigate,
    employee,
    voucherTotal,
    paymentStatus,
  };
}
