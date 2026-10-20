import { fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("글자가 체크박스 이름이 되고, 기본은 꺼짐이다", () => {
    render(<Checkbox label="이메일 기억하기" />);
    const box = screen.getByRole("checkbox", { name: "이메일 기억하기" });
    expect(box).not.toBeChecked();
    expect(box.closest("label")).toHaveAttribute("data-checked", "off");
  });

  it("누르면 켜지고 다시 누르면 꺼진다(비제어 방식)", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="이메일 기억하기" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole("checkbox");
    fireEvent.click(box);
    expect(box).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(box);
    expect(box).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("글자를 눌러도 켜진다", () => {
    render(<Checkbox label="이메일 기억하기" />);
    fireEvent.click(screen.getByText("이메일 기억하기"));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("checked를 주면 바깥 상태를 따른다(제어 방식)", () => {
    function Controlled() {
      const [on, setOn] = useState(true);
      return <Checkbox label="동의" checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    const box = screen.getByRole("checkbox");
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(box).not.toBeChecked();
  });

  it("disabled면 바뀌지 않고, 켜진 채로 잠글 수 있다", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="시스템 공지 받기" defaultChecked disabled onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole("checkbox");
    expect(box).toBeDisabled();
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(box).toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(box.closest("label")).toHaveClass("disabled");
  });

  it("오류 문구는 체크박스와 연결되고 aria-invalid로 알린다", () => {
    const { rerender } = render(<Checkbox label="약관 동의" message="약관에 동의해 주세요." />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAccessibleDescription("약관에 동의해 주세요.");
    rerender(<Checkbox label="약관 동의" />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-describedby");
  });

  it("일부만 굵은 글도 이름이 된다", () => {
    render(
      <Checkbox
        label={
          <>
            가입 시 <strong>이용약관</strong> 및 <strong>개인정보처리방침</strong>에 동의합니다.
          </>
        }
      />,
    );
    // jsdom은 굵은 글씨 뒤에 띄어쓰기를 하나 더 넣어 계산하므로 띄어쓰기는 빼고 비교(브라우저는 붙여 읽음)
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAccessibleName(/^가입 시 이용약관 및 개인정보처리방침\s?에 동의합니다\.$/);
  });

  it("hideLabel이면 글자를 화면에서만 숨기고 클릭 영역을 넓힌다", () => {
    render(<Checkbox label="소노펠리체 CC 시설 안내 영상 선택" hideLabel />);
    const box = screen.getByRole("checkbox", { name: "소노펠리체 CC 시설 안내 영상 선택" });
    expect(box.closest("label")).toHaveClass("iconOnly");
    expect(screen.getByText("소노펠리체 CC 시설 안내 영상 선택")).toHaveClass("visuallyHidden");
  });

  it("체크 표시는 장식용 Check 20 아이콘이다", () => {
    render(<Checkbox label="동의" />);
    const svg = screen.getByRole("checkbox").parentElement!.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("data-icon", "action_check");
    expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
  });

  it("ref와 name·value는 input으로 전달된다", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="동의" name="terms" value="agree" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute("name", "terms");
    expect(ref.current).toHaveAttribute("value", "agree");
  });
});

describe("Checkbox 스타일은 토큰만 사용", () => {
  it("원시 색·px 값이 없다", () => {
    const css = readFileSync(resolve(__dirname, "./Checkbox.module.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(css).not.toMatch(/\d+(\.\d+)?px\b/);
  });
});

// 타입 검사(npm run typecheck)에서만 확인합니다. Figma에 없는 값은 컴파일 오류여야 합니다.
export function typeContract() {
  return (
    <>
      {/* @ts-expect-error 글자(label)는 필수 */}
      <Checkbox />
      {/* @ts-expect-error Figma에 없는 크기 */}
      <Checkbox label="동의" size="large" />
      {/* @ts-expect-error 혼합 상태는 아직 없음(checked는 true/false만) */}
      <Checkbox label="전체 선택" checked="mixed" />
      {/* @ts-expect-error 오류 문구는 글자만 */}
      <Checkbox label="동의" message={<b>오류</b>} />
      {/* @ts-expect-error style 덮어쓰기 금지 */}
      <Checkbox label="동의" style={{ width: 10 }} />
      {/* @ts-expect-error 체크박스가 아닌 종류로 바꿀 수 없음 */}
      <Checkbox label="동의" type="radio" />
    </>
  );
}
