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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { GetStaticProps } from 'next'

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

const NarrativePreview = dynamic(() => import('@/components/NarrativePreview').then(mod => ({ default: mod.NarrativePreview })), {
  ssr: false,
  loading: () => null
})

const DevUtils = dynamic(() => import('@/components/DevUtils').then(mod => ({ default: mod.DevUtils })), {
  ssr: false,
  loading: () => null
})


export default function Home() {
  const { t } = useTranslation('common');
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
        "description": "Global AI-powered infrastructure agency specializing in self-healing systems, autonomous operations, Ubuntu/Kali SOC services, and intelligent cloud management with 99.99% uptime guarantee.",
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
        "name": "Autonomous Infrastructure & Self-Healing Operations",
        "description": "AI-powered infrastructure that manages itself, reduces operational costs by 70%, and achieves 99.99% uptime through self-healing systems and autonomous operations",
        "provider": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Autonomous Infrastructure & Self-Healing Operations",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Infrastructure Liberation & Autonomous SOC",
                "description": "Self-healing Ubuntu/Kali VPS infrastructure with AI-driven threat detection - achieve moksha from operational burden through autonomous operations"
              },
              "price": "8000",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cloud Moksha & Flow State Operations",
                "description": "Multi-cloud AI orchestration with self-optimizing resource allocation - liberation from manual operations through intelligent automation and ubuntu principles"
              },
              "price": "15000",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Nirvana & Business Continuity",
                "description": "Autonomous disaster recovery systems with AI-powered failover - achieve perfect operational balance through self-healing infrastructure moksha"
              },
              "price": "12000",
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
            "name": "What makes Gallifrey Consulting different from other infrastructure providers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We&apos;re AI-powered infrastructure specialists who help you achieve digital moksha - complete liberation from operational burden. Every solution features self-healing systems, ubuntu principles for collective security, and flow state optimization that reduces costs by 70% while achieving 99.99% uptime."
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
            "name": "What autonomous infrastructure and moksha services do you provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide self-healing infrastructure (Ubuntu/Kali SOC, multi-cloud orchestration, autonomous scaling) with AI-powered liberation from manual operations. Our services include Infrastructure Moksha, Flow State Operations, Digital Nirvana continuity, and ubuntu-based collective security - achieving perfect operational balance."
            }
          }
        ]
      }
    ]
  }

  return (
    <>
      <NextSeo
        title={t('seo.defaultTitle')}
        description={t('seo.defaultDescription')}
        canonical="https://gallifrey.consulting"
        openGraph={{
          url: 'https://gallifrey.consulting',
          title: 'Self-Healing AI Infrastructure | Digital Moksha & Flow State Operations',
          description: 'AI-powered infrastructure specialists delivering self-healing systems, operational moksha, and 99.99% uptime with 70% cost reduction through ubuntu principles.',
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
        <DevUtils />
        <Header />
        <Hero />
        <PlatformAssessment />
        <Services />
        <Testimonials />
        <TrustAndSecurity />
        <Pricing />
        <FAQ />
        <ConsultativeContact />
        <NarrativePreview />
        <Footer />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'home', 'services', 'pricing', 'faq'])),
    },
  }
}
