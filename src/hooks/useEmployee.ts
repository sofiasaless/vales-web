import { EmployeeService, VoucherMutation } from "@/services/employee.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListEmployee() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const result = await EmployeeService.list()
      return result
    },
    refetchOnWindowFocus: false
  })
}

export function useFindEmployee(id: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const result = await EmployeeService.find(id);
      return result;
    },
    refetchOnWindowFocus: false
  })
}

export function useEmployee() {
  const queryClient = useQueryClient();

  const removeVoucher = useMutation({
    mutationFn: ({props}: {props: VoucherMutation}) => EmployeeService.removeVoucher(props),

    onSuccess: () => {
      console.info('voucher has success on remove')
      queryClient.invalidateQueries({queryKey: ["employee"]}),
      queryClient.invalidateQueries({queryKey: ["employees"]})
    },

    onError: () => {
      console.error('error while trying remove voucher')
    }
  })

  const addVoucher = useMutation({
    mutationFn: ({props}: {props: VoucherMutation}) => EmployeeService.addVoucher(props),

    onSuccess: () => {
      console.info('voucher has success on add')
      queryClient.invalidateQueries({queryKey: ["employee"]}),
      queryClient.invalidateQueries({queryKey: ["employees"]})
    },

    onError: () => {
      console.error('error while trying add voucher')
    }
  })

  return {
    removeVoucher,
    addVoucher
  }

}