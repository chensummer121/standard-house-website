import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Home,
  Package,
  Clock,
  Building2,
  TrendingUp,
  Shield
} from "lucide-react";
import HouseCard from "@/components/HouseCard";
import ValueCard from "@/components/ValueCard";

// Product Models - Model A/B/C
const featuredHouses = [
  {
    id: "1",
    name: "Model A",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    bedrooms: 2,
    bathrooms: 1,
    area: 72,
    badge: "Economy",
    price: "UGX 200M",
    description: "Prefabricated steel structure, 65-80㎡"
  },
  {
    id: "2",
    name: "Model B",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    badge: "Popular",
    price: "UGX 450M",
    description: "Standard BOM package, 45-day delivery"
  },
  {
    id: "3",
    name: "Model C",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    badge: "Premium",
    price: "Custom Quote",
    description: "Modular customization, 200-400㎡"
  },
];

// Core Values - 3 pillars of PropTech
const values = [
  {
    icon: Home,
    title: "Standardized Floor Plans",
    description: "Our curated catalog of pre-designed homes lets you see your future home before breaking ground.",
  },
  {
    icon: Package,
    title: "Precise Material Package",
    description: "Every bolt, every beam accounted for. 100% transparent pricing with zero budget surprises.",
  },
  {
    icon: Clock,
    title: "Guaranteed Timeline",
    description: "Modular construction management ensures on-time delivery. No endless delays.",
  },
];

const roleButtons = [
  { role: "Home Buyer", description: "Find your dream home", icon: Home, href: "/house-designs" },
  { role: "Investor", description: "Explore ROI opportunities", icon: TrendingUp, href: "/investment" },
  { role: "Builder", description: "Start your project", icon: Building2, href: "/configurator" },
  { role: "Partner", description: "Join our network", icon: Shield, href: "/about#partners" },
];

export default function HomePage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Modern prefabricated home in Uganda"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-earth-900/80 via-earth-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 animate-fade-in">
              Build with Confidence, <span className="text-primary">Build with Standards</span>
            </h1>
            <p className="text-lg md:text-xl text-earth-100 mb-8 animate-slide-up">
              From blueprint to keys — prefabricated homes with transparent pricing and guaranteed timelines.
            </p>

            {/* I want to... buttons */}
            <div className="mb-12">
              <p className="text-primary font-medium mb-4">I want to...</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roleButtons.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.role}
                      href={item.href}
                      className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white hover:text-earth-800 transition-all duration-300"
                    >
                      <Icon className="h-8 w-8 mb-2 text-primary group-hover:text-earth-700" />
                      <span className="font-semibold text-sm">{item.role}</span>
                      <span className="text-xs text-earth-300 group-hover:text-earth-600 text-center mt-1">
                        {item.description}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/configurator" className="btn-primary inline-flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/house-designs" className="btn-outline border-white text-white hover:bg-white hover:text-earth-800">
                Browse Designs
              </Link>
              <button onClick={() => { const evt = new CustomEvent('openCozeChat'); window.dispatchEvent(evt); }} className="btn-primary bg-primary hover:bg-primary-600 inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                AI Consultant
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-medium">Why Choose Us</span>
            <h2 className="heading-2 mt-2 mb-4">PropTech Innovation in Uganda</h2>
            <p className="text-body">
              We combine prefabricated technology with transparent pricing to redefine how Africa builds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Houses Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-primary font-medium">Product Models</span>
              <h2 className="heading-2 mt-2">Featured Designs</h2>
              <p className="text-body mt-2 max-w-xl">
                Choose from our standardized catalog. See exactly what you get — no surprises.
              </p>
            </div>
            <Link
              href="/house-designs"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-earth-700 transition-colors"
            >
              View All Designs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredHouses.map((house) => (
              <HouseCard key={house.id} {...house} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="section-padding bg-sage-800 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">500+</div>
              <div className="text-sage-200">Homes Built</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">15+</div>
              <div className="text-sage-200">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">98%</div>
              <div className="text-sage-200">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">12</div>
              <div className="text-sage-200">African Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-earth-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Ready to Build Your Dream Home?</h2>
            <p className="text-body mb-8">
              Let our AI assistant help you design the perfect home. Answer a few questions 
              and get a personalized recommendation in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/configurator" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                Start Configurator
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/investment" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
                Investment Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
