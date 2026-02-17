import { EmployeeService, VoucherMutation, VouchersMutation } from "@/services/employee.service";
import { FuncionarioPostRequestBody, FuncionarioUpdateRequestBody } from "@/types/funcionario.type";
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

  const registerEmployee = useMutation({
    mutationFn: ({ body }: { body: FuncionarioPostRequestBody }) => EmployeeService.register(body),

    onSuccess: () => {
      console.info('success while trying register employee')
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    }
  })

  const removeVoucher = useMutation({
    mutationFn: ({ props }: { props: VoucherMutation }) => EmployeeService.removeVoucher(props),

    onSuccess: () => {
      console.info('voucher has success on remove')
      queryClient.invalidateQueries({ queryKey: ["employee"] })
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },

    onError: () => {
      console.error('error while trying remove voucher')
    }
  })

  const addVoucher = useMutation({
    mutationFn: ({ props }: { props: VoucherMutation }) => EmployeeService.addVoucher(props),

    onSuccess: () => {
      console.info('voucher has success on add')
      queryClient.invalidateQueries({ queryKey: ["employee"] })
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },

    onError: (error: any) => {
      console.error('error while trying add voucher ', error)
    }
  })

  const addMultipleVouchers = useMutation({
    mutationFn: ({ props }: { props: VouchersMutation }) => EmployeeService.addMultipleVouchers(props),

    onSuccess: () => {
      console.info('voucher has success on add')
      queryClient.invalidateQueries({ queryKey: ["employee"] })
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },

    onError: (error: any) => {
      console.error('error while trying add multiples vochers ', error)
    }
  })

  const updateEmployee = useMutation({
    mutationFn: ({ employeeId, body }: { employeeId: string; body: FuncionarioUpdateRequestBody }) => EmployeeService.update(employeeId, body),

    onSuccess: () => {
      console.info('employee updated successfully');
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
    },

    onError: () => {
      console.error('error trying update employee');
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: ({employeeId}: {employeeId: string}) => EmployeeService.delete(employeeId),

    onSuccess: () => {
      console.info('employee deleted successfully')
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },

    onError: () => {
      console.error('error trying delete employee')
    }
  })

  return {
    removeVoucher,
    addVoucher,
    addMultipleVouchers,
    registerEmployee,
    updateEmployee,
    deleteEmployee
  }

}