import { Footer } from '@/components/Footer'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import { OwnYourNarrative } from '@/components/OwnYourNarrative'
import { OwnYourNarrativeHeader } from '@/components/OwnYourNarrativeHeader'

export default function OwnYourNarrativePage() {
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
        }
      },
      {
        "@type": "Service",
        "@id": "https://gallifrey.consulting/own-your-narrative#digitalindependence",
        "name": "Digital Dharma & Personal Reputation Management Services",
        "description": "Individual digital wellness and reputation management for high-profile individuals, creators, and privacy-conscious families. Achieve authentic digital presence and platform independence. Starting at $1,000/month.",
        "provider": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "serviceType": "Digital Wellness & Reputation Management Services",
        "areaServed": [
          {
            "@type": "Country",
            "name": "Australia"
          },
          {
            "@type": "City",
            "name": "Melbourne"
          },
          {
            "@type": "State",
            "name": "Victoria"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Digital Dharma & Savasthya Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Savasthya Monthly",
                "description": "Personal reputation wellness and platform independence monitoring for high-profile individuals"
              },
              "price": "1000",
              "priceCurrency": "USD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Dharma Professional",
                "description": "Comprehensive narrative control and market authority for business leaders and professionals"
              },
              "price": "2500",
              "priceCurrency": "USD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Dharma Analysis",
                "description": "One-time comprehensive audit and strategy session for platform independence"
              },
              "price": "297",
              "priceCurrency": "USD"
            }
          ]
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://gallifrey.consulting/own-your-narrative#webpage",
        "url": "https://gallifrey.consulting/own-your-narrative",
        "name": "Own Your Narrative - Digital Independence",
        "description": "What happens when someone Googles your business? Take control of your search results with professional web development that puts you first.",
        "isPartOf": {
          "@id": "https://gallifrey.consulting/#website"
        },
        "about": {
          "@id": "https://gallifrey.consulting/own-your-narrative#digitalindependence"
        }
      }
    ]
  }

  return (
    <>
      <NextSeo
        title="Melbourne Web Development | Google Search Results Optimization | Professional Websites from $500"
        description="Professional web development Melbourne. Control your Google search results with custom websites that rank first. Platform-independent digital presence from $500. Free audit available."
        canonical="https://gallifrey.consulting/own-your-narrative"
        openGraph={{
          url: 'https://gallifrey.consulting/own-your-narrative',
          title: 'Melbourne Web Development | Professional Website Design & SEO',
          description: 'Professional web development in Melbourne. Custom websites that dominate Google search results. Platform-independent digital presence starting from $500.',
          images: [
            {
              url: 'https://gallifrey.consulting/og-image-narrative.jpg',
              width: 1200,
              height: 630,
              alt: 'Own Your Narrative - Digital Independence Services',
            },
          ],
          site_name: 'Gallifrey Consulting',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'melbourne web development, professional website design melbourne, custom website development, google search optimization, seo web design melbourne, business website melbourne, web developer melbourne, website design melbourne, professional web design, search engine optimization melbourne, custom web development melbourne, small business websites melbourne'
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
        <OwnYourNarrativeHeader variant="blur" />
        <div className="pt-16 md:pt-20">
          <OwnYourNarrative />
        </div>
        <Footer />
      </div>
    </>
  )
}
