"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const navItems: Option[] = [
    { value: "/users", label: "Users" },
    { value: "/companies", label: "Companies" },
    { value: "/buckets", label: "Buckets" },
  ];

  return (
    <ul>
      {navItems.map((i, key: number) => {
        return (
          <li key={key}>
            <p>
              <Link href={`${i.value}`} className={pathname?.indexOf(`${i.value}`) === 0 ? "active" : ""}>
                {i.label}
              </Link>
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default Navigation;
