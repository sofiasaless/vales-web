import { PaymentService } from "@/services/payment.service";
import { PagamentoPostRequestBody } from "@/types/pagamento.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function usePayment() {
  const queryClient = useQueryClient();

  const pay = useMutation({
    mutationFn: ({employeeId, body}: {employeeId: string, body: PagamentoPostRequestBody}) => PaymentService.pay(employeeId, body),

    onSuccess: () => {
      console.info('success for payment'),
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },

    onError: () => {
      console.error('error for payment')
    }
  })

  return {
    pay
  }

}