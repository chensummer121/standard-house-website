"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Users, 
  Shield, 
  ArrowRight,
  Calculator,
  Check
} from "lucide-react";

export default function InvestmentPage() {
  const [calculatorInputs, setCalculatorInputs] = useState({
    investmentAmount: "10000000",
    years: "5",
  });

  const estimatedReturn = () => {
    const principal = parseInt(calculatorInputs.investmentAmount) || 0;
    const years = parseInt(calculatorInputs.years) || 5;
    // Assuming 15% annual appreciation
    const returnRate = 0.15;
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
              Build Wealth Through<br />
              <span className="text-primary">African Real Estate</span>
            </h1>
            <p className="text-lg text-earth-200 mb-8">
              Join the fastest-growing property market in Africa. Our proven track record 
              and transparent investment model deliver consistent returns.
            </p>
            <a href="#contact" className="btn-primary inline-flex items-center gap-2">
              Start Investing
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Why Invest With Us</h2>
            <p className="text-body">
              We combine deep local expertise with international standards to deliver 
              real estate investments that perform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "15% Avg. Returns",
                description: "Consistent annual appreciation on our property portfolio over the past 5 years."
              },
              {
                icon: Shield,
                title: "Secure Investment",
                description: "Legal ownership, transparent contracts, and full property documentation."
              },
              {
                icon: Building2,
                title: "Turnkey Solutions",
                description: "We handle everything from land purchase to construction and management."
              },
              {
                icon: Users,
                title: "Expert Management",
                description: "Professional property management included. Generate rental income from day one."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center p-6">
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
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">Investment Calculator</span>
              <h2 className="heading-2 mt-2 mb-6">Estimate Your Returns</h2>
              <p className="text-body mb-8">
                Get a quick projection of your potential returns. Our calculator uses 
                historical data and current market conditions.
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

              <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                <p className="text-sm text-earth-500 mb-2">Estimated Value After {calculatorInputs.years} Years</p>
                <p className="text-4xl font-bold text-primary">UGX {estimatedReturn()}</p>
                <p className="text-sm text-sage-600 mt-2">
                  +{(parseInt(calculatorInputs.investmentAmount) * 0.15 * parseInt(calculatorInputs.years)).toLocaleString("en-US")} gain
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-earth-700 to-sage-800 rounded-3xl p-8 md:p-12 text-white">
              <h3 className="text-2xl font-display font-bold mb-6">Investment Packages</h3>
              
              {[
                {
                  name: "Starter",
                  minInvestment: "1,800,000,000",
                  returns: "12%",
                  features: ["1-2 properties", "Standard management", "Quarterly reports"]
                },
                {
                  name: "Growth",
                  minInvestment: "5,500,000,000",
                  returns: "15%",
                  popular: true,
                  features: ["3-5 properties", "Premium management", "Monthly reports", "Priority support"]
                },
                {
                  name: "Premium",
                  minInvestment: "18,500,000,000",
                  returns: "18%",
                  features: ["5+ properties", "Full-service management", "Weekly reports", "Dedicated advisor"]
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
      <section id="contact" className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Start Your Investment Journey</h2>
              <p className="text-body">
                Fill out the form below and our investment team will contact you within 24 hours.
              </p>
            </div>

            <form className="bg-white rounded-2xl shadow-lg p-8">
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
                    Investment Budget
                  </label>
                  <select className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Under 5 Million</option>
                    <option>5-15 Million</option>
                    <option>15-50 Million</option>
                    <option>50+ Million</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your investment goals..."
                  />
                </div>
              </div>
              <div className="mt-8 text-center">
                <button type="submit" className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4">
                  Submit Inquiry
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
