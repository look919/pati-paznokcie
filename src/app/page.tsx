import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { AdminPopup } from "@/components/AdminPopup";
import "./home.css";

export default function Home() {
  return (
    <div className="relative font-sans min-h-screen">
      <Header />
      <main className="flex flex-col">
        <section id="about" className="about-section">
          <h1 className="sr-only">
            O stylistce Patrycji Kuczkowskiej - profesjonalna stylizacja
            paznokci
          </h1>
          <About />
        </section>
        <section id="services" className="services-section">
          <h2 className="sr-only">
            Nasze usługi stylizacji paznokci - manicure hybrydowy, żelowy i
            klasyczny
          </h2>
          <Services />
        </section>
        <section id="gallery" className="gallery-section">
          <h2 className="sr-only">
            Galeria prac - przykłady stylizacji paznokci
          </h2>
          <Gallery />
        </section>
        <section id="contact" className="contact-section">
          <h2 className="sr-only">
            Skontaktuj się z nami - umów wizytę na stylizację paznokci
          </h2>
          <Contact />
        </section>
      </main>
      <Footer />
      <AdminPopup />
    </div>
  );
}
