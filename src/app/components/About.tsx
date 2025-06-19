"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const aboutImgStyles =
    "border-8 border-slate-300 rounded-sm shadow-lg overflow-hidden transform hover:scale-110 hover:z-20 hover:outline-sky-400 hover:outline-offset-8 transition-all duration-200";

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.25,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <section className="py-12 md:py-24 px-6 bg-gray-100" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl font-light text-gray-700 mb-10 md:mb-20 uppercase tracking-wide"
        >
          <span className="inline-block border-b-2 border-sky-400 pb-2">
            O mnie
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <motion.h3
              custom={0}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
              className="text-xl font-bold text-gray-700 uppercase mb-4"
            >
              Profesjonalne podejście
            </motion.h3>
            <motion.p
              custom={1}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
              className="text-gray-600 mb-8"
            >
              Moja pasja do stylizacji paznokci zaczęła się wiele lat temu.
              Dzięki nieustannemu doskonaleniu swoich umiejętności, mogę dziś
              zaoferować usługi na najwyższym poziomie, spełniające oczekiwania
              najbardziej wymagających klientek.
            </motion.p>

            <motion.h3
              custom={2}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
              className="text-xl font-bold text-gray-700 uppercase mb-4"
            >
              Najwyższa jakość usług
            </motion.h3>
            <motion.p
              custom={3}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
              className="text-gray-600"
            >
              W mojej pracy korzystam wyłącznie z produktów najwyższej jakości.
              Bezpieczeństwo i zadowolenie klientek są dla mnie priorytetem,
              dlatego nieustannie śledzę najnowsze trendy i techniki w branży
              stylizacji paznokci.
            </motion.p>
          </div>

          <div className="relative">
            <div className="composition relative h-96">
              <motion.div
                custom={0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={imageVariants}
                className={cn(
                  "absolute w-60 h-40 top-0 left-0 z-10",
                  aboutImgStyles
                )}
              >
                <Image
                  src="/images/about-1.jpg"
                  alt="Photo 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 240px, 240px"
                  quality={80}
                />
              </motion.div>
              <motion.div
                custom={1}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={imageVariants}
                className={cn(
                  "hidden  md:block absolute w-60 h-40 top-12 right-0 z-10",
                  aboutImgStyles
                )}
              >
                <Image
                  src="/images/about-2.jpg"
                  alt="Photo 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 240px, 240px"
                  quality={80}
                />
              </motion.div>
              <motion.div
                custom={2}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={imageVariants}
                className={cn(
                  "absolute w-60 h-40 bottom-0 left-1/4 z-10",
                  aboutImgStyles
                )}
              >
                <Image
                  src="/images/about-3.jpg"
                  alt="Photo 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 240px, 240px"
                  quality={80}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
