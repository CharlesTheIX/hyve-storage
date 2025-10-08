import Link from "next/link";
import Navigation from "./Navigation";
import Hyve from "@/components/svgs/Hyve";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <div className="logo-container">
          <Link href={"/"}>
            <Hyve size={50} />
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
