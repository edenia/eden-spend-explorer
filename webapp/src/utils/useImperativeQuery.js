import { useCallback } from 'react'
import { useApolloClient } from '@apollo/client'

export const useImperativeQuery = query => {
  const client = useApolloClient()

  return useCallback(
    variables =>
      client.query({
        query,
        variables,
        fetchPolicy: 'network-only'
      }),
    [query]
  )
}
