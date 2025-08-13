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
          "url": "https://gallifrey.consulting/gallifrey-logo.png",
          "width": 436,
          "height": 133
        }
      },
      {
        "@type": "Service",
        "@id": "https://gallifrey.consulting/own-your-narrative#digitalindependence",
        "name": "Digital Independence & Sovereignty Services",
        "description": "Stop building someone else's empire. Professional web development, data privacy protection, and complete digital independence at accessible prices.",
        "provider": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "serviceType": "Digital Independence Solutions",
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Digital Independence Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Independence Package",
                "description": "Custom website with complete data ownership and privacy protection"
              },
              "price": "500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Data Privacy Protection",
                "description": "Comprehensive data cleanup and privacy protection services"
              },
              "price": "1500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Platform Independence Solution",
                "description": "Break free from Big Tech with custom digital solutions"
              },
              "price": "2500",
              "priceCurrency": "AUD"
            }
          ]
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://gallifrey.consulting/own-your-narrative#webpage",
        "url": "https://gallifrey.consulting/own-your-narrative",
        "name": "Own Your Narrative - Digital Independence",
        "description": "Stop being the product. Break free from Big Tech dependency with professional web development and data privacy protection at accessible prices.",
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
        title="Stop Being The Product - Own Your Digital Narrative | Gallifrey Consulting"
        description="Stop building someone else's empire. Break free from Big Tech dependency with professional web development, data privacy protection, and complete digital independence at accessible prices."
        canonical="https://gallifrey.consulting/own-your-narrative"
        openGraph={{
          url: 'https://gallifrey.consulting/own-your-narrative',
          title: 'Stop Being The Product - Own Your Digital Narrative | Gallifrey Consulting',
          description: 'Stop building someone else&apos;s empire. Break free from Big Tech dependency with professional web development, data privacy protection, and complete digital independence at accessible prices.',
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
            content: 'digital independence, data ownership, privacy protection, Big Tech alternative, platform independence, digital sovereignty, custom websites, data privacy, small business websites, affordable web development, own your data, digital freedom'
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
