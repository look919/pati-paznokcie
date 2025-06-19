import sharp from "sharp";
import fs from "fs";
import path from "path";

async function generateIcons() {
  // Ensure output directories exist
  const outputDir = path.resolve("./public/images");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create favicon directory if it doesn't exist
  const faviconDir = path.resolve("./public/favicon");
  if (!fs.existsSync(faviconDir)) {
    fs.mkdirSync(faviconDir, { recursive: true });
  }

  // Logo source file
  const logoPath = path.resolve("./public/images/logo.png");

  try {
    // Generate the various sizes needed for PWA
    await sharp(logoPath)
      .resize(192, 192)
      .toFile(path.join(outputDir, "logo-192.png"));

    await sharp(logoPath)
      .resize(512, 512)
      .toFile(path.join(outputDir, "logo-512.png"));

    // Generate favicon sizes
    await sharp(logoPath)
      .resize(16, 16)
      .toFile(path.join(faviconDir, "favicon-16x16.png"));

    await sharp(logoPath)
      .resize(32, 32)
      .toFile(path.join(faviconDir, "favicon-32x32.png"));

    await sharp(logoPath)
      .resize(180, 180)
      .toFile(path.join(faviconDir, "apple-touch-icon.png"));

    // Create a favicon.ico with multiple sizes
    await sharp(logoPath)
      .resize(32, 32)
      .toFile(path.join("./public", "favicon.ico"));

    console.log("✅ PWA icons and favicons generated successfully");
  } catch (error) {
    console.error("❌ Error generating icons:", error);
  }
}

generateIcons();
