import Image from "next/image";
import { Filter, Grid, List } from "lucide-react";
import HouseCard from "@/components/HouseCard";

const categories = [
  { id: "all", name: "All Designs", count: 24 },
  { id: "villa", name: "Villas", count: 8 },
  { id: "family", name: "Family Homes", count: 10 },
  { id: "compact", name: "Compact Living", count: 6 },
];

const filters = {
  bedrooms: ["Any", "1", "2", "3", "4", "5+"],
  bathrooms: ["Any", "1", "2", "3", "4+"],
  area: ["Any", "Under 100m²", "100-200m²", "200-300m²", "300m²+"],
  price: ["Any", "Under 2M", "2M-5M", "5M-10M", "10M+"],
};

const houses = [
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
  {
    id: "5",
    name: "Baobab Estate",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    bedrooms: 6,
    bathrooms: 5,
    area: 550,
    badge: "Luxury",
    price: "ETB 12M",
  },
  {
    id: "6",
    name: "Camelia Townhouse",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    price: "ETB 2.4M",
  },
  {
    id: "7",
    name: "Sage Garden Villa",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    badge: "New",
    price: "ETB 5.8M",
  },
  {
    id: "8",
    name: "Cedar Studio",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    price: "ETB 950K",
  },
];

export default function HouseDesignsPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Header */}
      <section className="bg-earth-800 text-white py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">House Designs</h1>
          <p className="text-earth-200 text-lg max-w-2xl">
            Browse our collection of thoughtfully designed homes, from cozy compact living 
            to luxurious family villas. Find your perfect match.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-earth-200 sticky top-16 md:top-20 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    cat.id === "all"
                      ? "bg-primary text-white"
                      : "bg-earth-100 text-earth-700 hover:bg-earth-200"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3 lg:ml-auto">
              {Object.entries(filters).map(([key, values]) => (
                <select
                  key={key}
                  className="px-4 py-2 bg-earth-50 border border-earth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {values.map((val) => (
                    <option key={val} value={val}>
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </option>
                  ))}
                </select>
              ))}
              <button className="p-2 bg-earth-100 rounded-lg hover:bg-earth-200 transition-colors lg:hidden">
                <Filter className="h-5 w-5" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="hidden lg:flex items-center gap-2 bg-earth-100 rounded-lg p-1">
              <button className="p-2 bg-white rounded-md shadow-sm">
                <Grid className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white rounded-md transition-colors">
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* House Grid */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <p className="text-earth-600">
              Showing <span className="font-semibold">{houses.length}</span> designs
            </p>
            <select className="px-4 py-2 bg-white border border-earth-200 rounded-lg text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Size: Small to Large</option>
              <option>Size: Large to Small</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {houses.map((house) => (
              <HouseCard key={house.id} {...house} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-outline">
              Load More Designs
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-earth-700 to-sage-800 rounded-3xl p-8 md:p-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-earth-200 mb-8 max-w-2xl mx-auto">
              Use our AI-powered configurator to design your custom home, or contact 
              our team for personalized recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/configurator" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors">
                Start Custom Design
              </a>
              <a href="/about#contact" className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-lg transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
