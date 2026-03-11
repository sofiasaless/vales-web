import { FilterData, PaymentService } from "@/services/payment.service";
import { PagamentoPostRequestBody } from "@/types/pagamento.type";
import { getFirstDayAtMounth, getToday } from "@/utils/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListPayments(
  employeeId: string,
  filter: FilterData = {
    data_fim: getToday().toISOString(),
    data_inicio: getFirstDayAtMounth().toISOString(),
  },
) {
  return useQuery({
    queryKey: ["payments", employeeId],
    queryFn: async () => {
      const result = await PaymentService.list(employeeId, filter);
      return result;
    },
    refetchOnWindowFocus: false,
  });
}

export function usePayment() {
  const queryClient = useQueryClient();

  const pay = useMutation({
    mutationFn: ({
      employeeId,
      body,
    }: {
      employeeId: string;
      body: PagamentoPostRequestBody;
    }) => PaymentService.pay(employeeId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
    },

    onError: () => {
      console.error("error for payment");
    },
  });

  return {
    pay,
  };
}
