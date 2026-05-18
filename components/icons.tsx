import type { CSSProperties, ReactNode } from "react";

type IconProps = {
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

function Svg({
  d,
  size = 16,
  stroke = 1.6,
  label,
  className,
  style,
}: IconProps & { d: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      style={{ display: "inline-block", verticalAlign: "-2px", ...style }}
    >
      {d}
    </svg>
  );
}

export const IconTerminal = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </>
    }
  />
);

export const IconCopy = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    }
  />
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p} d={<polyline points="4 12 10 18 20 6" />} />
);

export const IconArrow = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="9 7 17 7 17 15" />
      </>
    }
  />
);

export const IconExternal = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <path d="M14 4h6v6" />
        <line x1="20" y1="4" x2="11" y2="13" />
        <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
      </>
    }
  />
);

export const IconAlert = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <path d="M12 3 2 21h20Z" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <line x1="12" y1="17.5" x2="12" y2="17.5" />
      </>
    }
  />
);

export const IconCircleDot = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      </>
    }
  />
);

export const IconZap = (p: IconProps) => (
  <Svg
    {...p}
    d={<polygon points="13 2 4 14 11 14 11 22 20 10 13 10 13 2" />}
  />
);

export const IconGit = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <circle cx="6" cy="6" r="2.4" />
        <circle cx="6" cy="18" r="2.4" />
        <circle cx="18" cy="14" r="2.4" />
        <path d="M6 8.4v7.2" />
        <path d="M18 11.6V10a3 3 0 0 0-3-3H9.5" />
      </>
    }
  />
);

export const IconRailway = (p: IconProps) => (
  <Svg
    {...p}
    d={
      <>
        <rect x="5" y="3" width="14" height="14" rx="3" />
        <line x1="9" y1="9" x2="9" y2="11" />
        <line x1="15" y1="9" x2="15" y2="11" />
        <line x1="8" y1="21" x2="6" y2="23" />
        <line x1="16" y1="21" x2="18" y2="23" />
      </>
    }
  />
);
