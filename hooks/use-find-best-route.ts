import { findBestPath } from '@/lib/find_best_path'
import { useMutation } from '@tanstack/react-query'

type paramsT = {
  amountStr: string
  paths: string[][]
  slippageTolerance: number | string
}

export const useFindBestRoute = () => {
  return useMutation({
    mutationFn: async ({ amountStr, paths, slippageTolerance }: paramsT) =>
      findBestPath(amountStr, paths, slippageTolerance),
  })
}
