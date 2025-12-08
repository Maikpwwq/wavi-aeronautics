'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Hydrate,
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import ShoppingCartProvider from '@/app/tienda/providers/ShoppingCartProvider'
import ConfigureAppStore from '@/store/store'
import initialState from '@/store/initialState'
import React, { useState } from 'react'
import DataInitializer from '@/app/components/DataInitializer'

export default function Providers ({ children }) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5000,
          refetchOnWindowFocus: false
        }
      }
    })
  )

  const store = ConfigureAppStore(initialState())

  if (!store) {
     return <>{children}</> // Fallback if store fails, though it shouldn't
  }

  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <ShoppingCartProvider>
          <DataInitializer />
          {children}
          <ReactQueryDevtools />
        </ShoppingCartProvider>
      </Provider>
    </QueryClientProvider>
  )
}

Providers.propTypes = {
  children: PropTypes.any
}
