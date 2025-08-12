import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { NextSeo } from 'next-seo'
import { OwnYourNarrative } from '@/components/OwnYourNarrative'

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
        "@id": "https://gallifrey.consulting/own-your-narrative#personalbrandliberation",
        "name": "Personal Brand Liberation Services",
        "description": "Break free from social media dependency with custom websites that you own completely. Specialized services for creators, entrepreneurs, and personal brands.",
        "provider": {
          "@id": "https://gallifrey.consulting/#organization"
        },
        "serviceType": "Personal Brand Website Development",
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Personal Brand Liberation Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Personal Brand Liberation",
                "description": "Custom domain ownership with SEO-optimized content and direct audience connection"
              },
              "price": "1500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Creator Economy Platform",
                "description": "Monetization platform with subscription billing and course delivery"
              },
              "price": "3500",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Storytelling Hub",
                "description": "Portfolio showcase with blog platform and social proof display"
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
        "name": "Own Your Narrative - Personal Brand Liberation",
        "description": "Break free from social media dependency. Custom websites for creators, entrepreneurs, and personal brands who want to own their digital narrative.",
        "isPartOf": {
          "@id": "https://gallifrey.consulting/#website"
        },
        "about": {
          "@id": "https://gallifrey.consulting/own-your-narrative#personalbrandliberation"
        }
      }
    ]
  }

  return (
    <>
      <NextSeo
        title="Own Your Narrative - Personal Brand Liberation | Gallifrey Consulting"
        description="Break free from social media dependency with custom websites that you own completely. Specialized services for creators, entrepreneurs, and personal brands ready to own their digital narrative."
        canonical="https://gallifrey.consulting/own-your-narrative"
        openGraph={{
          url: 'https://gallifrey.consulting/own-your-narrative',
          title: 'Own Your Narrative - Personal Brand Liberation | Gallifrey Consulting',
          description: 'Break free from social media dependency with custom websites that you own completely. Specialized services for creators, entrepreneurs, and personal brands ready to own their digital narrative.',
          images: [
            {
              url: 'https://gallifrey.consulting/og-image-narrative.jpg',
              width: 1200,
              height: 630,
              alt: 'Own Your Narrative - Personal Brand Liberation Services',
            },
          ],
          site_name: 'Gallifrey Consulting',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'personal brand website, creator economy platform, digital independence, social media alternative, custom domain ownership, content creator website, entrepreneur website, personal brand liberation, digital storytelling, platform independence'
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
        <OwnYourNarrative />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
