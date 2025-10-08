import Link from "next/link";
import { Metadata } from "next";
import { headers } from "next/headers";
import { default_metadata, site_name } from "@/globals";

export const metadata: Metadata = {
  ...default_metadata,
  description: "Page not found",
  title: `Not found - 404 | ${site_name}`,
  robots: {
    index: false,
    follow: false,
  },
};

const Page: React.FC = async () => {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const referer = headersList.get("referer") || "";
  const pathname = referer.split(host)[1] || "";
  return (
    <main>
      <section>
        <div className="flex flex-col gap-4 items-start">
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
export default Page;
