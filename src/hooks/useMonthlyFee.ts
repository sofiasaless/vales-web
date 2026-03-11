import { MonthlyFeeService } from "@/services/monthlyfee.service";
import { useQuery } from "@tanstack/react-query";

export function useListMonthlyFee() {
  return useQuery({
    queryKey: ["monthly_fee"],
    queryFn: async () => {
      const resultado = (await MonthlyFeeService.list()).data;
      return resultado;
    }
  })
}