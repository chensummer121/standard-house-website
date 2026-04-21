import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  completedDate: string;
  status: "completed" | "in-progress";
  className?: string;
}

export default function ProjectCard({
  title,
  location,
  image,
  completedDate,
  status,
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              status === "completed"
                ? "bg-sage-600 text-white"
                : "bg-terracotta-500 text-white"
            )}
          >
            {status === "completed" ? "Completed" : "In Progress"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold text-earth-800 mb-3">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-earth-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{completedDate}</span>
          </div>
        </div>

        <Link
          href={`/projects/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-earth-700 transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
