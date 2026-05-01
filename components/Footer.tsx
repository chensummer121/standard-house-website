import Link from "next/link";
import { Home, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  explore: [
    { name: "House Designs", href: "/house-designs" },
    { name: "Configurator", href: "/configurator" },
    { name: "Gallery", href: "/projects" },
    { name: "Investment", href: "/investment" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about#team" },
    { name: "Contact", href: "/about#contact" },
    { name: "Careers", href: "/careers" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Support", href: "/support" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-earth-900 text-earth-100">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-earth-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-white">Standard</span>
                <span className="text-xl font-display font-bold text-primary"> House</span>
              </div>
            </Link>
            <p className="text-earth-300 mb-6 max-w-md">
              Building dreams across Africa with sustainable, beautiful, and affordable housing solutions. 
              Your vision, our expertise.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-earth-300">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3 text-earth-300">
                <Phone className="h-5 w-5 text-primary" />
                <span>+251 911 234 567</span>
              </div>
              <div className="flex items-center gap-3 text-earth-300">
                <Mail className="h-5 w-5 text-primary" />
                <span>hello@standard-house.com</span>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-earth-300 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-earth-300 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-earth-300 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-earth-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-earth-400 text-sm">
              © {new Date().getFullYear()} Standard House. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-earth-300 hover:bg-primary hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
