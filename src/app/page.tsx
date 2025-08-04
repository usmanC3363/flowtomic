import { ContainerScroll } from "../components/global/container-scroll-animation";
import Navbar from "../components/global/navbar";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <section className="relative flex h-screen w-full flex-col items-center !overflow-visible rounded-md bg-neutral-950 antialiased">
        {/* RADIAL GRADIENT */}
        <div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
        <div className="mt-[-100px] flex flex-col md:mt-[-50px]">
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center">
                <Button
                  size={"lg"}
                  className="group mb-8 flex w-full items-center justify-center gap-4 rounded-full border-t-2 border-[#4D4D4D] bg-[#1F1F1F] p-8 text-2xl transition-all duration-300 ease-linear hover:bg-white hover:shadow-lg hover:shadow-neutral-500 sm:w-fit md:mb-0"
                >
                  <span className="goup-hover:to-black bg-gradient-to-r from-neutral-500 to-neutral-600 bg-clip-text font-sans text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 md:text-center">
                    Start For Free Today
                  </span>
                </Button>
                <h1 className="bg-gradient-to-b from-white to-neutral-600 bg-clip-text font-sans text-5xl font-bold text-transparent md:text-8xl">
                  Automate Your Work With Flowtomic
                </h1>
              </div>
            }
          />
        </div>
      </section>
    </main>
  );
}
