"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <header className="relative h-[95vh] bg-gradient-to-r from-sky-400 to-blue-500 clip-polygon-hero">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/images/logo-transparent.png"
          alt="Patrycja Kuczkowska Logo"
          width={200}
          height={100}
          className="hidden md:block absolute top-8 left-1/2 translate-x-[-50%] h-[100px] w-auto object-contain"
        />
      </motion.div>
      <div className="absolute top-2/5 md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white flex flex-col items-center">
        <h1 className="uppercase">
          <motion.span
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              ease: [0.215, 0.61, 0.355, 1],
              delay: 0.2,
            }}
            className="block text-4xl md:text-7xl font-light tracking-widest mb-6"
          >
            Patrycja Kuczkowska
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              ease: [0.215, 0.61, 0.355, 1],
              delay: 0.4,
            }}
            className="block text-lg md:text-xl font-bold md:tracking-[1.75rem]"
          >
            Stylizacja paznokci
          </motion.span>
        </h1>
        <motion.span
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg font-light mt-8 "
        >
          ul. Wiosenna 12, 77-100 Bytów
        </motion.span>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row md:gap-4 text-lg font-light"
        >
          <span>{`tel. ${process.env.NEXT_PUBLIC_TELEPHONE_NUMBER}`}</span>
          <span>{`email: ${process.env.NEXT_PUBLIC_EMAIL}`}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.2,
            ease: "easeOut",
          }}
        >
          <Link
            href={"/zgloszenie"}
            className="inline-block mt-12 py-4 px-10 rounded-full bg-white text-blue-500 text-lg uppercase tracking-wide 
                      transition-all duration-200 shadow-lg 
                      hover:-translate-y-1 hover:shadow-xl hover:bg-opacity-90
                      active:translate-y-px active:shadow-md"
          >
            Zarezerwuj wizytę online
          </Link>
        </motion.div>
      </div>
    </header>
  );
};
