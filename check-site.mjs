import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const htmlPath = path.join(rootDir, "index.html");
const wrongDomain = "kit.cursodescomplicandosites.com.br";
const checkoutUrl = "https://pay.hotmart.com/Y97284855G?checkoutMode=10";
const externalImageHost = "images.unsplash.com";

const html = await fs.readFile(htmlPath, "utf8");
const errors = [];

if (html.includes(wrongDomain)) {
  errors.push(`Dominio incorreto encontrado: ${wrongDomain}`);
}

if (html.includes(externalImageHost)) {
  errors.push(`Imagem externa encontrada: ${externalImageHost}`);
}

if (!html.includes(checkoutUrl)) {
  errors.push("Checkout da Hotmart nao encontrado no HTML.");
}

const jsonLdMatch = html.match(
  /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i,
);

if (!jsonLdMatch) {
  errors.push("JSON-LD nao encontrado.");
} else {
  try {
    JSON.parse(jsonLdMatch[1]);
  } catch (error) {
    errors.push(`JSON-LD invalido: ${error.message}`);
  }
}

const localRefs = new Set();
const refPatterns = [
  /(?:src|href)=["']([^"']+)["']/gi,
  /url\(["']?([^"')]+)["']?\)/gi,
];

for (const pattern of refPatterns) {
  for (const match of html.matchAll(pattern)) {
    const ref = match[1].trim();

    if (
      ref.startsWith("#") ||
      ref.startsWith("data:") ||
      ref.startsWith("mailto:") ||
      ref.startsWith("tel:") ||
      /^https?:\/\//i.test(ref)
    ) {
      continue;
    }

    localRefs.add(ref.split(/[?#]/)[0]);
  }
}

for (const ref of localRefs) {
  try {
    await fs.access(path.join(rootDir, ref));
  } catch {
    errors.push(`Arquivo local referenciado nao existe: ${ref}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERRO: ${error}`);
  }
  process.exit(1);
}

console.log("Validacao local concluida sem erros.");
