import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link href="">Terms & conditions</Link>
          </li>

          <li className="delimiter">|</li>

          <li>
            <Link href="">Cookie Policy</Link>
          </li>

          <li className="delimiter">|</li>

          <li>
            <Link href="https://www.hyve.com">Hyve &copy; {new Date().getFullYear()}</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
