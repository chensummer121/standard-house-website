import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    id: "1",
    title: "Bole Hills Residence",
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    completedDate: "Dec 2023",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Summit Gardens",
    location: "Summit, Addis Ababa",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    completedDate: "Mar 2024",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Kала Premium Villas",
    location: "Kала, Addis Ababa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    completedDate: "Expected Aug 2024",
    status: "in-progress" as const,
  },
  {
    id: "4",
    title: "Green Valley Estate",
    location: "Gerji, Addis Ababa",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    completedDate: "Expected Nov 2024",
    status: "in-progress" as const,
  },
  {
    id: "5",
    title: "Palm Springs Complex",
    location: "CMC, Addis Ababa",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    completedDate: "Jan 2024",
    status: "completed" as const,
  },
  {
    id: "6",
    title: "Lakeside Residences",
    location: "Bishoftu",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    completedDate: "Expected Dec 2024",
    status: "in-progress" as const,
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
            Explore our portfolio of completed and ongoing projects. Each home we build 
            is a testament to our commitment to quality and innovation.
          </p>
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
          <div className="bg-gradient-to-r from-earth-100 to-sage-100 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-800 mb-4">
              Want to See Your Home in Our Gallery?
            </h2>
            <p className="text-earth-600 mb-8 max-w-2xl mx-auto">
              Start your own project today and join our family of satisfied homeowners. 
              Your dream home could be our next featured project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/configurator" className="btn-primary">
                Start Your Project
              </a>
              <a href="/about#contact" className="btn-outline">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
