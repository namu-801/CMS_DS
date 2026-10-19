import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { useState } from "react";
import { Radio, RadioGroup, RADIO_GROUP_ORIENTATIONS } from "./Radio";

function Repeat(props: { defaultValue?: string; disabled?: boolean; onValueChange?: (v: string) => void }) {
  return (
    <RadioGroup label="반복 재생" {...props}>
      <Radio value="off" label="반복 재생 안함" />
      <Radio value="on" label="반복 재생 함" />
    </RadioGroup>
  );
}

describe("RadioGroup / Radio", () => {
  it("묶음 이름이 radiogroup 이름이 되고, 선택지 글자가 각 라디오 이름이 된다", () => {
    render(<Repeat />);
    expect(screen.getByRole("radiogroup", { name: "반복 재생" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "반복 재생 안함" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "반복 재생 함" })).toBeInTheDocument();
  });

  it("Figma에 정의된 배치 값만 받는다(기본 가로)", () => {
    expect(RADIO_GROUP_ORIENTATIONS).toEqual(["horizontal", "vertical"]);
    render(<Repeat />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("defaultValue로 시작하고, 고르면 하나만 선택된다", () => {
    const onValueChange = vi.fn();
    render(<Repeat defaultValue="off" onValueChange={onValueChange} />);
    const off = screen.getByRole("radio", { name: "반복 재생 안함" });
    const on = screen.getByRole("radio", { name: "반복 재생 함" });
    expect(off).toBeChecked();
    fireEvent.click(on);
    expect(on).toBeChecked();
    expect(off).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("on");
  });

  it("value를 주면 바깥 상태를 따른다(제어 방식)", () => {
    function Controlled() {
      const [v, setV] = useState("on");
      return (
        <RadioGroup label="반복 재생" value={v} onValueChange={setV}>
          <Radio value="off" label="안함" />
          <Radio value="on" label="함" />
        </RadioGroup>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("radio", { name: "함" })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "안함" }));
    expect(screen.getByRole("radio", { name: "안함" })).toBeChecked();
  });

  it("같은 묶음의 라디오는 같은 name을 가진다(키보드 화살표 이동)", () => {
    render(<Repeat />);
    const [a, b] = screen.getAllByRole("radio");
    expect(a.getAttribute("name")).toBeTruthy();
    expect(a.getAttribute("name")).toBe(b.getAttribute("name"));
  });

  it("묶음 disabled면 모든 라디오가 비활성이고 고를 수 없다", () => {
    const onValueChange = vi.fn();
    render(<Repeat disabled onValueChange={onValueChange} />);
    for (const r of screen.getAllByRole("radio")) expect(r).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: "반복 재생 함" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("라디오 하나만 비활성으로 둘 수 있다", () => {
    render(
      <RadioGroup label="종류">
        <Radio value="a" label="가" />
        <Radio value="b" label="나" disabled />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "가" })).toBeEnabled();
    expect(screen.getByRole("radio", { name: "나" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "나" }).closest("label")).toHaveClass("disabled");
  });

  it("hideLabel이면 글자를 화면에서만 숨기고 클릭 영역을 넓힌다", () => {
    render(
      <RadioGroup label="콘텐츠 선택" hideLabel>
        <Radio value="1" label="시설 안내 영상 선택" hideLabel />
      </RadioGroup>,
    );
    const radio = screen.getByRole("radio", { name: "시설 안내 영상 선택" });
    expect(radio.closest("label")).toHaveClass("iconOnly");
    expect(screen.getByText("시설 안내 영상 선택")).toHaveClass("visuallyHidden");
    expect(screen.getByRole("radiogroup", { name: "콘텐츠 선택" })).toBeInTheDocument();
  });

  it("RadioGroup 밖에서 쓰면 오류를 낸다", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Radio value="a" label="가" />)).toThrow("RadioGroup 안에서만");
    spy.mockRestore();
  });
});

describe("Radio 스타일은 토큰만 사용", () => {
  it("원시 색·px 값이 없다", () => {
    const css = readFileSync(resolve(__dirname, "./Radio.module.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(css).not.toMatch(/\d+(\.\d+)?px\b/);
  });
});

// 타입 검사(npm run typecheck)에서만 확인합니다. Figma에 없는 값은 컴파일 오류여야 합니다.
export function typeContract() {
  return (
    <>
      {/* @ts-expect-error 묶음 이름(label)은 필수 */}
      <RadioGroup>
        <Radio value="a" label="가" />
      </RadioGroup>
      {/* @ts-expect-error 정의되지 않은 배치 */}
      <RadioGroup label="종류" orientation="grid">
        <Radio value="a" label="가" />
      </RadioGroup>
      <RadioGroup label="종류">
        {/* @ts-expect-error 선택지 글자(label)는 필수 */}
        <Radio value="a" />
        {/* @ts-expect-error 값(value)은 필수 */}
        <Radio label="가" />
        {/* @ts-expect-error Figma에 없는 크기 */}
        <Radio value="a" label="가" size="large" />
        {/* @ts-expect-error style 덮어쓰기 금지 */}
        <Radio value="a" label="가" style={{ width: 10 }} />
      </RadioGroup>
    </>
  );
}
