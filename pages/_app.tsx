import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import React from 'react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Gallifrey Digital"
        defaultTitle="Gallifrey Digital - Engineered Digital Experiences"
        description="Secure, strategic digital solutions for business growth"
        openGraph={{
          type: 'website',
          locale: 'en_AU',
          site_name: 'Gallifrey Digital',
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
