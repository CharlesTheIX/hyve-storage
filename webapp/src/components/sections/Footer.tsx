import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="py-20">
      <div>
        <Link href="https://www.hyve.com" className="copyright">
          Hyve &copy; {new Date().getFullYear()}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
