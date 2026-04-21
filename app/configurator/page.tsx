"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Home, 
  Palette, 
  LayoutGrid, 
  DollarSign, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Select House", icon: Home },
  { id: 2, name: "Customize", icon: Palette },
  { id: 3, name: "Features", icon: LayoutGrid },
  { id: 4, name: "Budget", icon: DollarSign },
  { id: 5, name: "Review", icon: FileText },
];

const houseOptions = [
  {
    id: "1",
    name: "Savanna Villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    price: "ETB 4.5M",
  },
  {
    id: "2",
    name: "Acacia Family Home",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    price: "ETB 2.8M",
  },
  {
    id: "3",
    name: "Marula Compact",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    price: "ETB 1.5M",
  },
];

const customizationOptions = {
  style: ["Modern African", "Traditional", "Contemporary", "Minimalist"],
  roof: ["Gable", "Hip", "Flat", "Shed"],
  finishes: ["Standard", "Premium", "Luxury"],
};

const featureOptions = [
  { id: "garage", name: "Garage", price: "ETB 350K" },
  { id: "pool", name: "Swimming Pool", price: "ETB 800K" },
  { id: "garden", name: "Landscaped Garden", price: "ETB 200K" },
  { id: "solar", name: "Solar Panel System", price: "ETB 450K" },
  { id: "smart", name: "Smart Home System", price: "ETB 300K" },
  { id: "terrace", name: "Rooftop Terrace", price: "ETB 400K" },
];

export default function ConfiguratorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [customizations, setCustomizations] = useState({
    style: "",
    roof: "",
    finishes: "",
  });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleFeatureToggle = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedHouse;
      case 2:
        return customizations.style && customizations.roof && customizations.finishes;
      default:
        return true;
    }
  };

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-earth-50">
      {/* Header */}
      <section className="bg-earth-800 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Home Configurator
          </h1>
          <p className="text-earth-200 max-w-2xl">
            Design your perfect home in 5 simple steps. Customize every detail 
            to match your vision and budget.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-white border-b border-earth-200 sticky top-16 md:top-20 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        isCompleted
                          ? "bg-sage-600 text-white"
                          : isActive
                          ? "bg-primary text-white"
                          : "bg-earth-100 text-earth-400"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 font-medium hidden md:block",
                        isActive ? "text-primary" : "text-earth-500"
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-12 md:w-20 h-0.5 mx-2",
                        currentStep > step.id ? "bg-sage-600" : "bg-earth-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Select House */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-6">
                  Select Your Base Design
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {houseOptions.map((house) => (
                    <button
                      key={house.id}
                      onClick={() => setSelectedHouse(house.id)}
                      className={cn(
                        "text-left rounded-2xl overflow-hidden transition-all",
                        selectedHouse === house.id
                          ? "ring-4 ring-primary shadow-lg scale-[1.02]"
                          : "shadow-md hover:shadow-lg"
                      )}
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={house.image}
                          alt={house.name}
                          fill
                          className="object-cover"
                        />
                        {selectedHouse === house.id && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-semibold text-earth-800">{house.name}</h3>
                        <p className="text-sm text-earth-600 mt-1">
                          {house.bedrooms} Beds • {house.bathrooms} Baths • {house.area}m²
                        </p>
                        <p className="text-primary font-bold mt-2">{house.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Customize */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-6">
                  Customize Your Style
                </h2>
                <div className="space-y-8">
                  {Object.entries(customizationOptions).map(([key, options]) => (
                    <div key={key}>
                      <h3 className="text-lg font-semibold text-earth-700 mb-3 capitalize">
                        {key === "finishes" ? "Interior Finishes" : key}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {options.map((option) => (
                          <button
                            key={option}
                            onClick={() =>
                              setCustomizations((prev) => ({ ...prev, [key]: option }))
                            }
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all text-center",
                              customizations[key as keyof typeof customizations] === option
                                ? "border-primary bg-primary/5"
                                : "border-earth-200 hover:border-earth-400"
                            )}
                          >
                            <span className="font-medium">{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-6">
                  Add Premium Features
                </h2>
                <p className="text-earth-600 mb-8">
                  Enhance your home with these optional features (optional)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                        selectedFeatures.includes(feature.id)
                          ? "border-primary bg-primary/5"
                          : "border-earth-200 hover:border-earth-400"
                      )}
                    >
                      <span className="font-medium">{feature.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-earth-500">{feature.price}</span>
                        <div
                          className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center",
                            selectedFeatures.includes(feature.id)
                              ? "bg-primary text-white"
                              : "bg-earth-100"
                          )}
                        >
                          {selectedFeatures.includes(feature.id) && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Budget */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-6">
                  Set Your Budget
                </h2>
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Total Budget (ETB)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5,000,000"
                        className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Payment Timeline
                      </label>
                      <select className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option>Full Payment</option>
                        <option>12 Months Installment</option>
                        <option>24 Months Installment</option>
                        <option>36 Months Installment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">
                        Financing Preference
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="financing" className="accent-primary" />
                          <span>Bank Loan</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="financing" className="accent-primary" />
                          <span>In-house Financing</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="financing" className="accent-primary" />
                          <span>Self-funded</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-6">
                  Review Your Configuration
                </h2>
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 pb-6 border-b border-earth-200">
                      <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                        <Image
                          src={houseOptions.find((h) => h.id === selectedHouse)?.image || ""}
                          alt="Selected house"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {houseOptions.find((h) => h.id === selectedHouse)?.name}
                        </h3>
                        <p className="text-earth-600">
                          {houseOptions.find((h) => h.id === selectedHouse)?.price}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-earth-500">Style</p>
                        <p className="font-medium">{customizations.style}</p>
                      </div>
                      <div>
                        <p className="text-sm text-earth-500">Roof Type</p>
                        <p className="font-medium">{customizations.roof}</p>
                      </div>
                      <div>
                        <p className="text-sm text-earth-500">Finishes</p>
                        <p className="font-medium">{customizations.finishes}</p>
                      </div>
                      <div>
                        <p className="text-sm text-earth-500">Features</p>
                        <p className="font-medium">
                          {selectedFeatures.length > 0
                            ? selectedFeatures.length + " selected"
                            : "None"}
                        </p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-earth-200">
                      <p className="text-sm text-earth-500">Estimated Total</p>
                      <p className="text-3xl font-bold text-primary">ETB 5.5M</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-8 border-t border-earth-200">
              <button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                  currentStep === 1
                    ? "text-earth-300 cursor-not-allowed"
                    : "text-earth-700 hover:bg-earth-100"
                )}
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                    canProceed()
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-earth-200 text-earth-400 cursor-not-allowed"
                  )}
                >
                  Next Step
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                  Submit Configuration
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
