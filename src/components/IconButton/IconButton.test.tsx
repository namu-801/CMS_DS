import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { IconButton, ICON_BUTTON_ICON_COLORS, ICON_BUTTON_SIZES, ICON_BUTTON_VARIANTS } from "./IconButton";

describe("IconButton", () => {
  it("기본값은 plain / 40 / strong / type=button, label이 이름과 툴팁이 된다", () => {
    render(<IconButton icon="action_plus" label="추가" />);
    const button = screen.getByRole("button", { name: "추가" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("title", "추가");
    expect(button).toHaveAttribute("data-variant", "plain");
    expect(button).toHaveAttribute("data-size", "40");
    expect(button).toHaveAttribute("data-icon-color", "strong");
  });

  it("Figma에 정의된 값만 받는다", () => {
    expect(ICON_BUTTON_VARIANTS).toEqual(["plain", "outline", "primary"]);
    expect(ICON_BUTTON_SIZES).toEqual([20, 24, 40, 48]);
    expect(ICON_BUTTON_ICON_COLORS).toEqual(["strong", "default", "primary"]);
  });

  it("variant·size·iconColor에 맞는 클래스를 붙인다", () => {
    render(<IconButton icon="action_plus" label="확대" variant="outline" size={48} iconColor="default" />);
    expect(screen.getByRole("button")).toHaveClass("button", "outline", "s48", "toneDefault");
  });

  it("아이콘은 장식용이고 iconSize에 맞는 그림을 쓴다", () => {
    render(<IconButton icon="arrow_up" label="위로" size={48} iconSize={32} />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 32 32");
    expect(svg).toHaveClass("large");
  });

  it("20·24 틀만 클릭 영역을 넓힌다", () => {
    const { rerender } = render(<IconButton icon="action_edit" label="수정" size={20} />);
    expect(screen.getByRole("button")).toHaveClass("extendHit");
    rerender(<IconButton icon="action_edit" label="수정" size={24} />);
    expect(screen.getByRole("button")).toHaveClass("extendHit");
    rerender(<IconButton icon="action_edit" label="수정" size={40} />);
    expect(screen.getByRole("button")).not.toHaveClass("extendHit");
  });

  it("selected는 켜고 끄는 버튼일 때만 aria-pressed로 알린다", () => {
    const { rerender } = render(<IconButton icon="editor_bold" label="굵게" />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
    rerender(<IconButton icon="editor_bold" label="굵게" selected={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    rerender(<IconButton icon="editor_bold" label="굵게" selected />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("disabled면 클릭이 실행되지 않는다", () => {
    const onClick = vi.fn();
    render(<IconButton icon="action_plus" label="추가" disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("floating이면 그림자 클래스를 붙인다", () => {
    render(<IconButton icon="action_plus" label="확대" variant="outline" floating />);
    expect(screen.getByRole("button")).toHaveClass("floating");
  });

  it("aria-label을 따로 줘도 버튼 이름은 label이다", () => {
    render(<IconButton icon="action_plus" label="추가" {...{ "aria-label": "다른 이름" }} />);
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
  });

  it("ref를 button 요소로 전달한다", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} icon="action_plus" label="추가" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("IconButton 스타일은 토큰만 사용", () => {
  it("원시 색·px 값이 없다", () => {
    const css = readFileSync(resolve(__dirname, "./IconButton.module.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(css).not.toMatch(/\d+(\.\d+)?px\b/);
  });
});

// 타입 검사(npm run typecheck)에서만 확인합니다. Figma에 없는 값·지침 위반은 컴파일 오류여야 합니다.
export function typeContract() {
  return (
    <>
      {/* @ts-expect-error label(버튼 이름)은 필수 */}
      <IconButton icon="action_plus" />
      {/* @ts-expect-error Figma Style에 없는 값 */}
      <IconButton icon="action_plus" label="추가" variant="ghost" />
      {/* @ts-expect-error Figma Size에 없는 값 */}
      <IconButton icon="action_plus" label="추가" size={32} />
      {/* @ts-expect-error Figma Icon Color에 없는 값 */}
      <IconButton icon="action_plus" label="추가" iconColor="red" />
      {/* @ts-expect-error 대비 미달로 뺀 값 */}
      <IconButton icon="action_plus" label="추가" iconColor="subtle" />
      {/* @ts-expect-error 틀(20)보다 큰 아이콘(24)은 넣지 않음 */}
      <IconButton icon="action_plus" label="추가" size={20} iconSize={24} />
      {/* @ts-expect-error 틀(24)보다 큰 아이콘(32)은 넣지 않음 */}
      <IconButton icon="arrow_up" label="위로" size={24} iconSize={32} />
      {/* @ts-expect-error 등록되지 않은 아이콘 */}
      <IconButton icon="action_unknown" label="추가" />
      {/* @ts-expect-error style 덮어쓰기 금지 */}
      <IconButton icon="action_plus" label="추가" style={{ width: 36 }} />
    </>
  );
}
