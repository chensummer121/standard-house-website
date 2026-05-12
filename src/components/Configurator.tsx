import { useState } from "react";
import { cn } from "../lib/utils";

const steps = [
  { id: 1, name: "Select Model", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: 2, name: "Customize", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { id: 3, name: "Features", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { id: 4, name: "BOM Quote", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: 5, name: "Review", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

const modelOptions = [
  {
    id: "model-a",
    name: "Model A - Economy",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    bedrooms: 2,
    bathrooms: 1,
    area: "65-80",
    structure: "Prefabricated Steel",
    timeline: "30 Days",
    price: "UGX 200M",
    badge: "Economy",
    description: "Efficient single-story layout. Perfect for first-time homeowners.",
  },
  {
    id: "model-b",
    name: "Model B - Standard",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    bedrooms: 3,
    bathrooms: 2,
    area: "120-150",
    structure: "Standard BOM",
    timeline: "45 Days",
    price: "UGX 450M",
    badge: "Popular",
    description: "Our most popular family home. Complete BOM package included.",
  },
  {
    id: "model-c",
    name: "Model C - Premium",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    bedrooms: 4,
    bathrooms: 3,
    area: "200-400",
    structure: "Modular Custom",
    timeline: "Custom",
    price: "Custom",
    badge: "Premium",
    description: "Fully customizable villa design. Modular expansion ready.",
  },
];

const customizationOptions = {
  roof: ["Gable", "Hip", "Flat"],
  finishes: ["Standard BOM", "Premium Package", "Luxury Finish"],
  exterior: ["Standard Cladding", "Premium Cladding", "Custom Design"],
};

const optionalAddons = [
  { id: "solar", name: "Solar Panel System", price: "UGX 85M" },
  { id: "smart", name: "Smart Home System", price: "UGX 55M" },
  { id: "garage", name: "Garage Addition", price: "UGX 65M" },
  { id: "terrace", name: "Rooftop Terrace", price: "UGX 75M" },
];

const bomFeatures = [
  { id: "foundation", name: "Foundation Materials", description: "Complete concrete & steel foundation package", included: true },
  { id: "structure", name: "Steel Structure", description: "Prefabricated steel frame & connections", included: true },
  { id: "roofing", name: "Roofing System", description: "Roof sheets, insulation & rain gutters", included: true },
  { id: "electrical", name: "Electrical System", description: "Wiring, switches, distribution board", included: true },
  { id: "plumbing", name: "Plumbing System", description: "Pipes, fittings, fixtures", included: true },
  { id: "finishing", name: "Interior Finishing", description: "Paint, flooring, doors, windows", included: "optional" },
  { id: "exterior", name: "Exterior Finishing", description: "Cladding, landscaping prep", included: "optional" },
];

export default function Configurator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [customizations, setCustomizations] = useState({ roof: "", finishes: "", exterior: "" });
  const [optionalFeatures, setOptionalFeatures] = useState<string[]>([]);

  const handleFeatureToggle = (id: string) => {
    setOptionalFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedModel;
      case 2:
        return customizations.roof && customizations.finishes && customizations.exterior;
      default:
        return true;
    }
  };

  const getSelectedModel = () => modelOptions.find((m) => m.id === selectedModel);

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Progress Steps */}
      <section className="bg-white border-b border-earth-200 sticky top-16 md:top-20 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
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
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                        </svg>
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
            {/* Step 1: Select Model */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-2">
                  Choose Your Base Model
                </h2>
                <p className="text-earth-600 mb-6">
                  Select one of our standard prefabricated models as your starting point.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {modelOptions.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={cn(
                        "text-left rounded-2xl overflow-hidden transition-all",
                        selectedModel === model.id
                          ? "ring-4 ring-primary shadow-lg scale-[1.02]"
                          : "shadow-md hover:shadow-lg"
                      )}
                    >
                      <div className="relative aspect-[4/3]">
                        <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                        {selectedModel === model.id && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">{model.badge}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-semibold text-earth-800">{model.name}</h3>
                        <p className="text-sm text-earth-500 mt-1">{model.bedrooms} beds · {model.bathrooms} baths · {model.area}m²</p>
                        <p className="text-lg font-bold text-primary mt-2">{model.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Customize */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-2">
                  Customize Your Home
                </h2>
                <p className="text-earth-600 mb-8">
                  Personalize your selection with these customization options.
                </p>
                <div className="space-y-8">
                  {Object.entries(customizationOptions).map(([key, options]) => (
                    <div key={key}>
                      <h3 className="text-lg font-semibold text-earth-700 mb-3 capitalize">
                        {key === "exterior" ? "Exterior Design" : key}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {options.map((option) => (
                          <button
                            key={option}
                            onClick={() => setCustomizations((prev) => ({ ...prev, [key]: option }))}
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
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-2">
                  BOM Add-ons & Upgrades
                </h2>
                <p className="text-earth-600 mb-8">
                  Enhance your package with optional upgrades. All items come with precise pricing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optionalAddons.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                        optionalFeatures.includes(feature.id)
                          ? "border-primary bg-primary/5"
                          : "border-earth-200 hover:border-earth-400"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center",
                            optionalFeatures.includes(feature.id)
                              ? "bg-primary text-white"
                              : "bg-earth-100"
                          )}
                        >
                          {optionalFeatures.includes(feature.id) && (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <span className="text-primary font-medium">{feature.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: BOM Quote */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-bold text-earth-800 mb-2">
                  BOM Precise Quote
                </h2>
                <p className="text-earth-600 mb-8">
                  100% Transparent Pricing — Every bolt, every beam accounted for.
                </p>
                
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Included in Base Package</h3>
                    <svg className="h-6 w-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    {bomFeatures.filter(f => f.included === true).map((feature) => (
                      <div key={feature.id} className="flex items-start gap-3 p-3 bg-earth-50 rounded-lg">
                        <svg className="h-5 w-5 text-sage-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <span className="font-medium text-earth-800">{feature.name}</span>
                          <p className="text-sm text-earth-500">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold">Price Summary</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Model ({getSelectedModel()?.name})</span>
                      <span className="font-medium">{getSelectedModel()?.price}</span>
                    </div>
                    <div className="flex justify-between text-earth-500">
                      <span>Configuration Upgrade</span>
                      <span>Included</span>
                    </div>
                    {optionalFeatures.length > 0 && (
                      <div className="flex justify-between text-earth-500">
                        <span>Optional Add-ons</span>
                        <span>Based on selection</span>
                      </div>
                    )}
                    <div className="pt-2 mt-2 border-t border-earth-200">
                      <div className="flex justify-between text-xl font-bold text-primary">
                        <span>Total BOM Estimate</span>
                        <span>UGX {getSelectedModel()?.price}</span>
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
                      <div className="w-32 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                        <img src={getSelectedModel()?.image} alt="Selected model" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{getSelectedModel()?.name}</h3>
                        <p className="text-earth-600">
                          {getSelectedModel()?.bedrooms} Beds · {getSelectedModel()?.bathrooms} Baths · {getSelectedModel()?.area}m²
                        </p>
                        <p className="text-sm text-earth-500 mt-1">
                          Delivery: {getSelectedModel()?.timeline}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-earth-500">Roof Type</p>
                        <p className="font-medium">{customizations.roof || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-earth-500">Finishes</p>
                        <p className="font-medium">{customizations.finishes || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-earth-500">Exterior</p>
                        <p className="font-medium">{customizations.exterior || "-"}</p>
                      </div>
                    </div>

                    {optionalFeatures.length > 0 && (
                      <div>
                        <p className="text-sm text-earth-500">Selected Add-ons</p>
                        <p className="font-medium">{optionalFeatures.length} upgrades selected</p>
                      </div>
                    )}

                    <div className="pt-6 border-t border-earth-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-earth-500">BOM Quote</p>
                          <p className="text-3xl font-bold text-primary">{getSelectedModel()?.price}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sage-600">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          <span>Guaranteed {getSelectedModel()?.timeline} delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-sage-50 rounded-xl border border-sage-200">
                  <h3 className="font-semibold text-earth-800 mb-2">What's Next?</h3>
                  <p className="text-earth-600 text-sm">
                    Submit your configuration and our team will contact you within 24 hours to 
                    discuss your project details and schedule a site visit.
                  </p>
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
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
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
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <a href="/about#contact" className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                  Contact Us to Proceed
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
