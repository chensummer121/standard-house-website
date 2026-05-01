"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Users, 
  Shield, 
  ArrowRight,
  Check,
  Target,
  Zap,
  Globe,
  Phone
} from "lucide-react";

export default function InvestmentPage() {
  const [calculatorInputs, setCalculatorInputs] = useState({
    investmentAmount: "450000000",
    years: "5",
  });

  const estimatedReturn = () => {
    const principal = parseInt(calculatorInputs.investmentAmount) || 0;
    const years = parseInt(calculatorInputs.years) || 5;
    // Assuming 18% annual appreciation for prefab homes
    const returnRate = 0.18;
    const total = principal * Math.pow(1 + returnRate, years);
    return total.toLocaleString("en-US");
  };

  return (
    <div className="pt-20 md:pt-24">
      {/* Header */}
      <section className="bg-gradient-to-r from-earth-800 to-sage-800 text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
              <TrendingUp className="h-4 w-4" />
              Investment Opportunities
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              PropTech Investment in<br />
              <span className="text-primary">Uganda's Housing Market</span>
            </h1>
            <p className="text-lg text-earth-200 mb-8">
              Join us in revolutionizing construction in East Africa. Founded in China 2012, with over 
              a decade of architectural expertise, Standard House brings prefabricated technology and 
              standardized models to Uganda's growing housing market.
            </p>
            <a href="#contact" className="btn-primary inline-flex items-center gap-2">
              Start Investing
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Company Background */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">Our Story</span>
              <h2 className="heading-2 mt-2 mb-6">From China to Uganda</h2>
              <div className="space-y-4 text-body">
                <p>
                  Founded in China in 2012, Standard House began as a small team of passionate architects 
                  dedicated to making quality housing accessible. With over a decade of experience in 
                  prefabricated construction, we've perfected our standardized building system.
                </p>
                <p>
                  Today, as STANDERRA HOUSING TECHNOLOGY LTD, we're bringing our proven PropTech model 
                  to Uganda — combining prefabricated construction with digital management systems to 
                  deliver homes faster, cheaper, and with guaranteed quality.
                </p>
                <p>
                  Our standardized model approach means predictable costs, consistent quality, and 
                  scalable growth — making us an ideal partner for real estate investment.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "2012", label: "Founded" },
                { value: "12+", label: "Years Experience" },
                { value: "500+", label: "Homes Built" },
                { value: "100%", label: "Transparent Pricing" },
              ].map((stat) => (
                <div key={stat.label} className="bg-earth-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-earth-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Highlights */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-medium">Why Invest</span>
            <h2 className="heading-2 mt-2 mb-4">Standardized, Scalable, Profitable</h2>
            <p className="text-body">
              Our PropTech model transforms construction into a replicable, scalable business — 
              with transparent pricing and predictable returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Standardized Models",
                description: "Proven floor plans, BOM packages, and construction timelines. Replicate success across projects."
              },
              {
                icon: DollarSign,
                title: "18% ROI Potential",
                description: "Consistent returns through prefabricated cost savings and Uganda's growing housing demand."
              },
              {
                icon: Zap,
                title: "Fast Turnkey Delivery",
                description: "45-day delivery on standard models. Generate rental income faster with completed properties."
              },
              {
                icon: Globe,
                title: "PropTech Advantage",
                description: "Digital-first approach to construction management. Real-time tracking, transparent costs."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-earth-200 flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-earth-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-earth-800 mb-2">{item.title}</h3>
                  <p className="text-earth-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">Investment Calculator</span>
              <h2 className="heading-2 mt-2 mb-6">Estimate Your Returns</h2>
              <p className="text-body mb-8">
                Calculate potential returns on your real estate investment. Our standardized model 
                approach ensures predictable appreciation.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Investment Amount (UGX)
                  </label>
                  <input
                    type="text"
                    value={calculatorInputs.investmentAmount}
                    onChange={(e) => setCalculatorInputs((prev) => ({ 
                      ...prev, 
                      investmentAmount: e.target.value 
                    }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Investment Period (Years)
                  </label>
                  <select
                    value={calculatorInputs.years}
                    onChange={(e) => setCalculatorInputs((prev) => ({ 
                      ...prev, 
                      years: e.target.value 
                    }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="1">1 Year</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="10">10 Years</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 p-6 bg-sage-50 rounded-xl border border-sage-200">
                <p className="text-sm text-earth-500 mb-2">Estimated Value After {calculatorInputs.years} Years</p>
                <p className="text-4xl font-bold text-primary">UGX {estimatedReturn()}</p>
                <p className="text-sm text-sage-600 mt-2">
                  +{(parseInt(calculatorInputs.investmentAmount) * 0.18 * parseInt(calculatorInputs.years)).toLocaleString("en-US")} gain
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-earth-700 to-sage-800 rounded-3xl p-8 md:p-12 text-white">
              <h3 className="text-2xl font-display font-bold mb-6">Investment Packages</h3>
              
              {[
                {
                  name: "Individual Home",
                  minInvestment: "200,000,000",
                  returns: "15-18%",
                  features: ["1 residential property", "Standard BOM package", "Property management", "Annual reports"]
                },
                {
                  name: "Multi-Unit Project",
                  minInvestment: "500,000,000",
                  returns: "18-22%",
                  popular: true,
                  features: ["2-4 residential units", "Bulk BOM pricing", "Dedicated manager", "Quarterly reports"]
                },
                {
                  name: "Development Partner",
                  minInvestment: "1,500,000,000",
                  returns: "22%+",
                  features: ["5+ unit development", "Custom configuration", "Equity partnership", "Strategic advisory"]
                }
              ].map((pkg) => (
                <div 
                  key={pkg.name}
                  className={`p-6 rounded-xl mb-4 ${pkg.popular ? "bg-white/20" : "bg-white/10"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">{pkg.name}</span>
                    <span className="text-primary font-bold">{pkg.returns} APY</span>
                  </div>
                  <p className="text-sm text-earth-200 mb-3">
                    Min. Investment: UGX {pkg.minInvestment}
                  </p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-earth-200">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Start Your Investment Journey</h2>
              <p className="text-body">
                Fill out the form below or contact us directly. Our investment team will respond within 24 hours.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-earth-200">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-earth-800">Direct Contact</p>
                  <p className="text-earth-600">+256 766 969 867 (WhatsApp)</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+256 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Investment Interest
                    </label>
                    <select className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>Individual Home Purchase</option>
                      <option>Multi-Unit Project</option>
                      <option>Development Partnership</option>
                      <option>Other Investment Inquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Investment Budget
                  </label>
                  <select className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>UGX 100M - 300M</option>
                    <option>UGX 300M - 500M</option>
                    <option>UGX 500M - 1B</option>
                    <option>UGX 1B+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your investment goals..."
                  />
                </div>
                <div className="mt-8 text-center">
                  <button type="submit" className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4">
                    Submit Investment Inquiry
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
