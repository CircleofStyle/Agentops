import en from "../src/i18n/dictionaries/en";
import de from "../src/i18n/dictionaries/de";

type ParityMismatch = { path: string; kind: "missing_in_de" | "missing_in_en" | "array_length" };

function collectMismatches(
  a: unknown,
  b: unknown,
  path: string,
  mismatches: ParityMismatch[],
): void {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      mismatches.push({ path, kind: "array_length" });
    }
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i += 1) {
      collectMismatches(a[i], b[i], `${path}[${i}]`, mismatches);
    }
    return;
  }

  const aObj = a && typeof a === "object" ? (a as Record<string, unknown>) : null;
  const bObj = b && typeof b === "object" ? (b as Record<string, unknown>) : null;

  if (!aObj || !bObj) {
    return;
  }

  const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const key of keys) {
    const nextPath = path ? `${path}.${key}` : key;
    if (!(key in aObj)) {
      mismatches.push({ path: nextPath, kind: "missing_in_en" });
      continue;
    }
    if (!(key in bObj)) {
      mismatches.push({ path: nextPath, kind: "missing_in_de" });
      continue;
    }
    collectMismatches(aObj[key], bObj[key], nextPath, mismatches);
  }
}

function main(): void {
  const mismatches: ParityMismatch[] = [];
  collectMismatches(en, de, "", mismatches);

  if (mismatches.length === 0) {
    console.log("i18n parity OK — en.ts and de.ts keys match.");
    return;
  }

  console.error(`i18n parity failed (${mismatches.length} mismatch(es)):`);
  for (const mismatch of mismatches) {
    if (mismatch.kind === "missing_in_de") {
      console.error(`  - missing in de.ts: ${mismatch.path}`);
    } else if (mismatch.kind === "missing_in_en") {
      console.error(`  - missing in en.ts: ${mismatch.path}`);
    } else {
      console.error(`  - array length mismatch: ${mismatch.path}`);
    }
  }
  process.exit(1);
}

main();
