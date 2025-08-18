import { Contact } from '@/components/Contact'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { NextSeo } from 'next-seo'
import { Pricing } from '@/components/Pricing'
import { PrivacySecurity } from '@/components/PrivacySecurity'
import { Services } from '@/components/Services'
// import { Work } from '@/components/Work'

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
        <PrivacySecurity />
        {/* <Work /> */}
        <Features />

        {/* Own Your Narrative Campaign CTA - Temporarily hidden */}
        {/* <section className="py-20 px-4 bg-gradient-to-r from-[#1a237e] to-[#00695c] relative overflow-hidden">
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="mb-6">
              <span className="text-sm font-medium tracking-wider text-white/80 uppercase mb-4 block">
                Digital Sovereignty
              </span>
              <div className="w-12 h-px bg-white/40 mx-auto mb-8"></div>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6 text-white">
              Ready to <span className="italic text-[#ffa726]">Own Your Narrative</span>?
            </h2>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8">
              Stop building someone else&apos;s empire. Break free from Big Tech dependency with custom websites, data privacy protection, and complete digital independence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/own-your-narrative"
                className="inline-flex items-center px-8 py-3 bg-white text-[#1a237e] font-medium rounded-lg hover:bg-white/90 transition-colors"
              >
                Discover Digital Independence
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/own-your-narrative"
                className="inline-flex items-center px-8 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/80">
                <span>47 Data Brokers Removed</span>
                <span>•</span>
                <span>$2.3M Revenue Generated</span>
                <span>•</span>
                <span>100% Client Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#42a5f5]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ffa726]/20 to-transparent rounded-full blur-3xl"></div>
        </section> */}

        <Pricing />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
