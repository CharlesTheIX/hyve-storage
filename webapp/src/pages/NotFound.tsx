"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const pathname = usePathname();

  return (
    <main>
      <section>
        <div className="flex flex-col gap-2 items-start">
          <h1>404 Page</h1>

          <p>
            The page <span className="highlight">{pathname}</span> could not be found.
          </p>

          <Link href={"/"} className="hyve-button">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
