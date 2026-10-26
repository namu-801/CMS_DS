import { fireEvent, render, screen } from "@testing-library/react";
import { LeftNavigationBar, NavItem, PageTitle, TopBar, TopBarAction } from "./Navigation";

const GROUPS = [
  { title: "모니터링", items: [{ value: "dashboard", icon: "navigation_dashboard_filled", label: "대시보드", href: "/dashboard" }, { value: "vehicle", icon: "navigation_vehicle_filled", label: "차량관리", href: "/vehicle" }] },
  { title: "콘텐츠 설정", items: [{ value: "content", icon: "navigation_content_filled", label: "콘텐츠 관리", href: "/content" }] },
] as const;

describe("LeftNavigationBar", () => {
  it("이름 있는 nav, 묶음 제목, 지금 메뉴만 aria-current=page", () => {
    render(<LeftNavigationBar groups={GROUPS} currentValue="content" logo={<span>M-CMS</span>} />);
    expect(screen.getByRole("navigation", { name: "주 메뉴" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "모니터링" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "콘텐츠 관리" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "대시보드" })).not.toHaveAttribute("aria-current");
  });

  it("메뉴 항목은 아이콘 + 글자, href가 없으면 버튼", () => {
    const onClick = vi.fn();
    render(<NavItem icon="navigation_ota_filled" label="OTA 관리" onClick={onClick} />);
    const btn = screen.getByRole("button", { name: "OTA 관리" });
    expect(btn.querySelector('[data-icon="navigation_ota_filled"]')).not.toBeNull();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
});

describe("TopBar", () => {
  it("인사 글자, 알림·로그아웃(아이콘 + 글자 버튼)", () => {
    const onN = vi.fn(), onL = vi.fn();
    render(<TopBar greeting="안녕하세요, 마바산업님" avatarSrc="m.png" onNotificationClick={onN} onLogoutClick={onL} />);
    expect(screen.getByText("안녕하세요, 마바산업님")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "알림" }));
    fireEvent.click(screen.getByRole("button", { name: "로그아웃" }));
    expect(onN).toHaveBeenCalled();
    expect(onL).toHaveBeenCalled();
  });
  it("TopBarAction 기본 글자", () => {
    render(<TopBarAction action="logout" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "로그아웃" })).toHaveAttribute("data-action", "logout");
  });
});

describe("PageTitle", () => {
  it("h1 제목과 설명", () => {
    render(<PageTitle title="콘텐츠 관리" description="콘텐츠들을 생성하고 업로드해 주세요." />);
    expect(screen.getByRole("heading", { level: 1, name: "콘텐츠 관리" })).toBeInTheDocument();
    expect(screen.getByText("콘텐츠들을 생성하고 업로드해 주세요.")).toBeInTheDocument();
  });
});

export function typeContract() {
  return (
    <>
      {/* @ts-expect-error 메뉴 아이콘은 Figma 추천 목록만 */}
      <NavItem icon="action_plus" label="x" />
      {/* @ts-expect-error Figma Action은 notification/logout만 */}
      <TopBarAction action="settings" onClick={() => {}} />
      {/* @ts-expect-error 제목은 필수 */}
      <PageTitle description="x" />
    </>
  );
}
