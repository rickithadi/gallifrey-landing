import { Contact } from '@/components/Contact'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { NextSeo } from 'next-seo'
import { Pricing } from '@/components/Pricing'
import { Process } from '@/components/Process'
import { Services } from '@/components/Services'

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
          "url": "https://gallifrey.consulting/gallifrey-logo.png",
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
        "description": "Melbourne custom software development with security built-in. Bespoke websites, applications, and digital solutions at reasonable prices. Plus dedicated security services: pen tests, audits, appsec.",
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
        "priceRange": "$500-$50000",
        "currenciesAccepted": "AUD",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer"
      },
      {
        "@type": "Service",
        "@id": "https://gallifrey.consulting/#customdevelopment",
        "name": "Custom Software Development & Security Services",
        "description": "Bespoke software development with security built-in, plus dedicated security services including penetration testing, security audits, and application security",
        "provider": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Custom Development & Security Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom Website Development",
                "description": "Bespoke website development with security built-in from day one"
              },
              "price": "1500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom Application Development",
                "description": "Full-stack application development with enterprise-grade security"
              },
              "price": "5000",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Security Services",
                "description": "Penetration testing, security audits, and application security consulting"
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
        "description": "Custom Software Development Melbourne | Security-First",
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
              "text": "We're custom software developers who build security in from day one, not as an afterthought. Every website, application, and digital solution we create has enterprise-grade security built-in. Plus, we offer dedicated security services like penetration testing and security audits."
            }
          },
          {
            "@type": "Question",
            "name": "Do you serve clients outside of Melbourne?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, while we're based in Melbourne, we serve clients across Australia and internationally. All our services can be delivered remotely with excellent communication and project management."
            }
          },
          {
            "@type": "Question",
            "name": "What development and security services do you provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide custom software development (websites, applications, digital solutions) with security built-in, plus dedicated security services including penetration testing, security audits, application security consulting, GDPR compliance, and privacy-by-design architecture."
            }
          }
        ]
      }
    ]
  }

  return (
    <>
      <NextSeo
        title="Digital Experiences Worth Trusting | Gallifrey Digital Melbourne"
        description="Security-first web development that doesn't compromise on design or performance. Starting at $500, because good work shouldn't break the bank."
        canonical="https://gallifrey.consulting"
        openGraph={{
          url: 'https://gallifrey.consulting',
          title: 'Digital Experiences Worth Trusting | Gallifrey Digital Melbourne',
          description: 'Security-first web development that doesn\'t compromise on design or performance. Starting at $500, because good work shouldn\'t break the bank.',
          images: [
            {
              url: 'https://gallifrey.consulting/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Gallifrey Consulting - Security-First Web Development Melbourne',
            },
          ],
          site_name: 'Gallifrey Consulting',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'web development Melbourne, security-first development, custom websites, digital experiences, GDPR compliance, performance optimization, boutique web development, trusted web development Melbourne'
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
      </Head>
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Services />
        <Process />
        <Features />
        <Pricing />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
