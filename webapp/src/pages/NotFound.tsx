"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const pathname = usePathname();

  return (
    <main>
      <section>
        <div>
          <h1>404 Page</h1>
          <p>
            The page <span className="highlight">{pathname}</span> could not be found.
          </p>
          <p>
            <Link href={"/"}>Home</Link>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
