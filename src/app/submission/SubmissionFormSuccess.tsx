"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const SubmissionFormSuccess = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col h-full justify-between"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-white/90" />
        </div>
        <h3 className="text-2xl font-semibold mt-4 text-white">
          Rezerwacja przyjęta!
        </h3>
        <p className="text-white/80 mt-2">
          Dziękujemy za wybór naszego salonu. Twoja rezerwacja została przyjęta!
        </p>
      </motion.div>

      <div className="bg-white/20 rounded-lg p-6 mb-6">
        <h4 className="font-medium text-lg mb-4 text-white">Co dalej?</h4>

        <ul className="space-y-4 text-white/90">
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <Mail className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm md:text-base">
              Sprawdzimy Twoje dane i potwierdzimy rezerwację. Upewnimy się że
              twoja rezerwacja nie koliduje z innymi. Otrzymasz maila z
              potwierdzeniem terminu lub propozycją innego terminu, jeśli ten
              będzie już zajęty.
            </p>
          </motion.li>

          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <Phone className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm md:text-base">
              Jeśli masz jakiekolwiek pytania lub chcesz zmienić termin, prosimy
              o kontakt telefoniczny pod numerem:{" "}
              <span className="font-medium text-white">
                {process.env.NEXT_PUBLIC_TELEPHONE_NUMBER || "+48 123 456 789"}
              </span>
            </p>
          </motion.li>
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-auto text-center"
      >
        <p className="text-white/80 mb-4 text-sm md:text-base">
          Dziękujemy za zaufanie i do zobaczenia wkrótce!
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            asChild
            variant="outline"
            className="bg-white/20 border-white/40 hover:bg-white/30 text-white"
          >
            <Link href="/">Wróć do strony głównej</Link>
          </Button>

          <Button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-600 hover:bg-white/90 transition-all duration-300"
          >
            Umów kolejną wizytę
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
