import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const htmlPath = path.join(rootDir, "index.html");
const outputDir = path.join(rootDir, "imagens", "otimizadas", "externas");

let html = await fs.readFile(htmlPath, "utf8");
const urls = [...new Set(html.match(/https:\/\/images\.unsplash\.com\/[^"')\s]+/g) ?? [])];

if (urls.length === 0) {
  console.log("Nenhuma imagem externa encontrada.");
  process.exit(0);
}

await fs.mkdir(outputDir, { recursive: true });

for (const [index, url] of urls.entries()) {
  const fileName = `unsplash-${String(index + 1).padStart(2, "0")}.webp`;
  const outputPath = path.join(outputDir, fileName);
  const localRef = `imagens/otimizadas/externas/${fileName}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao baixar ${url}: ${response.status} ${response.statusText}`);
  }

  const sourceBuffer = Buffer.from(await response.arrayBuffer());
  await sharp(sourceBuffer).webp({ quality: 78 }).toFile(outputPath);
  html = html.replaceAll(url, localRef);

  console.log(`OK: ${localRef}`);
}

await fs.writeFile(htmlPath, html);
console.log(`Imagens externas localizadas: ${urls.length}`);
