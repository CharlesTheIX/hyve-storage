import Image from "next/image";

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-center">
      <section className="w-full">
        <div className="flex flex-col gap-2 items-center gap-10">
          <div>
            <Image width={100} height={100} alt="Hyve logo" src="/images/hyve-logo.svg" priority={true} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
