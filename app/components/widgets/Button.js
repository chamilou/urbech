"use client";
import { usePathname } from "next/navigation";

export default function ButtonLink({
  href,
  children,
  className = "",
  ...props
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const combinedClassName = `${styles.link} ${
    isActive ? styles.active : ""
  } ${className}`.trim();

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
}
