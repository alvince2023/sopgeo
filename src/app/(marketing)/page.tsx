import { Hero } from "@/components/marketing/hero";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { PlatformShowcase } from "@/components/marketing/platform-showcase";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQSection } from "@/components/marketing/faq-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesGrid />
      <PlatformShowcase />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
