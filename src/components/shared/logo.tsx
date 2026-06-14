import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
  /** Show icon only (for collapsed sidebar) */
  iconOnly?: boolean;
}

export function Logo({ className = "", href = "/", iconOnly = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Inline SVG Icon — matches /public/logo-icon.svg */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        fill="none"
        className="h-8 w-8 shrink-0"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5C7CFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="9" fill="url(#logoGrad)" />
        <circle cx="17" cy="17" r="8" stroke="white" strokeWidth="2.2" fill="none" opacity="0.95" />
        <line x1="23" y1="23" x2="31" y2="31" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
        <circle cx="25" cy="28" r="1.2" fill="white" opacity="0.45" />
        <circle cx="29.5" cy="28" r="1.2" fill="white" opacity="0.45" />
        <circle cx="25" cy="32.5" r="1.2" fill="white" opacity="0.45" />
        <circle cx="29.5" cy="32.5" r="1.2" fill="white" opacity="0.45" />
      </svg>

      {!iconOnly && (
        <span
          className="text-lg font-bold tracking-tight text-white"
          style={{ fontFamily: "'Inter', 'Geist', system-ui, sans-serif" }}
        >
          Sop<span style={{ color: "#5C7CFA" }}>Geo</span>
        </span>
      )}
    </Link>
  );
}
