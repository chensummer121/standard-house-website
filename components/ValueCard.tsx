import { LucideIcon } from "lucide-react";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-earth-100">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-earth-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="h-7 w-7 text-earth-700" />
      </div>
      <h3 className="text-xl font-display font-semibold text-earth-800 mb-3">
        {title}
      </h3>
      <p className="text-earth-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
