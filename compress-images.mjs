import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const inputDir = "imagens";
const outputDir = "imagens/otimizadas";

await fs.mkdir(outputDir, { recursive: true });

const images = [
  {
    input: "problema-bg-mobile-figma.png",
    output: "problema-bg-mobile-figma.webp",
    width: 900,
    quality: 76,
  },
  {
    input: "hero-bg-mobile.png",
    output: "hero-bg-mobile.webp",
    width: 900,
    quality: 76,
  },
  {
    input: "hero-mobile-person-figma.png",
    output: "hero-mobile-person-figma.webp",
    width: 900,
    quality: 78,
  },
  {
    input: "hero-bg.png",
    output: "hero-bg.webp",
    width: 1920,
    quality: 80,
  },
  {
    input: "problema-bg-desktop-figma.png",
    output: "problema-bg-desktop-figma.webp",
    width: 1920,
    quality: 80,
  },
  {
    input: "kit-mockup.png",
    output: "kit-mockup.webp",
    width: 760,
    quality: 82,
  },
  {
    input: "logo-michelle-coelho.jpg",
    output: "logo-michelle-coelho.webp",
    width: 400,
    quality: 85,
  },
  {
    input: "michelle.png",
    output: "michelle.webp",
    width: 600,
    quality: 80,
  },
  {
    input: "selo-garantia.jpg",
    output: "selo-garantia.webp",
    width: 300,
    quality: 85,
  },
  {
    input: "Layout mobile exemplo..png",
    output: "layout-mobile-exemplo.webp",
    width: 900,
    quality: 76,
  },
];

for (const image of images) {
  const inputPath = path.join(inputDir, image.input);
  const outputPath = path.join(outputDir, image.output);

  try {
    await sharp(inputPath)
      .resize({ width: image.width, withoutEnlargement: true })
      .webp({ quality: image.quality })
      .toFile(outputPath);

    const stats = await fs.stat(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`OK: ${image.output} (${sizeKB} KB)`);
  } catch (error) {
    console.error(`ERRO: ${image.input} - ${error.message}`);
  }
}

console.log("\nOtimização concluída!");
