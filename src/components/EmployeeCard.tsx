import { useListPayments } from "@/hooks/usePayment";
import { cn } from "@/lib/utils";
import { FuncionarioResponseBody } from "@/types/funcionario.type";
import { getFirstDayAtMounth, getToday } from "@/utils/date";
import { getFirstWord } from "@/utils/format";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarInitials } from "./AvatarInitials";
import { MoneyDisplay } from "./MoneyDisplay";
import { StatusBadge } from "./StatusBadge";

interface EmployeeCardProps {
  employee: FuncionarioResponseBody | undefined;
  className?: string;
}

export const EmployeeCard = ({ employee, className }: EmployeeCardProps) => {
  const navigate = useNavigate();

  const voucherTotal = employee.vales.reduce(
    (total, item) => total + item.preco_unit * item.quantidade,
    0,
  );

  const {
    data: payments,
  } = useListPayments(employee.id);

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

  return (
    <button
      onClick={() => navigate(`/employee/${employee?.id}`)}
      className={cn(
        "glass-card rounded-xl p-4 text-left w-full card-interactive tap-highlight-none",
        "hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
    >
      <div className="flex flex-col items-center text-center">
        <AvatarInitials
          photoUrl={employee?.foto_url}
          name={employee?.nome}
          size="lg"
          className="mb-3"
        />

        <h3
          style={{ fontSize: 16 }}
          className="font-semibold text-foreground truncate w-full"
        >
          {getFirstWord(employee?.nome)}
        </h3>

        <p className="text-x text-muted-foreground mb-2">{employee?.cargo}</p>

        <div className="mb-2">
          <MoneyDisplay
            value={voucherTotal}
            size="md"
            variant={voucherTotal > 0 ? "negative" : "default"}
          />
        </div>

        {/* <StatusBadge
          status={paymentStatus.status}
          label={paymentStatus.label}
        /> */}
      </div>
    </button>
  );
};
