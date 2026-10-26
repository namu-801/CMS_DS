import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from "./Dropdown";

const OPTIONS = [
  { value: "all", label: "전체" },
  { value: "driving", label: "운행 중" },
  { value: "idle", label: "대기" },
  { value: "charging", label: "충전 중" },
] as const;

describe("Dropdown", () => {
  it("이름(label)이 있는 combobox이고, 값이 없으면 안내 문구", () => {
    render(<Dropdown label="운행 상태" options={OPTIONS} placeholder="운행 상태별" />);
    const box = screen.getByRole("combobox", { name: "운행 상태" });
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("운행 상태별")).toHaveAttribute("data-value", "empty");
  });

  it("누르면 목록이 열리고, 고르면 값이 바뀌고 닫힌다", () => {
    const onValueChange = vi.fn();
    render(<Dropdown label="운행 상태" options={OPTIONS} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeVisible();
    fireEvent.click(screen.getByRole("option", { name: "대기" }));
    expect(onValueChange).toHaveBeenCalledWith("idle");
    expect(screen.getByRole("combobox")).toHaveTextContent("대기");
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("고른 선택지는 aria-selected와 오른쪽 체크", () => {
    render(<Dropdown label="운행 상태" options={OPTIONS} defaultValue="driving" />);
    fireEvent.click(screen.getByRole("combobox"));
    const opt = screen.getByRole("option", { name: "운행 중" });
    expect(opt).toHaveAttribute("aria-selected", "true");
    expect(opt.querySelector('[data-icon="action_check"]')).not.toBeNull();
  });

  it("키보드: 아래 화살표로 열고, 이동하고, Enter로 고르고, Esc로 닫는다", () => {
    const onValueChange = vi.fn();
    render(<Dropdown label="운행 상태" options={OPTIONS} onValueChange={onValueChange} />);
    const box = screen.getByRole("combobox");
    fireEvent.keyDown(box, { key: "ArrowDown" });
    expect(box).toHaveAttribute("aria-expanded", "true");
    expect(box.getAttribute("aria-activedescendant")).toMatch(/opt-0$/);
    fireEvent.keyDown(box, { key: "ArrowDown" });
    fireEvent.keyDown(box, { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith("driving");
    fireEvent.keyDown(box, { key: "ArrowDown" });
    fireEvent.keyDown(box, { key: "Escape" });
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("글자를 치면 그 글자로 시작하는 선택지로 간다", () => {
    render(<Dropdown label="운행 상태" options={OPTIONS} />);
    const box = screen.getByRole("combobox");
    fireEvent.keyDown(box, { key: "충" });
    expect(box.getAttribute("aria-activedescendant")).toMatch(/opt-3$/);
  });

  it("비활성이면 열리지 않는다", () => {
    render(<Dropdown label="운행 상태" options={OPTIONS} disabled />);
    const box = screen.getByRole("combobox");
    expect(box).toBeDisabled();
    fireEvent.keyDown(box, { key: "ArrowDown" });
    expect(box).toHaveAttribute("aria-expanded", "false");
  });

  it("name을 주면 폼 제출용 숨은 값", () => {
    const { container } = render(<Dropdown label="글꼴" options={OPTIONS} name="font" defaultValue="all" size="small" />);
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute("value", "all");
    expect(container.firstChild).toHaveAttribute("data-size", "small");
  });
});

// 타입 검사에서만 확인합니다. Figma에 없는 값은 컴파일 오류여야 합니다.
export function typeContract() {
  return (
    <>
      {/* @ts-expect-error 이름(label)은 필수 */}
      <Dropdown options={OPTIONS} />
      {/* @ts-expect-error Figma Size는 small/medium만 */}
      <Dropdown label="x" options={OPTIONS} size="large" />
      {/* @ts-expect-error 선택지 글자는 문자열 */}
      <Dropdown label="x" options={[{ value: "a", label: 1 }]} />
    </>
  );
}
