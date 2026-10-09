import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "./Button";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Button", () => {
  it("기본값은 primary / small / type=button", () => {
    render(<Button>저장</Button>);
    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "small");
  });

  it("Figma에 정의된 Style 7개, Size 5개만 받는다", () => {
    expect(BUTTON_VARIANTS).toEqual(["primary", "secondary", "neutral", "outline", "outline-brand", "plain", "destructive"]);
    expect(BUTTON_SIZES).toEqual(["xsmall", "small", "medium", "large", "xlarge"]);
  });

  it("variant·size에 맞는 클래스를 붙인다", () => {
    render(<Button variant="outline-brand" size="xlarge">회원가입</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("button", "outlineBrand", "xlarge");
  });

  it("아이콘은 장식용(aria-hidden)이고 이름은 문구로 정해진다", () => {
    render(<Button iconLeft="action_plus" iconRight="arrow_right">추가</Button>);
    const button = screen.getByRole("button", { name: "추가" });
    const svgs = button.querySelectorAll("svg");
    expect(svgs).toHaveLength(2);
    svgs.forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
  });

  it("버튼 크기에 맞는 아이콘 그림을 고른다(없으면 가장 가까운 크기)", () => {
    const { rerender } = render(<Button size="xsmall" iconLeft="action_plus">추가</Button>);
    expect(screen.getByRole("button").querySelector("svg")).toHaveAttribute("viewBox", "0 0 16 16");
    rerender(<Button size="large" iconRight="arrow_right">다음</Button>);
    expect(screen.getByRole("button").querySelector("svg")).toHaveAttribute("viewBox", "0 0 24 24");
    rerender(<Button size="large" iconLeft="action_plus">추가</Button>);
    expect(screen.getByRole("button").querySelector("svg")).toHaveAttribute("viewBox", "0 0 24 24");
    // 24 그림이 없는 아이콘은 가장 가까운 20 그림을 24 크기로 그림
    rerender(<Button size="large" iconLeft="action_edit">수정</Button>);
    expect(screen.getByRole("button").querySelector("svg")).toHaveAttribute("viewBox", "0 0 20 20");
  });

  it("disabled면 native disabled이고 클릭이 실행되지 않는다", () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>저장</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading이면 aria-busy, 클릭 차단, 왼쪽 아이콘 대신 회전 아이콘", () => {
    const onClick = vi.fn();
    render(<Button loading iconLeft="action_plus" iconRight="arrow_right" onClick={onClick}>저장</Button>);
    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled(); // 포커스 유지
    const icons = [...button.querySelectorAll("svg")].map((s) => s.getAttribute("data-icon"));
    expect(icons).toEqual(["status_loading", "arrow_right"]);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading과 disabled를 같이 주면 loading이 우선한다", () => {
    render(<Button loading disabled>저장</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).not.toBeDisabled();
  });

  it("loading 중 submit 버튼은 폼을 제출하지 않는다", () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    render(
      <form onSubmit={onSubmit as never}>
        <Button type="submit" loading>저장</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("ref를 button 요소로 전달한다", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>저장</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("토큰만 사용", () => {
  const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");
  const read = (path: string) => readFileSync(resolve(__dirname, path), "utf8");
  it.each(["./Button.module.css", "../Icon/Icon.module.css"])("%s에 원시 색·px 값이 없다", (path) => {
    const body = stripComments(read(path));
    expect(body).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(body).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(body).not.toMatch(/\d+(\.\d+)?px\b/);
  });
});

// 타입 검사(npm run typecheck)에서만 확인합니다. Figma에 없는 값은 컴파일 오류여야 합니다.
export function typeContract() {
  return (
    <>
      {/* @ts-expect-error Figma Style에 없는 값 */}
      <Button variant="danger">삭제</Button>
      {/* @ts-expect-error Figma Size에 없는 값 */}
      <Button size="medium2">저장</Button>
      {/* @ts-expect-error 등록되지 않은 아이콘 */}
      <Button iconLeft="action_unknown">저장</Button>
      {/* @ts-expect-error style 덮어쓰기 금지 */}
      <Button style={{ height: 42 }}>저장</Button>
      {/* @ts-expect-error 문구는 글자만 */}
      <Button>{<span>저장</span>}</Button>
    </>
  );
}
