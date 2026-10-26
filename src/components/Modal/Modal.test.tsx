import { fireEvent, render, screen } from "@testing-library/react";
import { AlertDialog, Dialog } from "./Modal";

describe("Dialog (입력 팝업)", () => {
  it("닫혀 있으면 그리지 않는다", () => {
    render(<Dialog open={false} onClose={() => {}} onConfirm={() => {}} title="차량등록">본문</Dialog>);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("제목이 이름인 dialog, 열리면 포커스가 안으로", () => {
    render(<Dialog open onClose={() => {}} onConfirm={() => {}} title="차량등록" size="medium">본문</Dialog>);
    const dlg = screen.getByRole("dialog", { name: "차량등록" });
    expect(dlg).toHaveAttribute("aria-modal", "true");
    expect(dlg).toHaveAttribute("data-size", "medium");
    expect(dlg.contains(document.activeElement)).toBe(true);
  });

  it("취소·Esc는 onClose, 저장은 onConfirm", () => {
    const onClose = vi.fn(), onConfirm = vi.fn();
    render(<Dialog open onClose={onClose} onConfirm={onConfirm} title="시간 설정">본문</Dialog>);
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

describe("AlertDialog (확인 모달)", () => {
  it("alertdialog, 제목·설명 연결, 버튼 2개", () => {
    render(<AlertDialog open type="warning" title="정말 삭제하시겠습니까?" description="되돌릴 수 없습니다." confirmLabel="삭제" onConfirm={() => {}} cancelLabel="취소" onCancel={() => {}} />);
    const dlg = screen.getByRole("alertdialog", { name: "정말 삭제하시겠습니까?" });
    expect(dlg).toHaveAccessibleDescription("되돌릴 수 없습니다.");
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("경고 + 버튼 2개면 확인 버튼이 빨간 Destructive", () => {
    render(<AlertDialog open type="warning" title="삭제" confirmLabel="삭제" onConfirm={() => {}} cancelLabel="취소" onCancel={() => {}} />);
    expect(screen.getByRole("button", { name: "삭제" })).toHaveClass("destructive");
  });

  it("버튼 1개면 Esc로 닫히지 않음, 2개면 Esc = 취소", () => {
    const onCancel = vi.fn();
    const { rerender } = render(<AlertDialog open type="success" title="완료" confirmLabel="확인" onConfirm={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    rerender(<AlertDialog open type="error" title="실패" confirmLabel="다시 시도" onConfirm={() => {}} cancelLabel="취소" onCancel={onCancel} />);
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "다시 시도" })).toHaveClass("primary");
  });
});

export function typeContract() {
  return (
    <>
      {/* @ts-expect-error 팝업 크기는 small/medium/large만 */}
      <Dialog open onClose={() => {}} onConfirm={() => {}} title="x" size="xl">본문</Dialog>
      {/* @ts-expect-error Figma Type은 warning/success/error만 */}
      <AlertDialog open type="info" title="x" confirmLabel="확인" onConfirm={() => {}} />
      {/* @ts-expect-error 제목은 필수 */}
      <AlertDialog open type="success" confirmLabel="확인" onConfirm={() => {}} />
    </>
  );
}
