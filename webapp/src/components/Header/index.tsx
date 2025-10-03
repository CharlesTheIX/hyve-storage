import Link from "next/link";
import Image from "next/image";
import AdminHeaderOptions from "./AdminHeaderOptions";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <div className="logo-container">
          <Link href={"/dashboard"}>
            <Image width={30} height={35} alt="Hyve logo" src="/images/hyve-logo.svg" priority={true} />
            <p className="text-2xl text-white">Hyve Storage</p>
          </Link>
        </div>

        <div className="content-container">
          <ul>
            <li>
              <p>
                <Link href={"/users"} className="active">
                  Users
                </Link>
              </p>
            </li>

            <li>
              <p>
                <Link href={"/companies"}>Companies</Link>
              </p>
            </li>

            <li>
              <p>
                <Link href={"/buckets"}>Buckets</Link>
              </p>
            </li>
          </ul>

          <AdminHeaderOptions />
        </div>
      </nav>
    </header>
  );
};

export default Header;
