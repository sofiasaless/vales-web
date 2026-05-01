import { cn } from "@/lib/utils";
import { FuncionarioResponseBody } from "@/types/funcionario.type";
import { getFirstAndSecondName } from "@/utils/format";
import { AvatarInitials } from "../AvatarInitials/AvatarInitials";
import { MoneyDisplay } from "../MoneyDisplay/MoneyDisplay";
import { useEmployeeCardController } from "./useEmployeeCard.controller";

interface EmployeeCardProps {
  employee: FuncionarioResponseBody | undefined;
  className?: string;
}

export const EmployeeCard = ({ employee, className }: EmployeeCardProps) => {
  const { voucherTotal, paymentStatus, navigate } = useEmployeeCardController({
    employee,
  });

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
          {getFirstAndSecondName(employee?.nome)}
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
