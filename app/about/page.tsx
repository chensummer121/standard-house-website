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
            alt="African architecture"
            fill
            className="object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Building Dreams,<br />
              <span className="text-primary">Creating Homes</span>
            </h1>
            <p className="text-lg text-earth-200">
              For over 15 years, Standard House has been transforming visions into reality. 
              We combine African heritage with modern innovation to create homes that inspire.
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
              <h2 className="heading-2 mt-2 mb-6">A Legacy of Excellence</h2>
              <div className="space-y-4 text-body">
                <p>
                  Founded in 2009, Standard House began with a simple mission: to provide 
                  quality, affordable housing that celebrates African architectural heritage.
                </p>
                <p>
                  What started as a small team of passionate architects and builders has 
                  grown into one of Ethiopia's most trusted construction companies.
                </p>
                <p>
                  Today, we've completed over 500 projects across 12 African countries, 
                  from cozy family homes to luxurious villas, always maintaining our 
                  commitment to quality, sustainability, and client satisfaction.
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
                <div className="text-4xl font-bold text-primary mb-1">15+</div>
                <div className="text-earth-600">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-earth-50">
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
                title: "Client-Centric",
                description: "Your vision is our priority. We listen, adapt, and deliver beyond expectations."
              },
              {
                icon: Award,
                title: "Quality First",
                description: "Premium materials, expert craftsmanship, and rigorous quality control on every project."
              },
              {
                icon: Globe,
                title: "Sustainability",
                description: "Eco-friendly practices and designs that respect our environment for future generations."
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

      {/* Team Section */}
      <section id="team" className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-medium">Our Team</span>
            <h2 className="heading-2 mt-2 mb-4">Meet the Experts</h2>
            <p className="text-body">
              A dedicated team of architects, engineers, and project managers working together 
              to bring your vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Dr. Samuel Mengistu", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
              { name: "Tigist Haile", role: "Head Architect", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
              { name: "Abraham Kebede", role: "Project Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
              { name: "Hiwot Tadesse", role: "Design Lead", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-earth-800">{member.name}</h3>
                <p className="text-earth-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="section-padding bg-sage-800 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Our Partners</h2>
            <p className="text-sage-200">
              We collaborate with leading organizations to deliver exceptional value.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["National Bank", "Ethio Telecom", "CBE", "Awash Bank"].map((partner) => (
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
                      Bole Road, Atlas Building, 5th Floor<br />
                      Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-800 mb-1">Call Us</h3>
                    <p className="text-earth-600">+251 911 234 567</p>
                    <p className="text-earth-600">+251 11 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-800 mb-1">Email Us</h3>
                    <p className="text-earth-600">hello@standard-house.com</p>
                    <p className="text-earth-600">sales@standard-house.com</p>
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
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>General Inquiry</option>
                    <option>House Design Consultation</option>
                    <option>Investment Inquiry</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help you?"
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
