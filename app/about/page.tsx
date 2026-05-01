import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Users,
  Award,
  Globe,
  Heart,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative bg-earth-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Modern prefabricated home"
            fill
            className="object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Redefining Construction<br />
              <span className="text-primary">in East Africa</span>
            </h1>
            <p className="text-lg text-earth-200">
              Standard House brings prefabricated technology and PropTech innovation to Uganda, 
              making quality housing accessible and affordable.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">Our Story</span>
              <h2 className="heading-2 mt-2 mb-6">From China to Uganda</h2>
              <div className="space-y-4 text-body">
                <p>
                  Founded in China in 2012, Standard House began as a small team of passionate architects 
                  dedicated to innovation in prefabricated construction technology.
                </p>
                <p>
                  With over a decade of experience in the construction industry, we have perfected 
                  the art of standardized modular building — combining efficiency, quality, and affordability.
                </p>
                <p>
                  Today, we bring this expertise to Uganda, introducing our "blueprint + materials + construction" 
                  one-stop custom housing model to East Africa. We believe everyone deserves a home built with 
                  precision, transparency, and care.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Construction team"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6">
                <div className="text-4xl font-bold text-primary mb-1">12+</div>
                <div className="text-earth-600">Years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-2xl font-display font-bold text-earth-800 mb-4">Our Vision</h3>
              <p className="text-earth-600 text-lg italic mb-4">
                "居者有其屋，让建筑回归造福于人的居住本质"
              </p>
              <p className="text-earth-600">
                Everyone deserves a home. We believe construction should serve humanity's fundamental 
                need for shelter — simple, reliable, and accessible like purchasing an industrial standard product.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-2xl font-display font-bold text-earth-800 mb-4">Our Mission</h3>
              <p className="text-earth-600 text-lg italic mb-4">
                "重新定义乌干达的建造方式"
              </p>
              <p className="text-earth-600">
                To redefine how Uganda builds — making home construction as simple and reliable 
                as purchasing industrial standard products. Transparent pricing, guaranteed timelines, 
                zero surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Our Core Values</h2>
            <p className="text-body">
              These principles guide every decision we make and every home we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Transparency",
                description: "100% transparent pricing. Every bolt, every beam accounted for. No hidden costs."
              },
              {
                icon: Award,
                title: "Quality First",
                description: "Premium materials, expert craftsmanship, and rigorous quality control on every project."
              },
              {
                icon: Globe,
                title: "Innovation",
                description: "PropTech solutions that simplify construction and empower clients with information."
              }
            ].map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center p-8 bg-white rounded-2xl shadow-md">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-earth-200 flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-earth-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-earth-800 mb-2">{value.title}</h3>
                  <p className="text-earth-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="section-padding bg-sage-800 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Our Partners</h2>
            <p className="text-sage-200">
              We collaborate with leading organizations across Uganda to deliver exceptional value.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Stanbic Bank Uganda", "DFCU Bank", "Uganda Revenue Authority", "NEMA Uganda"].map((partner) => (
              <div key={partner} className="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
                <div className="h-16 bg-white/20 rounded-lg mb-3" />
                <span className="font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <span className="text-primary font-medium">Get in Touch</span>
              <h2 className="heading-2 mt-2 mb-6">Contact Us</h2>
              <p className="text-body mb-8">
                Have questions about your dream home? We're here to help. Reach out to us 
                through any of the channels below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-800 mb-1">Visit Our Office</h3>
                    <p className="text-earth-600">
                      6th Street, Industrial Area<br />
                      Kampala, Uganda
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-800 mb-1">Call / WhatsApp</h3>
                    <p className="text-earth-600">+256 766 969 867</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-800 mb-1">Email Us</h3>
                    <p className="text-earth-600">standradhouseug@standard-house.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-800 mb-1">Business Hours</h3>
                    <p className="text-earth-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-earth-600">Saturday: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-earth-800 mb-6">Send Us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+256 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
