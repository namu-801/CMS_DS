// Figma Variable 내보내기(tokens/figma-variables.json)에서 코드 토큰을 만듭니다.
// 결과물(src/tokens/*)은 직접 고치지 말고, JSON을 갱신한 뒤 `npm run tokens`로 다시 만듭니다.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(readFileSync(resolve(root, "tokens/figma-variables.json"), "utf8"));
const outDir = resolve(root, "src/tokens");
mkdirSync(outDir, { recursive: true });

// Figma의 글꼴 굵기 이름 → CSS font-weight
const FONT_WEIGHT = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };
// Pretendard를 불러오지 못했을 때만 쓰는 대체 글꼴
const FONT_FALLBACK = "-apple-system, BlinkMacSystemFont, system-ui, sans-serif";

const cssName = (codeSyntax) => codeSyntax.match(/^var\((--[a-z0-9-]+)\)$/)[1];
const byName = new Map([...src.atomic, ...src.semantic, ...src.foundation].map(([name, code]) => [name, code]));

const colorValue = (value) => {
  if (typeof value === "string" && value.startsWith("@")) {
    const target = byName.get(value.slice(1));
    if (!target) throw new Error(`Alias 대상 없음: ${value}`);
    return target;
  }
  return value.toLowerCase();
};

const foundationValue = (name, value) => {
  if (name === "Font/Family/Base") return `"${value}", ${FONT_FALLBACK}`;
  if (name.startsWith("Font/Style/")) {
    if (!(value in FONT_WEIGHT)) throw new Error(`알 수 없는 굵기: ${value}`);
    return String(FONT_WEIGHT[value]);
  }
  return value === 0 ? "0" : `${value}px`;
};

// Figma 그림자 → CSS box-shadow. 숫자는 Figma 값 그대로(px), 색은 rgba
const px = (n) => (n === 0 ? "0" : `${+n.toFixed(2)}px`);
const shadowValue = (e) => {
  const [r, g, b, a] = e.color;
  const inset = e.type === "INNER_SHADOW" ? "inset " : "";
  return `${inset}${px(e.x)} ${px(e.y)} ${px(e.blur)} ${px(e.spread)} rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${+a.toFixed(2)})`;
};

const block = (title, rows) => [`  /* ${title} */`, ...rows.map(([n, v]) => `  ${n}: ${v};`)].join("\n");

const css = [
  "/* 자동 생성 파일입니다. 직접 고치지 마세요. 원본: tokens/figma-variables.json, 생성: npm run tokens */",
  ":root {",
  block("Atomic", src.atomic.map(([, code, v]) => [cssName(code), colorValue(v)])),
  "",
  block("Semantic", src.semantic.map(([, code, v]) => [cssName(code), colorValue(v)])),
  "",
  block("Foundation", src.foundation.map(([name, code, v]) => [cssName(code), foundationValue(name, v)])),
  "",
  block("Effect (Figma Effect Style)", (src.effects ?? []).map(([, code, list]) => [cssName(code), list.map(shadowValue).join(", ")])),
  "}",
  "",
].join("\n");
writeFileSync(resolve(outDir, "tokens.css"), css);

// Text Style: "15/SemiBold" → .text-15-semibold
const textStyleClass = (name) => "text-" + name.replace("/", "-").toLowerCase();
const styleVar = (weight) => cssName(byName.get(`Font/Style/${weight}`));
const typo = [
  "/* 자동 생성 파일입니다. 직접 고치지 마세요. Figma Text Style과 1:1 */",
  ...src.textStyles.map((name) => {
    const [size, weight] = name.split("/");
    return [
      `.${textStyleClass(name)} {`,
      `  font-family: var(--font-family-base);`,
      `  font-size: var(--font-size-${size});`,
      `  line-height: var(--font-line-height-${size});`,
      `  font-weight: var(${styleVar(weight)});`,
      `  letter-spacing: var(--font-letter-spacing-default);`,
      `}`,
    ].join("\n");
  }),
  "",
].join("\n");
writeFileSync(resolve(outDir, "typography.css"), typo);

const entries = (list) => list.map(([name, code]) => `  ${JSON.stringify(name)}: ${JSON.stringify(code)},`).join("\n");
const ts = `// 자동 생성 파일입니다. 직접 고치지 마세요. 원본: tokens/figma-variables.json
// Figma Variable 이름 → CSS 변수 참조

export const colorTokens = {
${entries([...src.atomic, ...src.semantic])}
} as const;

export const foundationTokens = {
${entries(src.foundation)}
} as const;

export const effectTokens = {
${entries(src.effects ?? [])}
} as const;

export const textStyles = {
${src.textStyles.map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(textStyleClass(n))},`).join("\n")}
} as const;

export type ColorToken = keyof typeof colorTokens;
export type FoundationToken = keyof typeof foundationTokens;
export type EffectToken = keyof typeof effectTokens;
export type TextStyle = keyof typeof textStyles;
`;
writeFileSync(resolve(outDir, "tokens.ts"), ts);

console.log(`tokens: atomic ${src.atomic.length}, semantic ${src.semantic.length}, foundation ${src.foundation.length}, effects ${(src.effects ?? []).length}, text styles ${src.textStyles.length}`);
