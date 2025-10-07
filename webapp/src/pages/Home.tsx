import Hyve from "@/components/svgs/Hyve";

const HomePage: React.FC = () => {
  return (
    <main style={{ justifyContent: "center" }}>
      <section>
        <div className="flex flex-col items-center">
          <Hyve />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
