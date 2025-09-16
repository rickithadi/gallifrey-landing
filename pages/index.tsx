import { Footer } from '@/components/Footer'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { NextSeo } from 'next-seo'
import { Services } from '@/components/Services'
import { PlatformAssessment } from '@/components/PlatformAssessment'
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
        "description": "Global enterprise AI security agency specializing in AI threat protection, quantum-secure custom solutions, deepfake detection, and enterprise-grade AI governance services.",
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
        "name": "Enterprise AI Security & Digital Protection Services",
        "description": "Enterprise-grade AI security with quantum-resistant architecture, custom AI-secure solutions, and comprehensive AI governance services for business continuity",
        "provider": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Enterprise AI Security & Digital Protection Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI-Resistant Enterprise Development",
                "description": "Quantum-secure custom development with AI threat modeling, deepfake protection, and comprehensive digital AI defense"
              },
              "price": "2500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Security & Governance Systems",
                "description": "Enterprise AI governance frameworks, AI threat monitoring, and compliance systems with real-time AI attack detection"
              },
              "price": "8000",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital AI Protection & Sovereignty",
                "description": "Comprehensive AI threat protection including deepfake detection, prompt injection prevention, and AI-resistant platform independence"
              },
              "price": "5000",
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
            "name": "What makes Gallifrey Consulting different from other AI security agencies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We&apos;re quantum-secure AI specialists who craft custom defense systems with obsessive attention to emerging threats. Every digital solution we create is hand-coded with AI threat modeling and mathematical precision. Plus, we offer comprehensive AI governance and deepfake protection services."
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
            "name": "What AI security and protection services do you provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide quantum-secure AI development (custom websites, AI-resistant systems, digital solutions) with obsessive security detail, plus comprehensive AI protection services including deepfake detection, prompt injection prevention, AI governance, and custom AI-secure digital experiences."
            }
          }
        ]
      }
    ]
  }

  return (
    <>
      <NextSeo
        title="Global AI Security | Enterprise Digital Protection"
        description="World's premier AI security agency. AI-resistant development, deepfake protection, prompt injection prevention, quantum-secure digital solutions with enterprise AI governance."
        canonical="https://gallifrey.consulting"
        openGraph={{
          url: 'https://gallifrey.consulting',
          title: 'Global AI Security | AI-Resistant Digital Solutions',
          description: 'Global AI security specialists delivering quantum-secure development, deepfake protection, and enterprise AI governance solutions.',
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
            content: 'global AI security, artificial intelligence cybersecurity, AI threat protection, deepfake detection, prompt injection prevention, quantum-secure development, enterprise AI governance, AI-resistant architecture, international AI consulting, digital AI protection, AI security compliance, enterprise AI solutions, AI threat monitoring, cybersecurity AI, AI security specialists'
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
        <PlatformAssessment />
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
