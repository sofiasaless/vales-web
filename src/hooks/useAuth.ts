import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useAuthAcoes() {
  
  const entrar = useMutation({
    mutationFn: ({email, senha}: {email: string, senha: string}) => AuthService.entrarComEmpresa(email, senha),

    onSuccess: () => {
      console.info('login efetuado com sucesso')
    },

    onError: (err) => {
      console.error('erro efetuar login ', err);
    }
  })

  return {
    entrar
  }

}