import Image from "next/image";

const HomePage: React.FC = () => {
  return (
    <main style={{ justifyContent: "center" }}>
      <section>
        <div className="flex flex-col items-center">
          <Image width={100} height={100} alt="Hyve logo" src="/images/hyve-logo.svg" priority={true} />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
