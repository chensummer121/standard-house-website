import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    id: "1",
    title: "Kampala Hills Residence",
    location: "Kololo, Kampala",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    completedDate: "Dec 2023",
    status: "completed" as const,
    model: "Model B - Standard",
    description: "3-bedroom family home with complete BOM package",
  },
  {
    id: "2",
    title: "Namasuba Model A Home",
    location: "Namasuba, Kampala",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    completedDate: "Mar 2024",
    status: "completed" as const,
    model: "Model A - Economy",
    description: "2-bedroom prefabricated home, 30-day delivery",
  },
  {
    id: "3",
    title: "Industrial Area Multi-Unit",
    location: "Industrial Area, Kampala",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    completedDate: "Expected Oct 2024",
    status: "in-progress" as const,
    model: "Model C - Premium",
    description: "Multi-level villa with custom configuration",
  },
  {
    id: "4",
    title: "Bweyogerere Estate",
    location: "Bweyogerere, Kampala",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    completedDate: "Expected Nov 2024",
    status: "in-progress" as const,
    model: "Model B - Standard",
    description: "2-unit residential development",
  },
  {
    id: "5",
    title: "Ntinda Family Home",
    location: "Ntinda, Kampala",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    completedDate: "Jan 2024",
    status: "completed" as const,
    model: "Model B - Standard",
    description: "Modern 3-bedroom home with premium finishes",
  },
  {
    id: "6",
    title: "Entebbe Lakeside Villa",
    location: "Entebbe, Uganda",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    completedDate: "Expected Dec 2024",
    status: "in-progress" as const,
    model: "Model C - Premium",
    description: "Custom lakeside villa with premium package",
  },
];

export default function ProjectsPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Header */}
      <section className="bg-earth-800 text-white py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Projects</h1>
          <p className="text-earth-200 text-lg max-w-2xl">
            Explore our portfolio of completed and ongoing prefabricated home projects across Uganda. 
            Each home built with our standardized BOM system and guaranteed timelines.
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-primary/10 py-8">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">Model A</span>
              <span className="text-earth-600">— 30 Day Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">Model B</span>
              <span className="text-earth-600">— 45 Day Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">Model C</span>
              <span className="text-earth-600">— Custom Timeline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-earth-200 sticky top-16 md:top-20 z-40">
        <div className="container-custom py-4">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
              All Projects ({projects.length})
            </button>
            <button className="px-4 py-2 bg-earth-100 text-earth-700 hover:bg-earth-200 rounded-full text-sm font-medium transition-colors">
              Completed ({projects.filter((p) => p.status === "completed").length})
            </button>
            <button className="px-4 py-2 bg-earth-100 text-earth-700 hover:bg-earth-200 rounded-full text-sm font-medium transition-colors">
              In Progress ({projects.filter((p) => p.status === "in-progress").length})
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-earth-700 to-sage-800 rounded-3xl p-8 md:p-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Your Home Could Be Our Next Project
            </h2>
            <p className="text-earth-200 mb-8 max-w-2xl mx-auto">
              Join our growing family of homeowners across Uganda. With transparent pricing, 
              guaranteed timelines, and complete BOM packages, your dream home is just a 
              configuration away.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/configurator" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
                Configure Your Home
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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
