import { ManagerService } from "@/services/manager.service";
import { GerenteAutenticatedResponseBody, GerenteAutenticateRequestBody } from "@/types/gerente.type";
import { Gerente } from "@/types/manager";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useListManagers() {
  return useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const result = await ManagerService.list()
      return result.data;
    },
    refetchOnWindowFocus: false
  })
}

export function useCurrentManager() {
  return useQuery({
    queryKey: ["current_manager"],
    queryFn: async () => {
      const result = await JSON.parse(localStorage.getItem("usuario")) as Gerente
      return result
    }
  })
}

export function useIsManagerAuthenticated() {
  return useQuery({
    queryKey: ["manager_authenticated"],
    queryFn: async () => {
      const result = await ManagerService.isManagerAuthenticated()
      return result
    }
  })
}

export function useManagers() {
  const autenticate = useMutation({
    mutationFn: ({body}: {body: GerenteAutenticateRequestBody}) => ManagerService.autenticate(body),

    onSuccess: (value: GerenteAutenticatedResponseBody) => {
      console.info('autenticado com sucesso')
      if (value.usuario) localStorage.setItem("usuario", JSON.stringify(value.usuario));
    },

    onError: (error) => {
      console.info('erro ao autenticar ', error)
    }
  })

  const logoutManager = useMutation({
    mutationFn: () => ManagerService.logout()
  })

  return {
    autenticate,
    logoutManager
  }
}