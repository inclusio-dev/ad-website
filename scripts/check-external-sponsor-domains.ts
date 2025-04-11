const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "data", "sponsors.json");

const file = fs.readFileSync(filePath, "utf-8");
const sponsors = JSON.parse(file);

const externalDomains = new Set<string>();

for (const sponsor of sponsors) {
  const logoUrl = sponsor.logo;

  if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
    try {
      const parsed = new URL(logoUrl); // ✅ URL è globale nei tipi DOM
      externalDomains.add(parsed.hostname);
    } catch (err) {
      console.error(`⚠️  URL non valido: ${logoUrl}`);
    }
  }
}

if (externalDomains.size > 0) {
  console.log("🌐 Domini esterni trovati nei loghi sponsor:");
  console.log([...externalDomains].map((d) => `- "${d}"`).join("\n"));

  console.log(
    `\n➡️  Aggiungi questi domini nel tuo next.config.js:\n\nimages: {\n  domains: [${[...externalDomains]
      .map((d) => `"${d}"`)
      .join(", ")}]\n}`
  );
} else {
  console.log("✅ Nessun logo esterno rilevato. Tutti i loghi sono locali!");
}
