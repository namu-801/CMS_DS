import { fireEvent, render, screen, within } from "@testing-library/react";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "./Table";

function Sample({ onRow = () => {}, onButton = () => {}, onRadio = () => {} }) {
  return (
    <Table caption="콘텐츠 목록">
      <TableHead>
        <TableHeaderCell>콘텐츠 명</TableHeaderCell>
        <TableHeaderCell>다운로드</TableHeaderCell>
        <TableHeaderCell hideLabel>할당</TableHeaderCell>
      </TableHead>
      <TableBody>
        <TableRow selected onClick={onRow}>
          <TableCell radio={{ name: "content", checked: true, onChange: onRadio, label: "시설 안내 영상 선택" }} leading={{ type: "icon", name: "media_video_filled" }}>
            시설 안내 영상
          </TableCell>
          <TableCell trailing={{ type: "statusText", status: "success", text: "다운로드 성공" }} />
          <TableCell trailing={{ type: "button", label: "할당하기", onClick: onButton, icon: "arrow_right" }} />
        </TableRow>
        <TableRow disabled>
          <TableCell radio={{ name: "content", checked: false, onChange: onRadio, label: "외관 선택", disabled: true }} leading={{ type: "avatar", src: "a.png" }}>
            김마바
          </TableCell>
          <TableCell leading={{ type: "eventLabel", level: "danger" }} trailing={{ type: "count", count: 2 }}>
            네트워크 오류
          </TableCell>
          <TableCell chevron indent>
            차고지-01
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("표 이름은 caption(화면에서 숨김), 머리 칸은 열 머리", () => {
    render(<Sample />);
    expect(screen.getByRole("table", { name: "콘텐츠 목록" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "콘텐츠 명" })).toHaveAttribute("scope", "col");
    expect(screen.getByText("할당")).toHaveClass("visuallyHidden");
  });

  it("행 상태는 행 전체에(선택·비활성)", () => {
    render(<Sample />);
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveAttribute("data-state", "selected");
    expect(rows[2]).toHaveAttribute("data-state", "disabled");
    expect(rows[2]).toHaveAttribute("aria-disabled", "true");
  });

  it("행을 누르면 onClick, 칸 안 버튼은 행을 누르지 않음", () => {
    const onRow = vi.fn(), onButton = vi.fn();
    render(<Sample onRow={onRow} onButton={onButton} />);
    fireEvent.click(screen.getByRole("button", { name: "할당하기" }));
    expect(onButton).toHaveBeenCalled();
    expect(onRow).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("시설 안내 영상"));
    expect(onRow).toHaveBeenCalled();
  });

  it("라디오는 이름이 있고, 비활성 행의 라디오는 비활성", () => {
    render(<Sample />);
    expect(screen.getByRole("radio", { name: "시설 안내 영상 선택" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "외관 선택" })).toBeDisabled();
  });

  it("앞·뒤 부품: 아이콘, 아바타, 이벤트 라벨, 상태 글자, +N", () => {
    render(<Sample />);
    const rows = screen.getAllByRole("row");
    expect(rows[1].querySelector('[data-icon="media_video_filled"]')).not.toBeNull();
    expect(within(rows[1]).getByText("다운로드 성공")).toBeInTheDocument();
    expect(rows[2].querySelector("img")).toHaveAttribute("alt", "");
    expect(within(rows[2]).getByText("위험")).toBeInTheDocument();
    expect(within(rows[2]).getByText("외 2개")).toBeInTheDocument();
    expect(rows[2].querySelector('[data-icon="arrow_right"]')).not.toBeNull();
  });
});

export function typeContract() {
  return (
    <>
      {/* @ts-expect-error Leading 아이콘은 Figma 추천 목록만 */}
      <TableCell leading={{ type: "icon", name: "action_plus" }} />
      {/* @ts-expect-error Trailing Swap에 없는 부품 */}
      <TableCell trailing={{ type: "dropdown" }} />
      {/* @ts-expect-error 태그 종류는 Tag 값만 */}
      <TableCell trailing={{ type: "tag", tagType: "red", text: "x" }} />
      {/* @ts-expect-error 칸 글자는 문자열 */}
      <TableCell><b>x</b></TableCell>
      {/* @ts-expect-error 표 이름(caption)은 필수 */}
      <Table><tbody /></Table>
    </>
  );
}
