import { Treatment } from "@prisma/client";

type TreatmentTest = Omit<Treatment, "createdAt" | "updatedAt" | "video">;

export const treatments: TreatmentTest[] = [
  {
    id: "1",
    name: "Manicure hybrydowy",
    price: 100,
    duration: 120,
    description:
      "Manicure hybrydowy to trwała metoda stylizacji paznokci, która łączy estetykę i funkcjonalność. Dzięki zastosowaniu specjalnych lakierów hybrydowych, paznokcie zyskują piękny wygląd i długotrwały efekt.",
    images: ["/images/gallery/gal-1.jpg"],
  },
  {
    id: "2",
    name: "Uzupełnienie żelu",
    price: 80,
    duration: 120,
    description:
      "Uzupełnienie żelu to zabieg, który pozwala na odświeżenie i przedłużenie trwałości stylizacji paznokci żelowych. Dzięki niemu paznokcie zyskują nowy blask i estetyczny wygląd.",
    images: ["/images/gallery/gal-2.jpg"],
  },
  {
    id: "3",
    name: "Przedłużanie paznokci",
    description:
      "Przedłużanie paznokci to zabieg, który pozwala na uzyskanie dłuższych i bardziej efektownych paznokci. Dzięki zastosowaniu specjalnych technik i materiałów, paznokcie stają się mocniejsze i bardziej odporne na uszkodzenia.",
    price: 150,
    duration: 120,
    images: ["/images/gallery/gal-3.jpg"],
  },
  {
    id: "4",
    name: "Pedicure",
    price: 120,
    duration: 90,
    description:
      "Pedicure to zabieg pielęgnacyjny stóp, który obejmuje zarówno pielęgnację paznokci, jak i skóry stóp. Dzięki niemu stopy zyskują zdrowy wygląd i są wolne od zrogowaceń oraz innych niedoskonałości.",
    images: ["/images/gallery/gal-4.jpg"],
  },
  {
    id: "5",
    name: "Farbowanie i regulacja brwi",
    price: 70,
    duration: 30,
    description:
      "Farbowanie i regulacja brwi to zabieg, który pozwala na uzyskanie idealnego kształtu i koloru brwi. Dzięki niemu twarz zyskuje wyrazistość, a spojrzenie staje się bardziej intensywne.",
    images: ["/images/gallery/gal-5.jpg"],
  },
];
