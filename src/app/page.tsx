import { Header } from "./components/Header";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import "./home.css";

export default function Home({}) {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main className="flex flex-col">
        <About />
        <Services />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
