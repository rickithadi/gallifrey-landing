import { Contact } from '@/components/Contact'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { OwnYourNarrative } from '@/components/OwnYourNarrative'
import { Pricing } from '@/components/Pricing'
import { Services } from '@/components/Services'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Services />
      <OwnYourNarrative />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}
