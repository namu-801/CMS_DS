import { fireEvent, render, screen } from "@testing-library/react";
import { Pagination, pageItems } from "./Pagination";

describe("pageItems: 번호 최대 5개", () => {
  it("5쪽 이하면 모두", () => expect(pageItems(1, 3)).toEqual([1, 2, 3]));
  it("앞쪽", () => expect(pageItems(2, 20)).toEqual([1, 2, 3, 4, "ellipsis-end", 20]));
  it("가운데", () => expect(pageItems(10, 20)).toEqual([1, "ellipsis-start", 9, 10, 11, "ellipsis-end", 20]));
  it("뒤쪽", () => expect(pageItems(19, 20)).toEqual([1, "ellipsis-start", 17, 18, 19, 20]));
});

describe("Pagination", () => {
  it("nav 이름, 지금 페이지는 aria-current", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByRole("navigation", { name: "페이지 이동" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1페이지" })).toHaveAttribute("aria-current", "page");
  });

  it("첫 페이지에서 이전은 비활성, 다음은 다음 페이지로", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("마지막 페이지에서 다음은 비활성", () => {
    render(<Pagination page={3} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
  });

  it("번호를 누르면 그 페이지로, 지금 페이지를 누르면 아무 일 없음", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "3페이지" }));
    fireEvent.click(screen.getByRole("button", { name: "2페이지" }));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});

export function typeContract() {
  return (
    <>
      {/* @ts-expect-error 전체 페이지 수는 필수 */}
      <Pagination page={1} onPageChange={() => {}} />
      {/* @ts-expect-error 페이지는 숫자 */}
      <Pagination page="1" totalPages={3} onPageChange={() => {}} />
    </>
  );
}
