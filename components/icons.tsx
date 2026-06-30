import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 4.8 6v5.4c0 4.5 2.9 7.8 7.2 9.6 4.3-1.8 7.2-5.1 7.2-9.6V6L12 3Z" />
      <path d="m9.2 12 1.8 1.8 3.8-4" />
    </IconBase>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4" />
    </IconBase>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" />
    </IconBase>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c.3-4 2.3-6 6-6s5.7 2 6 6M16 5.5a3 3 0 0 1 0 5.7M16.5 14c2.7.4 4.2 2.3 4.5 5" />
    </IconBase>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.2 8.4a9.8 9.8 0 0 1 7.6 0M7 17.2c-1.5-.5-2.5-1.2-3.2-2.1.4-3.5 1.2-6.2 2.6-8.3A13 13 0 0 1 9 5.7l.7 1.4M17 17.2c1.5-.5 2.5-1.2 3.2-2.1-.4-3.5-1.2-6.2-2.6-8.3A13 13 0 0 0 15 5.7l-.7 1.4" />
      <path d="M9.5 16.5c.8.5 1.6.7 2.5.7s1.7-.2 2.5-.7" />
      <circle cx="9" cy="12" r=".7" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r=".7" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconBase>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 21h16M6 21V5h8v16M14 9h4v12M9 8h2M9 12h2M9 16h2" />
    </IconBase>
  );
}

export function MedicalIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.5 3h7l.8 3H20v5.5c0 4.4-3.1 8-8 9.5-4.9-1.5-8-5.1-8-9.5V6h3.7l.8-3Z" />
      <path d="M12 8v6M9 11h6" />
    </IconBase>
  );
}

export function BadgeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 2 2.4 2.5 3.5-.2.2 3.5 2.5 2.4-2.5 2.4-.2 3.5-3.5-.2L12 18.4l-2.4-2.5-3.5.2-.2-3.5-2.5-2.4 2.5-2.4.2-3.5 3.5.2L12 2Z" />
      <path d="m9.5 10.2 1.6 1.6 3.4-3.5" />
      <path d="m9 17-1 5 4-2 4 2-1-5" />
    </IconBase>
  );
}

export function ApplicationIcon({
  name,
  ...props
}: IconProps & { name: string }) {
  switch (name) {
    case "shield":
      return <ShieldIcon {...props} />;
    case "badge":
      return <BadgeIcon {...props} />;
    case "medical":
      return <MedicalIcon {...props} />;
    case "building":
      return <BuildingIcon {...props} />;
    default:
      return <ClipboardIcon {...props} />;
  }
}
