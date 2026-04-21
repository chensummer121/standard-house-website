import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HouseCardProps {
  id: string;
  name: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price?: string;
  badge?: string;
  className?: string;
}

export default function HouseCard({
  name,
  image,
  bedrooms,
  bathrooms,
  area,
  price,
  badge,
  className,
}: HouseCardProps) {
  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-display font-semibold text-earth-800 mb-3">
          {name}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-earth-600 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{area} m²</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-earth-100">
          {price && (
            <span className="text-lg font-bold text-primary">{price}</span>
          )}
          <Link
            href="/configurator"
            className="ml-auto flex items-center gap-1 text-sm font-medium text-earth-700 hover:text-primary transition-colors"
          >
            Configure
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
