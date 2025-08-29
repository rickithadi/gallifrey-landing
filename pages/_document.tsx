import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Optimized Google Fonts loading for performance */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap"
        />

        {/* Meta tags for better performance and SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#2D5A87" />
        
        {/* Note: CSS is loaded via _app.tsx import, no manual preload needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}