import { fireEvent, render, screen } from "@testing-library/react";
import { Tabs } from "./Tabs";

const ITEMS = [
  { value: "location", label: "위치 설정", content: <p>지도</p> },
  { value: "time", label: "시간 설정", content: <p>시간표</p> },
  { value: "etc", label: "기타", disabled: true },
];

describe("Tabs", () => {
  it("이름 있는 tablist, 처음엔 첫 탭이 선택되고 그 내용이 보인다", () => {
    render(<Tabs label="설정 방식" items={ITEMS} />);
    expect(screen.getByRole("tablist", { name: "설정 방식" })).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getByRole("tab", { name: "위치 설정" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("지도");
  });

  it("누르면 선택이 바뀐다", () => {
    const onValueChange = vi.fn();
    render(<Tabs label="설정 방식" items={ITEMS} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "시간 설정" }));
    expect(onValueChange).toHaveBeenCalledWith("time");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("시간표");
  });

  it("좌·우 화살표로 옮기면 바로 선택(비활성 탭은 건너뜀), 선택된 탭만 Tab으로 들어감", () => {
    render(<Tabs label="설정 방식" items={ITEMS} />);
    const first = screen.getByRole("tab", { name: "위치 설정" });
    expect(first).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "시간 설정" })).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "시간 설정" })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(screen.getByRole("tab", { name: "시간 설정" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "위치 설정" })).toHaveAttribute("aria-selected", "true");
  });

  it("세로 탭은 위·아래 화살표", () => {
    render(<Tabs label="콘텐츠 종류" orientation="vertical" items={ITEMS} />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    fireEvent.keyDown(screen.getByRole("tab", { name: "위치 설정" }), { key: "ArrowDown" });
    expect(screen.getByRole("tab", { name: "시간 설정" })).toHaveAttribute("aria-selected", "true");
  });

  it("비활성 탭은 누를 수 없다", () => {
    render(<Tabs label="설정 방식" items={ITEMS} />);
    expect(screen.getByRole("tab", { name: "기타" })).toBeDisabled();
  });
});

export function typeContract() {
  return (
    <>
      {/* @ts-expect-error Figma Orientation은 horizontal/vertical만 */}
      <Tabs label="x" items={ITEMS} orientation="row" />
      {/* @ts-expect-error 탭 묶음 이름은 필수 */}
      <Tabs items={ITEMS} />
    </>
  );
}
