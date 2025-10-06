import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <div className="logo-container">
          <Link href={"/"}>
            <Image width={30} height={35} alt="Hyve logo" src="/images/hyve-logo.svg" priority={true} />
            <p className="text-2xl text-white">Hyve Storage</p>
          </Link>
        </div>

        <div className="content-container">
          <Navigation />
        </div>
      </nav>
    </header>
  );
};

export default Header;
