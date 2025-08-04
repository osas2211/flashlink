import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import axios from 'axios'

export type TxRecord = {
  createdAt: string
  userAddress: string
  txHash: string
  amountSwapped: string
  amountReceived: string
  fromToken: string
  toToken: string
  status: string
}

// 1) Fetcher fn
const fetchTransactions = async (userAddress?: string): Promise<TxRecord[]> => {
  const url = `/api/transactions?userAddress=${userAddress!}`
  const { data } = await axios.get<{ transactions: TxRecord[] }>(url)
  return data.transactions
}

// 2) useTransactions hook
export const useTransactions = (userAddress?: string) => {
  return useQuery<TxRecord[], AxiosError>(
    ['transactions', userAddress ?? 'all'],
    () => fetchTransactions(userAddress),
    {
      staleTime: 30_000,
      keepPreviousData: true,
    }
  )
}

// 3) Mutation fn
type NewTxInput = Omit<TxRecord, 'createdAt'>
const postTransaction = async (newTx: NewTxInput): Promise<TxRecord> => {
  const { data } = await axios.post<{
    success: boolean
    id: string
    record: TxRecord
  }>('/api/transactions', newTx)
  return data.record
}

// 4) useCreateTransaction hook
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation<TxRecord, AxiosError, NewTxInput>(newTx => postTransaction(newTx), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(['transactions', 'all'])
      queryClient.invalidateQueries(['transactions', variables.userAddress])
    },
  })
}
