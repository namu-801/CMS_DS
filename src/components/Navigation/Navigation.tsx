import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/Avatar";
import styles from "./Navigation.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- 메뉴 항목 (Figma Nav Item) ---------- */

/** Figma `Nav Item`의 `Icon` 추천 아이콘 */
export const NAV_ITEM_ICONS = [
  "navigation_dashboard_filled",
  "navigation_vehicle_filled",
  "navigation_content_filled",
  "navigation_content_group_filled",
  "navigation_assign",
  "navigation_ota_filled",
] as const;
export type NavItemIcon = (typeof NAV_ITEM_ICONS)[number];

export interface NavItemProps {
  /** Figma `Icon` */
  icon: NavItemIcon;
  /** Figma `Label` */
  label: string;
  /** Figma `State=Selected`(지금 화면) */
  selected?: boolean;
  /** 주면 링크(<a>), 없으면 버튼 */
  href?: string;
  onClick?: () => void;
}

/** 좌측 메뉴 항목. Figma `Nav Item`(269:16757). */
export function NavItem({ icon, label, selected = false, href, onClick }: NavItemProps) {
  const inner = (
    <>
      <Icon name={icon} size="medium" />
      <span className={styles.navLabel}>{label}</span>
    </>
  );
  const className = cx(styles.navItem, selected && styles.selected);
  return href ? (
    <a className={className} href={href} aria-current={selected ? "page" : undefined} onClick={onClick}>{inner}</a>
  ) : (
    <button type="button" className={className} aria-current={selected ? "page" : undefined} onClick={onClick}>{inner}</button>
  );
}

/* ---------- 좌측 네비게이션바 (Figma Left Navigation Bar) ---------- */

export interface NavGroup {
  /** 묶음 제목(모니터링, 콘텐츠 설정, OTA) */
  title: string;
  items: readonly (NavItemProps & { value: string })[];
}

export interface LeftNavigationBarProps {
  groups: readonly NavGroup[];
  /** 지금 화면 메뉴의 value. 그 항목만 Selected */
  currentValue?: string;
  /** 맨 위 로고(이미지 등) */
  logo?: ReactNode;
  /** 스크린리더용 이름. 기본 "주 메뉴" */
  label?: string;
  className?: string;
}

/** 모든 관리 화면 왼쪽의 메뉴. Figma `Left Navigation Bar`(250:16428). 너비 `Size/Width/Navigation`(260). */
export function LeftNavigationBar({ groups, currentValue, logo, label = "주 메뉴", className }: LeftNavigationBarProps) {
  return (
    <nav aria-label={label} className={cx(styles.bar, className)}>
      {logo && <div className={styles.logo}>{logo}</div>}
      <div className={styles.groups}>
        {groups.map((g) => (
          <section key={g.title} className={styles.group} aria-labelledby={`nav-group-${g.title}`}>
            <h2 id={`nav-group-${g.title}`} className={styles.groupTitle}>{g.title}</h2>
            <ul className={styles.items}>
              {g.items.map(({ value, ...item }) => (
                <li key={value}>
                  <NavItem {...item} selected={item.selected ?? value === currentValue} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}

/* ---------- 상단 바 (Figma Top Bar · Top Bar Action) ---------- */

/** Figma `Action` → `action` */
export const TOP_BAR_ACTIONS = ["notification", "logout"] as const;
export type TopBarActionType = (typeof TOP_BAR_ACTIONS)[number];
const ACTION_ICON = { notification: "navigation_notification", logout: "navigation_logout" } as const;
const ACTION_TEXT: Record<TopBarActionType, string> = { notification: "알림", logout: "로그아웃" };

export interface TopBarActionProps {
  action: TopBarActionType;
  onClick: () => void;
  /** 없으면 기본 글자(알림·로그아웃) */
  label?: string;
}

/** 상단 아이콘 + 글자 버튼. Figma `Top Bar Action`(250:16399). */
export function TopBarAction({ action, onClick, label }: TopBarActionProps) {
  return (
    <button type="button" className={styles.action} onClick={onClick} data-action={action}>
      <Icon name={ACTION_ICON[action]} size="medium" />
      <span>{label ?? ACTION_TEXT[action]}</span>
    </button>
  );
}

export interface TopBarProps {
  /** Figma `Greeting`. 예: "안녕하세요, 마바산업님" */
  greeting: string;
  /** 프로필 사진(Avatar Large 36) */
  avatarSrc: string;
  onNotificationClick: () => void;
  onLogoutClick: () => void;
  className?: string;
}

/** 화면 위 오른쪽 프로필·알림·로그아웃. Figma `Top Bar`(250:16469). 화면에 놓을 때는 남은 너비를 채웁니다. */
export function TopBar({ greeting, avatarSrc, onNotificationClick, onLogoutClick, className }: TopBarProps) {
  return (
    <header className={cx(styles.topBar, className)}>
      <div className={styles.profile}>
        <Avatar src={avatarSrc} alt="" size="large" />
        <span className={styles.greeting}>{greeting}</span>
      </div>
      <TopBarAction action="notification" onClick={onNotificationClick} />
      <TopBarAction action="logout" onClick={onLogoutClick} />
    </header>
  );
}

/* ---------- 화면 제목 (Figma Page Title) ---------- */

export interface PageTitleProps {
  /** Figma `Title` */
  title: string;
  /** Figma `Description` + `Description Text`. 없으면 설명 없음 */
  description?: string;
  className?: string;
}

/** 화면 맨 위 제목과 설명. Figma `Page Title`(250:16400). 화면마다 하나(h1). */
export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={cx(styles.pageTitle, className)}>
      <h1 className={styles.pageTitleText}>{title}</h1>
      {description && <p className={styles.pageDescription}>{description}</p>}
    </div>
  );
}
