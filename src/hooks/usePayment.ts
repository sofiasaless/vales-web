import { FilterData, PaymentService } from "@/services/payment.service";
import { PagamentoPostRequestBody } from "@/types/pagamento.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListPayments(employeeId: string, filter: FilterData) {
  return useQuery({
    queryKey: ["payments", employeeId],
    queryFn: async () => {
      const result = await PaymentService.list(employeeId, filter);
      return result
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })
}

export function usePayment() {
  const queryClient = useQueryClient();

  const pay = useMutation({
    mutationFn: ({employeeId, body}: {employeeId: string, body: PagamentoPostRequestBody}) => PaymentService.pay(employeeId, body),

    onSuccess: () => {
      console.info('success for payment'),
      queryClient.invalidateQueries({ queryKey: ["employees"] }),
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },

    onError: () => {
      console.error('error for payment')
    }
  })

  return {
    pay
  }

}