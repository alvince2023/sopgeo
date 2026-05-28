import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 font-semibold text-lg transition-opacity hover:opacity-90 ${className}`}
    >
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
        <span className="text-white font-bold text-sm">S</span>
      </div>
      <span className="text-gradient">SopGeo</span>
    </Link>
  );
}
