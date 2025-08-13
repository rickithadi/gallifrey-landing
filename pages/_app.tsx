import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { GoogleAnalytics } from '@next/third-parties/google'
import React from 'react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Gallifrey Consulting"
        defaultTitle="Gallifrey Consulting - Security-First Web Development Melbourne"
        description="Melbourne-based web development agency specializing in secure, GDPR-compliant websites. Starting at $500. Own your digital narrative with custom web solutions."
        canonical="https://gallifrey.consulting"
        openGraph={{
          type: 'website',
          locale: 'en_AU',
          url: 'https://gallifrey.consulting',
          site_name: 'Gallifrey Consulting',
          title: 'Gallifrey Consulting - Security-First Web Development Melbourne',
          description: 'Melbourne-based web development agency specializing in secure, GDPR-compliant websites. Starting at $500. Own your digital narrative with custom web solutions.',
          images: [
            {
              url: 'https://gallifrey.consulting/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Gallifrey Consulting - Security-First Web Development',
            },
          ],
        }}
        twitter={{
          handle: '@gallifreyconsulting',
          site: '@gallifreyconsulting',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
          {
            name: 'robots',
            content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            name: 'author',
            content: 'Gallifrey Consulting',
          },
          {
            name: 'geo.region',
            content: 'AU-VIC',
          },
          {
            name: 'geo.placename',
            content: 'Melbourne',
          },
          {
            name: 'geo.position',
            content: '-37.8136;144.9631',
          },
          {
            name: 'ICBM',
            content: '-37.8136, 144.9631',
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
          {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
            sizes: '180x180',
          },
          {
            rel: 'manifest',
            href: '/site.webmanifest',
          },
        ]}
      />
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </>
  )
}
