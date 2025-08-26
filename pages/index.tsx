import { Footer } from '@/components/Footer'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { NextSeo } from 'next-seo'
import { Services } from '@/components/Services'
import { Testimonials } from '@/components/Testimonials'
import { TrustAndSecurity } from '@/components/TrustAndSecurity'
import dynamic from 'next/dynamic'

// Lazy load below-the-fold components
const Pricing = dynamic(() => import('@/components/Pricing').then(mod => ({ default: mod.Pricing })), {
  ssr: false,
  loading: () => <div className="py-20 bg-gallifrey-section animate-pulse" aria-label="Loading pricing section" />
})

const FAQ = dynamic(() => import('@/components/FAQ').then(mod => ({ default: mod.FAQ })), {
  ssr: false,
  loading: () => <div className="py-20 bg-white animate-pulse" aria-label="Loading FAQ section" />
})

const ConsultativeContact = dynamic(() => import('@/components/ConsultativeContact').then(mod => ({ default: mod.ConsultativeContact })), {
  ssr: false,
  loading: () => <div className="py-20 bg-gallifrey-section animate-pulse" aria-label="Loading contact section" />
})


export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://gallifrey.consulting/#organization",
        "name": "Gallifrey Consulting",
        "url": "https://gallifrey.consulting",
        "logo": {
          "@type": "ImageObject",
          "url": "https://gallifrey.consulting/gallifrey-logo.webp",
          "width": 436,
          "height": 133
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+61-3-xxxx-xxxx",
          "contactType": "customer service",
          "areaServed": "AU",
          "availableLanguage": "English"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Melbourne",
          "addressRegion": "Victoria",
          "addressCountry": "Australia"
        },
        "sameAs": [
          "https://linkedin.com/company/gallifrey-consulting",
          "https://twitter.com/gallifreyconsulting"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://gallifrey.consulting/#localbusiness",
        "name": "Gallifrey Consulting",
        "image": "https://gallifrey.consulting/og-image.jpg",
        "description": "Melbourne enterprise web development agency specializing in digital sovereignty, security-first custom solutions, GDPR compliance, and enterprise-grade digital protection services.",
        "url": "https://gallifrey.consulting",
        "telephone": "+61-3-xxxx-xxxx",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Melbourne",
          "addressRegion": "Victoria",
          "postalCode": "3000",
          "addressCountry": "Australia"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -37.8136,
          "longitude": 144.9631
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "09:00",
          "closes": "17:00"
        },
        "priceRange": "$800-$50000",
        "currenciesAccepted": "AUD",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer"
      },
      {
        "@type": "Service",
        "@id": "https://gallifrey.consulting/#customdevelopment",
        "name": "Enterprise Web Development & Digital Sovereignty Services",
        "description": "Enterprise-grade web development with security-first architecture, custom digital solutions, and comprehensive digital sovereignty services for business continuity",
        "provider": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Enterprise Development & Digital Sovereignty Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Enterprise Website Development",
                "description": "Security-first custom web development with enterprise-grade architecture and comprehensive digital protection"
              },
              "price": "1500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Enterprise Design Systems",
                "description": "Scalable design systems and component libraries with enterprise-grade security and accessibility standards"
              },
              "price": "5000",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Sovereignty & Privacy Protection",
                "description": "Comprehensive digital independence solutions including data protection, platform migration, and enterprise privacy compliance"
              },
              "price": "2500",
              "priceCurrency": "AUD"
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://gallifrey.consulting/#website",
        "url": "https://gallifrey.consulting",
        "name": "Gallifrey Consulting",
        "description": "Enterprise Web Development Melbourne | Digital Sovereignty & Security Solutions",
        "publisher": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://gallifrey.consulting/?s={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What makes Gallifrey Consulting different from other development agencies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We&apos;re pixel-perfect web developers who craft custom design systems with obsessive attention to detail. Every website and digital solution we create is hand-coded from scratch with mathematical precision. Plus, we offer digital sovereignty and privacy protection services."
            }
          },
          {
            "@type": "Question",
            "name": "Do you serve clients outside of Melbourne?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, while we&apos;re based in Melbourne, we serve clients across Australia and internationally. All our services can be delivered remotely with excellent communication and project management."
            }
          },
          {
            "@type": "Question",
            "name": "What development and security services do you provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide pixel-perfect web development (custom websites, bespoke design systems, digital solutions) with obsessive design detail, plus digital sovereignty services including privacy protection, data cleanup, platform independence, and custom digital experiences."
            }
          }
        ]
      }
    ]
  }

  return (
    <>
      <NextSeo
        title="Custom Development Melbourne | Enterprise Security"
        description="Melbourne's premier web agency. Security-first development, GDPR compliance, digital sovereignty. Professional web solutions with enterprise protection."
        canonical="https://gallifrey.consulting"
        openGraph={{
          url: 'https://gallifrey.consulting',
          title: 'Melbourne Web Development | Security-First Digital Solutions',
          description: 'Melbourne web agency specializing in security-first development, GDPR compliance, and digital sovereignty solutions.',
          images: [
            {
              url: 'https://gallifrey.consulting/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Gallifrey Consulting - Pixel-Perfect Web Development Melbourne',
            },
          ],
          site_name: 'Gallifrey Consulting',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'Melbourne enterprise web development, digital sovereignty Melbourne, security-first development, GDPR compliance Melbourne, enterprise web solutions, custom website design Melbourne, data protection services, platform independence, digital narrative control, Melbourne web development agency, bespoke web development, privacy compliance, digital security consulting, enterprise security Melbourne'
          },
          {
            property: 'article:author',
            content: 'Gallifrey Consulting'
          },
          {
            name: 'geo.region',
            content: 'AU-VIC'
          },
          {
            name: 'geo.placename',
            content: 'Melbourne'
          }
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Preload critical resources for better Core Web Vitals */}
        <link rel="preload" href="/gallifrey-logo.webp" as="image" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </Head>
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <Services />
        <Testimonials />
        <TrustAndSecurity />
        <Pricing />
        <FAQ />
        <ConsultativeContact />
        <Footer />
      </div>
    </>
  )
}
