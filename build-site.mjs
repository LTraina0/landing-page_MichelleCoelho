import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const filesToCopy = ["index.html", "llms.txt", "CNAME"];
const optimizedImagesDir = path.join(rootDir, "imagens", "otimizadas");
const distImagesDir = path.join(distDir, "imagens", "otimizadas");

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(distImagesDir, { recursive: true });

for (const file of filesToCopy) {
  const source = path.join(rootDir, file);
  const target = path.join(distDir, file);

  try {
    await fs.copyFile(source, target);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

await fs.cp(optimizedImagesDir, distImagesDir, { recursive: true });

console.log("Build limpo criado em dist/");
