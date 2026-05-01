import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Bed, Bath, Maximize, Hammer, Package, Clock } from "lucide-react";

const houseModels = [
  {
    id: "model-a",
    name: "Model A - Economy Single Story",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    bedrooms: 2,
    bathrooms: 1,
    area: "65-80",
    structure: "Prefabricated Steel Frame",
    timeline: "30 Days",
    price: "From UGX 200M",
    badge: "Economy",
    description: "Perfect starter home with efficient layout. Prefabricated steel structure for quick assembly.",
    features: [
      "Open plan living & dining",
      "2 comfortable bedrooms",
      "1 modern bathroom",
      "Steel frame construction",
      "Complete BOM package",
    ],
  },
  {
    id: "model-b",
    name: "Model B - Standard Family Home",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: "120-150",
    structure: "Standard BOM Package",
    timeline: "45 Days",
    price: "From UGX 450M",
    badge: "Popular",
    description: "Our most popular model. Complete BOM package with 45-day guaranteed delivery.",
    features: [
      "Spacious open plan layout",
      "3 bedrooms with closet space",
      "2 full bathrooms",
      "Standard BOM included",
      "Kitchen & utility area",
    ],
  },
  {
    id: "model-c",
    name: "Model C - Premium Villa Series",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    bedrooms: 4,
    bathrooms: 3,
    area: "200-400",
    structure: "Modular Custom",
    timeline: "Custom Timeline",
    price: "Contact for Quote",
    badge: "Premium",
    description: "Fully customizable modular design. Expand your living space as your family grows.",
    features: [
      "Flexible room configuration",
      "Premium finishes available",
      "Multi-level options",
      "Modular expansion ready",
      "Full customization support",
    ],
  },
];

export default function HouseDesignsPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Header */}
      <section className="bg-earth-800 text-white py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Standard Model Library</h1>
          <p className="text-earth-200 text-lg max-w-2xl">
            Choose from our curated collection of prefabricated home models. Each model comes with a 
            complete BOM (Bill of Materials) package — transparent pricing from blueprint to keys.
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-primary/10 py-8">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-medium">100% BOM Transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <Hammer className="h-5 w-5 text-primary" />
              <span className="font-medium">Turnkey Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">Guaranteed Timelines</span>
            </div>
          </div>
        </div>
      </section>

      {/* House Models */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="space-y-16">
            {houseModels.map((house, index) => (
              <div 
                key={house.id} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={house.image}
                      alt={house.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                        {house.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-earth-800 mb-4">
                    {house.name}
                  </h2>
                  <p className="text-earth-600 mb-6">{house.description}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                      <Bed className="h-6 w-6 mx-auto text-primary mb-1" />
                      <div className="text-xl font-bold text-earth-800">{house.bedrooms}</div>
                      <div className="text-xs text-earth-500">Bedrooms</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                      <Bath className="h-6 w-6 mx-auto text-primary mb-1" />
                      <div className="text-xl font-bold text-earth-800">{house.bathrooms}</div>
                      <div className="text-xs text-earth-500">Bathrooms</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                      <Maximize className="h-6 w-6 mx-auto text-primary mb-1" />
                      <div className="text-xl font-bold text-earth-800">{house.area}m²</div>
                      <div className="text-xs text-earth-500">Area</div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-sage-600" />
                      <span className="text-earth-600">{house.structure}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-sage-600" />
                      <span className="text-earth-600">{house.timeline}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {house.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-earth-600">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price & CTA */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-2xl font-bold text-primary">{house.price}</div>
                    <Link 
                      href="/configurator" 
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      Configure This Model
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-earth-700 to-sage-800 rounded-3xl p-8 md:p-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Can't Find the Perfect Model?
            </h2>
            <p className="text-earth-200 mb-8 max-w-2xl mx-auto">
              Use our AI-powered configurator to customize any model to your needs, or contact 
              our team for personalized design consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/configurator" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors">
                Start Custom Configuration
              </Link>
              <Link href="/about#contact" className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-lg transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
