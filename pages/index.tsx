import { ConsultativeContact } from '@/components/ConsultativeContact'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { NextSeo } from 'next-seo'
import { Pricing } from '@/components/Pricing'
import { Services } from '@/components/Services'
import { Testimonials } from '@/components/Testimonials'
import { TrustAndSecurity } from '@/components/TrustAndSecurity'

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
        "description": "Melbourne pixel-perfect web development with obsessive attention to design detail. Custom-coded websites, bespoke design systems, and digital sovereignty solutions. Plus privacy protection and security services.",
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
        "name": "Pixel-Perfect Web Development & Digital Sovereignty Services",
        "description": "Custom-coded websites with obsessive design detail, bespoke design systems, plus digital sovereignty and privacy protection services",
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
                "name": "Pixel-Perfect Website Development",
                "description": "Custom-coded websites with obsessive attention to design detail and mathematical precision"
              },
              "price": "1500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Bespoke Design Systems",
                "description": "Hand-crafted design systems and component libraries built from scratch"
              },
              "price": "5000",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Sovereignty Services",
                "description": "Privacy protection, data cleanup, and platform independence solutions"
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
        "description": "Pixel-Perfect Web Development Melbourne | Custom Design Systems",
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
        title="Pixel-Perfect Digital Experiences | Gallifrey Digital Melbourne"
        description="Custom-coded websites with obsessive attention to design detail. Every pixel positioned with purpose, every interaction crafted to perfection. Starting at $800."
        canonical="https://gallifrey.consulting"
        openGraph={{
          url: 'https://gallifrey.consulting',
          title: 'Pixel-Perfect Digital Experiences | Gallifrey Digital Melbourne',
          description: 'Custom-coded websites with obsessive attention to design detail. Every pixel positioned with purpose, every interaction crafted to perfection. Starting at $800.',
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
            content: 'pixel perfect web development Melbourne, custom design systems, bespoke websites, digital sovereignty, privacy protection, hand-crafted development, boutique web development, trusted web development Melbourne'
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
