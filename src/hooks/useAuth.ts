import { AuthService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAuthActions() {
  
  const login = useMutation({
    mutationFn: ({email, password}: {email: string, password: string}) => AuthService.loginWithEnterprise(email, password),

    onSuccess: () => {
      console.info('login efetuado com sucesso')
    },

    onError: (err) => {
      console.error('erro efetuar login ', err);
    }
  })

  const logout = useMutation({
    mutationFn: () => AuthService.logout(),

    onSuccess: () => {
      console.info('logout efetuado com sucesso')
    },

    onError: () => {
      console.error('nao foi possível fazer logout')
    }
  })

  return {
    login,
    logout
  }

}