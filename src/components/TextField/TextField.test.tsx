import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TextField, TEXT_FIELD_SIZES, TEXT_FIELD_STATUSES, TEXT_FIELD_TYPES } from "./TextField";

describe("TextField", () => {
  it("기본값은 small / type=text, 제목이 입력칸 이름이 된다", () => {
    render(<TextField label="이메일" placeholder="이메일" />);
    const input = screen.getByRole("textbox", { name: "이메일" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("placeholder", "이메일");
    expect(input.closest("[data-size]")).toHaveAttribute("data-size", "small");
  });

  it("Figma에 정의된 값만 받는다", () => {
    expect(TEXT_FIELD_SIZES).toEqual(["xsmall", "small", "medium", "large"]);
    expect(TEXT_FIELD_STATUSES).toEqual(["error", "success"]);
    expect(TEXT_FIELD_TYPES).toEqual(["text", "email", "password", "search", "tel", "url"]);
  });

  it("size·status에 맞는 클래스를 붙인다", () => {
    const { container } = render(<TextField label="이메일" size="large" status="error" />);
    expect(container.firstChild).toHaveClass("root", "large", "error");
  });

  it("hideLabel이면 제목을 화면에서만 숨기고 이름은 유지한다", () => {
    render(<TextField label="비밀번호" hideLabel placeholder="비밀번호" />);
    expect(screen.getByRole("textbox", { name: "비밀번호" })).toBeInTheDocument();
    expect(screen.getByText("비밀번호").closest("label")).toHaveClass("visuallyHidden");
  });

  it("required면 (필수)를 보이고 aria-required로 알린다", () => {
    render(<TextField label="이름" required />);
    expect(screen.getByText("(필수)")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("textbox", { name: "이름" })).toHaveAttribute("aria-required", "true");
  });

  it("오류 문구는 입력칸과 연결되고 aria-invalid로 알린다", () => {
    render(<TextField label="비밀번호 확인" status="error" message="비밀번호가 일치하지 않습니다." />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("비밀번호가 일치하지 않습니다.");
  });

  it("성공·안내 문구는 aria-invalid 없이 연결만 한다", () => {
    const { rerender } = render(<TextField label="이메일" status="success" message="사용 가능합니다." />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("사용 가능합니다.");
    rerender(<TextField label="이메일" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-describedby");
  });

  it("앞 아이콘은 장식용 24 아이콘이다", () => {
    render(<TextField label="검색" hideLabel size="medium" type="search" leadingIcon="action_search" />);
    const svg = screen.getByRole("searchbox").parentElement!.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("뒤 아이콘은 이름이 있는 IconButton(Plain 24)이고 누르면 동작한다", () => {
    const onClick = vi.fn();
    render(
      <TextField label="비밀번호" type="password" trailingAction={{ icon: "action_visibility_off", label: "비밀번호 보기", onClick }} />,
    );
    const button = screen.getByRole("button", { name: "비밀번호 보기" });
    expect(button).toHaveAttribute("data-variant", "plain");
    expect(button).toHaveAttribute("data-size", "24");
    expect(button).toHaveAttribute("data-icon-color", "default");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled면 입력칸과 뒤 버튼을 모두 막는다", () => {
    const onClick = vi.fn();
    const { container } = render(
      <TextField label="시간" disabled trailingAction={{ icon: "action_close", label: "지우기", onClick }} />,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "지우기" })).toBeDisabled();
    expect(container.firstChild).toHaveClass("disabled");
  });

  it("id를 주면 그 id로 제목과 연결하고, ref는 input으로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} id="email" label="이메일" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute("id", "email");
    expect(screen.getByText("이메일").closest("label")).toHaveAttribute("for", "email");
  });
});

describe("TextField 스타일은 토큰만 사용", () => {
  it("원시 색·px 값이 없다", () => {
    const css = readFileSync(resolve(__dirname, "./TextField.module.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(css).not.toMatch(/\d+(\.\d+)?px\b/);
  });
});

// 타입 검사(npm run typecheck)에서만 확인합니다. Figma에 없는 값은 컴파일 오류여야 합니다.
export function typeContract() {
  const noop = () => {};
  return (
    <>
      {/* @ts-expect-error 제목(label)은 필수 */}
      <TextField placeholder="이메일" />
      {/* @ts-expect-error Figma Size에 없는 값 */}
      <TextField label="이메일" size="xlarge" />
      {/* @ts-expect-error Figma State에 없는 결과 상태 */}
      <TextField label="이메일" status="warning" />
      {/* @ts-expect-error 등록되지 않은 아이콘 */}
      <TextField label="검색" leadingIcon="action_unknown" />
      {/* @ts-expect-error 뒤 버튼은 이름(label)이 필수 */}
      <TextField label="비밀번호" trailingAction={{ icon: "action_visibility", onClick: noop }} />
      {/* @ts-expect-error 한 줄 입력창이 아닌 종류 */}
      <TextField label="수량" type="number" />
      {/* @ts-expect-error style 덮어쓰기 금지 */}
      <TextField label="이메일" style={{ height: 36 }} />
      {/* @ts-expect-error 네이티브 size(글자 수)는 받지 않음. 크기는 Figma Size 값만 */}
      <TextField label="이메일" size={20} />
    </>
  );
}
