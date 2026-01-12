'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

function ClientProvider({children}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default ClientProvider