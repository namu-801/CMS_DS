import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

// 2026-10-27에 추가한 컴포넌트와 전역 스타일, 아이콘 데이터가 토큰만 쓰는지 한 번에 검사합니다.
const root = resolve(__dirname, "..");
const cssFiles = [
  ...["Badge", "Avatar", "Dropdown", "Tabs", "Pagination", "Table", "Modal", "Navigation", "Icon"].flatMap((dir) =>
    readdirSync(resolve(root, "components", dir))
      .filter((f) => f.endsWith(".module.css"))
      .map((f) => resolve(root, "components", dir, f)),
  ),
  resolve(root, "styles/scrollbar.css"),
];
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "");

describe("스타일은 토큰만 사용", () => {
  it.each(cssFiles.map((f) => [f.split("/src/")[1], f]))("%s: 원시 색·px 값이 없다", (_, file) => {
    const css = strip(readFileSync(file, "utf8"));
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(css).not.toMatch(/\d+(\.\d+)?px\b/);
  });

  it("아이콘·픽토그램 데이터에 헥스 색이 없다(currentColor 또는 토큰 변수)", () => {
    for (const f of ["components/Icon/icons.generated.ts", "components/Icon/pictograms.generated.ts"]) {
      const src = readFileSync(resolve(root, f), "utf8");
      expect(src).not.toMatch(/fill="#|fill='#|#[0-9a-fA-F]{6}\b/);
    }
  });
});
