import { render, screen } from "@testing-library/react";
import { CountBadge, EventLabel, StatusBadge, StatusText, Tag } from "./Badge";

describe("Tag", () => {
  it("종류마다 아이콘이 정해지고 글자를 보여 준다", () => {
    const { container } = render(<Tag type="time">16:00:00 ~ 16:30:00</Tag>);
    expect(screen.getByText("16:00:00 ~ 16:30:00")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("data-icon", "object_time");
    expect(container.firstChild).toHaveAttribute("data-type", "time");
  });
  it("GPS 태그는 위치 핀 아이콘", () => {
    const { container } = render(<Tag type="gps">GPS</Tag>);
    expect(container.querySelector("svg")).toHaveAttribute("data-icon", "location_pin_filled");
  });
});

describe("종류별 기본 글자 (Figma 2026-10-27 결정)", () => {
  it("StatusText는 성공·실패", () => {
    const { rerender } = render(<StatusText status="success" />);
    expect(screen.getByText("성공")).toBeInTheDocument();
    rerender(<StatusText status="fail" />);
    expect(screen.getByText("실패")).toBeInTheDocument();
  });
  it("StatusBadge는 운행중·운행종료", () => {
    const { rerender } = render(<StatusBadge status="positive" />);
    expect(screen.getByText("운행중")).toBeInTheDocument();
    rerender(<StatusBadge status="negative" />);
    expect(screen.getByText("운행종료")).toBeInTheDocument();
  });
  it("EventLabel은 위험·경고·주의", () => {
    const { rerender } = render(<EventLabel level="danger" />);
    expect(screen.getByText("위험")).toBeInTheDocument();
    rerender(<EventLabel level="caution" />);
    expect(screen.getByText("주의")).toBeInTheDocument();
  });
  it("글자를 주면 그 글자를 씀", () => {
    render(<StatusText status="success">다운로드 성공</StatusText>);
    expect(screen.getByText("다운로드 성공")).toBeInTheDocument();
  });
});

describe("CountBadge", () => {
  it("화면에는 +N, 스크린리더는 외 N개", () => {
    render(<CountBadge count={2} />);
    expect(screen.getByText("+2")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("외 2개")).toHaveClass("visuallyHidden");
  });
});

// 타입 검사(npm run typecheck)에서만 확인합니다. Figma에 없는 값은 컴파일 오류여야 합니다.
export function typeContract() {
  return (
    <>
      {/* @ts-expect-error Figma Tag에 없는 종류 */}
      <Tag type="danger">x</Tag>
      {/* @ts-expect-error 태그 글자는 필수 */}
      <Tag type="gps" />
      {/* @ts-expect-error Status Text 값은 success/fail만 */}
      <StatusText status="warning" />
      {/* @ts-expect-error Event Label 값은 danger/warning/caution만 */}
      <EventLabel level="info" />
      {/* @ts-expect-error 글자만 넣을 수 있음 */}
      <StatusBadge status="positive"><b>운행</b></StatusBadge>
      {/* @ts-expect-error style 덮어쓰기 금지 */}
      <CountBadge count={1} style={{ color: "red" }} />
    </>
  );
}
