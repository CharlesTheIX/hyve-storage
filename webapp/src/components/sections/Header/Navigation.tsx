"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import ClearStorageButton from "@/components/buttons/ClearStorageButton";

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const nav_items: Option[] = [
    { value: "/users", label: "Users" },
    { value: "/companies", label: "Companies" },
    { value: "/buckets", label: "Buckets" },
  ];

  return (
    <ul>
      {nav_items.map((i, key: number) => {
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

      <PermissionsWrapper permission_level={9}>
        <li>
          <ClearStorageButton />
        </li>
      </PermissionsWrapper>
    </ul>
  );
};

export default Navigation;
