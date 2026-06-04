import { MonthlyFeeService } from "@/services/monthlyfee.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListMonthlyFee() {
  return useQuery({
    queryKey: ["monthly_fee"],
    queryFn: async () => {
      const resultado = (await MonthlyFeeService.list()).data;
      return resultado;
    },
  });
}

export function useInvoiceActions() {
  const queryClient = useQueryClient();

  const sendPayment = useMutation({
    mutationFn: ({
      invoiceId,
      proofPicture,
    }: {
      invoiceId: string;
      proofPicture: string;
    }) => MonthlyFeeService.sendPayment({ invoiceId, proofPicture }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly_fee"] });
    },

    onError: () => {
      console.error("error while send payment");
    },
  });

  return {
    sendPayment,
  };
}
