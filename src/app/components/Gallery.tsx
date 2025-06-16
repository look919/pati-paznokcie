import Image from "next/image";

export const Gallery = () => {
  // Array of images for the gallery
  const images = [
    { src: "/images/gallery/gal-1.jpg", alt: "Gallery image 1" },
    { src: "/images/gallery/gal-2.jpg", alt: "Gallery image 2" },
    { src: "/images/gallery/gal-3.jpg", alt: "Gallery image 3" },
    { src: "/images/gallery/gal-4.jpg", alt: "Gallery image 4" },
    { src: "/images/gallery/gal-5.jpg", alt: "Gallery image 5" },
    { src: "/images/gallery/gal-6.jpg", alt: "Gallery image 6" },
    { src: "/images/gallery/gal-7.jpg", alt: "Gallery image 7" },
    { src: "/images/gallery/gal-8.jpg", alt: "Gallery image 8" },
    { src: "/images/gallery/gal-9.jpg", alt: "Gallery image 9" },
    { src: "/images/gallery/gal-10.jpg", alt: "Gallery image 10" },
    { src: "/images/gallery/gal-11.jpg", alt: "Gallery image 11" },
    { src: "/images/gallery/gal-12.jpg", alt: "Gallery image 12" },
    { src: "/images/gallery/gal-13.jpg", alt: "Gallery image 13" },
    { src: "/images/gallery/gal-14.jpg", alt: "Gallery image 14" },
    { src: "/images/gallery/gal-15.jpg", alt: "Gallery image 15" },
    { src: "/images/gallery/gal-16.jpg", alt: "Gallery image 16" },
  ];

  // Image overlay component to avoid repetition
  const ImageOverlay = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <div className="p-3 bg-white/80 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-sky-500"
        >
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path
            fillRule="evenodd"
            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-gray-100">
      <div className="py-12">
        <h2 className="text-center text-4xl font-light text-gray-700 mb-10 uppercase tracking-wide">
          <span className="inline-block border-b-2 border-sky-400 pb-2">
            Our Gallery
          </span>
        </h2>
      </div>

      {/* Mobile layout (4x4 grid) - Only visible on small screens */}
      <div
        className="grid grid-cols-2 grid-rows-4 gap-0 sm:hidden"
        style={{ aspectRatio: "1/1" }}
      >
        {/* Row 1, Column 1 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
            priority
          />
          <ImageOverlay />
        </div>

        {/* Row 1, Column 2 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[1].src}
            alt={images[1].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Row 2, Column 1 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[6].src}
            alt={images[6].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Row 2, Column 2 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[15].src}
            alt={images[15].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Row 3, Column 1 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[8].src}
            alt={images[8].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Row 3, Column 2 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[9].src}
            alt={images[9].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Row 4, Column 1 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[12].src}
            alt={images[12].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Row 4, Column 2 */}
        <div className="relative overflow-hidden group">
          <Image
            src={images[11].src}
            alt={images[11].alt}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>
      </div>

      {/* Desktop layout - Hidden on mobile, visible on sm screens and above */}
      {/* Full-width gallery with no gaps using CSS grid
          Layout as specified:
          01 01 02 02 03 04 05 06
          01 01 07 08 09 09 10 10
          11 12 07 13 13 14 10 10
      */}
      <div
        className="hidden sm:grid sm:grid-cols-6 md:grid-cols-8 gap-0"
        style={{ aspectRatio: "8/3" }}
      >
        {/* 
          Layout pattern:
          01 01 02 02 03 04 05 06
          01 01 07 08 09 09 10 10
          11 12 07 13 13 14 10 10
        */}

        {/* Image 01 - (2x2) - Top left corner */}
        <div className="col-span-2 row-span-2 relative overflow-hidden group">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            sizes="25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
            priority
          />
          <ImageOverlay />
        </div>

        {/* Image 02 - (2x1) - Top row, columns 3-4 */}
        <div className="col-span-2 row-span-1 relative overflow-hidden group">
          <Image
            src={images[1].src}
            alt={images[1].alt}
            fill
            sizes="25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 03 - (1x1) - Top row, column 5 */}
        <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[2].src}
            alt={images[2].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 04 - (1x1) - Top row, column 6 */}
        <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[3].src}
            alt={images[3].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 05 - (1x1) - Top row, column 7 */}
        <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[4].src}
            alt={images[4].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 06 - (1x1) - Top row, column 8 */}
        <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[5].src}
            alt={images[5].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 07 - (1x2) - Middle/bottom rows, column 3 */}
        <div className="col-span-1 row-span-2 relative overflow-hidden group">
          <Image
            src={images[6].src}
            alt={images[6].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 08 - (1x1) - Middle row, column 4 - Using image 16 for more variety */}
        <div className="col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[15].src}
            alt={images[15].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 09 - (2x1) - Middle row, columns 5-6 */}
        <div className="col-span-2 row-span-1 relative overflow-hidden group">
          <Image
            src={images[8].src}
            alt={images[8].alt}
            fill
            sizes="25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 10 - (2x2) - Middle/bottom rows, columns 7-8 */}
        <div className="col-span-2 row-span-2 relative overflow-hidden group">
          <Image
            src={images[9].src}
            alt={images[9].alt}
            fill
            sizes="25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 11 - (1x1) - Bottom row, column 1 - Using image 8 for more variety */}
        <div className="col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[7].src}
            alt={images[7].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 12 - (1x1) - Bottom row, column 2 - Using image 15 for more variety */}
        <div className="col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[14].src}
            alt={images[14].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 13 - (2x1) - Bottom row, columns 4-5 */}
        <div className="col-span-2 row-span-1 relative overflow-hidden group">
          <Image
            src={images[12].src}
            alt={images[12].alt}
            fill
            sizes="25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* Image 14 - (1x1) - Bottom row, column 6 - Using image 12 for more variety */}
        <div className="col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[11].src}
            alt={images[11].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        {/* These images are now used in the grid pattern above */}
        <div className="hidden col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[10].src}
            alt={images[10].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>

        <div className="hidden col-span-1 row-span-1 relative overflow-hidden group">
          <Image
            src={images[13].src}
            alt={images[13].alt}
            fill
            sizes="12.5vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          />
          <ImageOverlay />
        </div>
      </div>
    </section>
  );
};
