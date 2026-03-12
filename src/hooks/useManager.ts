import { ManagerService } from "@/services/manager.service";
import { GerenteAutenticatedResponseBody, GerenteAutenticateRequestBody, GerentePostRequestBody, GerenteResponseBody, GerenteUpdateRequestBody } from "@/types/gerente.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
      const result = await JSON.parse(localStorage.getItem("usuario")) as GerenteResponseBody
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
  const queryClient = useQueryClient();

  const autenticate = useMutation({
    mutationFn: ({ body }: { body: GerenteAutenticateRequestBody }) => ManagerService.autenticate(body),

    onSuccess: (value: GerenteAutenticatedResponseBody) => {
      if (value.usuario) localStorage.setItem("usuario", JSON.stringify(value.usuario));
    },

    onError: (error) => {
      console.info('erro ao autenticar ', error)
    }
  })

  const logoutManager = useMutation({
    mutationFn: () => ManagerService.logout()
  })

  const create = useMutation({
    mutationFn: ({ body }: { body: GerentePostRequestBody }) => ManagerService.create(body),

    onSuccess: () => {
      console.info('manager created successfully')
      queryClient.invalidateQueries({ queryKey: ["managers"] })
    },

    onError: () => {
      console.error('error while trying to create new manager')
    }
  })

  const remove = useMutation({
    mutationFn: ({managerId}: {managerId: string}) => ManagerService.delete(managerId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] })
    }
  })

  const update = useMutation({
    mutationFn: ({managerId, payload}: {managerId: string, payload: GerenteUpdateRequestBody}) => ManagerService.update(managerId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] })
    }
  })

  return {
    autenticate,
    logoutManager,
    create,
    remove,
    update
  }
}