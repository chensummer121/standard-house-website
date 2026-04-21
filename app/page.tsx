import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Users, 
  Hammer, 
  PiggyBank, 
  Home,
  Building2,
  TrendingUp,
  Shield,
  Leaf
} from "lucide-react";
import HouseCard from "@/components/HouseCard";
import ValueCard from "@/components/ValueCard";

// Sample house data
const featuredHouses = [
  {
    id: "1",
    name: "Savanna Villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    badge: "Popular",
    price: "ETB 4.5M",
  },
  {
    id: "2",
    name: "Acacia Family Home",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    price: "ETB 2.8M",
  },
  {
    id: "3",
    name: "Savannah Penthouse",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    badge: "Premium",
    price: "ETB 7.2M",
  },
  {
    id: "4",
    name: "Marula Compact",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    price: "ETB 1.5M",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainable Design",
    description: "Eco-friendly materials and energy-efficient designs that respect our environment while reducing your costs.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Every home built to international standards with premium materials and expert craftsmanship.",
  },
  {
    icon: TrendingUp,
    title: "Investment Value",
    description: "Properties designed to appreciate, with locations chosen for growth and rental potential.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building not just houses, but thriving communities with shared spaces and modern amenities.",
  },
];

const roleButtons = [
  { role: "Home Buyer", description: "Find your dream home", icon: Home, href: "/house-designs" },
  { role: "Investor", description: "Explore ROI opportunities", icon: TrendingUp, href: "/investment" },
  { role: "Builder", description: "Start your project", icon: Hammer, href: "/configurator" },
  { role: "Partner", description: "Join our network", icon: Building2, href: "/about#partners" },
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
            alt="Modern African home"
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
              Build Your <span className="text-primary">African Dream</span> Home
            </h1>
            <p className="text-lg md:text-xl text-earth-100 mb-8 animate-slide-up">
              Discover beautifully crafted homes inspired by African heritage. 
              From concept to keys, we bring your vision to life.
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
            <h2 className="heading-2 mt-2 mb-4">Built on Excellence</h2>
            <p className="text-body">
              We combine traditional African architectural beauty with modern construction 
              techniques to deliver homes that stand the test of time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <span className="text-primary font-medium">House Collection</span>
              <h2 className="heading-2 mt-2">Featured Designs</h2>
              <p className="text-body mt-2 max-w-xl">
                Explore our most popular home designs, each crafted with care and attention to detail.
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
