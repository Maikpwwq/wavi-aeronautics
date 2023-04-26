'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Hydrate,
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import ShoppingCartProvider from '@/app/tienda/providers/ShoppingCartProvider'
import ConfigureAppStore from '@/store/store'
import initialState from '@/store/initialState'
import React, { useState } from 'react'

export default function Providers ({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  const preloadState = initialState()
  const store = ConfigureAppStore(preloadState)

  return (
    <QueryClientProvider client={queryClient}>
      {/* contextSharing={true} */}
      <Provider store={store}>
        <ShoppingCartProvider>
          {/* <Hydrate state={pageProps.dehydratedState}></Hydrate> */}
          {children}
          <ReactQueryDevtools initialIsOpen />
        </ShoppingCartProvider>
      </Provider>
    </QueryClientProvider>
  )
}

Providers.propTypes = {
  children: PropTypes.any
}
