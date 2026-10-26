import type { HTMLAttributes, KeyboardEvent, ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import {
  CountBadge,
  EventLabel,
  StatusBadge,
  StatusText,
  Tag,
  type EventLabelLevel,
  type StatusBadgeStatus,
  type StatusTextStatus,
  type TagType,
} from "@/components/Badge";
import radio from "@/components/Radio/Radio.module.css";
import styles from "./Table.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Figma `Leading Swap` 추천 아이콘(종류 아이콘 24, 상태 아이콘 20) */
export const TABLE_LEADING_ICONS = [
  "media_video_filled",
  "media_image_filled",
  "media_audio_filled",
  "media_text_filled",
  "location_pin_filled",
  "object_group_folder_filled",
  "navigation_display_filled",
  "status_success_filled",
  "status_fail_filled",
  "status_error_filled",
] as const;
export type TableLeadingIcon = (typeof TABLE_LEADING_ICONS)[number];
const STATUS_ICONS: readonly TableLeadingIcon[] = ["status_success_filled", "status_fail_filled", "status_error_filled"];

/** Figma `Leading` + `Leading Swap` → `leading` */
export type TableCellLeading =
  | { type: "icon"; name: TableLeadingIcon }
  | { type: "avatar"; src: string; alt?: string }
  | { type: "eventLabel"; level: EventLabelLevel; text?: string };

/** Figma `Trailing` + `Trailing Swap` → `trailing` */
export type TableCellTrailing =
  | { type: "tag"; tagType: TagType; text: string }
  | { type: "count"; count: number }
  | { type: "statusText"; status: StatusTextStatus; text?: string }
  | { type: "statusBadge"; status: StatusBadgeStatus; text?: string }
  | { type: "eventLabel"; level: EventLabelLevel; text?: string }
  | { type: "button"; label: string; onClick: () => void; icon?: "arrow_right" };

/* ---------- 표 ---------- */

export interface TableProps extends Omit<HTMLAttributes<HTMLTableElement>, "style"> {
  /** 표 이름(필수). 스크린리더용 caption으로 화면에서는 숨김 */
  caption: string;
  children: ReactNode;
}

/** 목록 표. Figma `Table Header Cell`·`Table Cell`(245:16050)과 같은 규칙입니다. 행 단위(`<tr>`)로 씁니다. */
export function Table({ caption, children, className, ...rest }: TableProps) {
  return (
    <table className={cx(styles.table, className)} {...rest}>
      <caption className={styles.visuallyHidden}>{caption}</caption>
      {children}
    </table>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

/* ---------- 머리 칸 (Figma Table Header Cell) ---------- */

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "style" | "children"> {
  /** Figma `Text`. 라디오·화살표만 있는 열은 화면에 빈 칸이고 이름은 스크린리더용(hideLabel) */
  children: string;
  hideLabel?: boolean;
}

export function TableHeaderCell({ children, hideLabel = false, className, ...rest }: TableHeaderCellProps) {
  return (
    <th scope="col" className={cx(styles.headerCell, className)} {...rest}>
      <span className={hideLabel ? styles.visuallyHidden : styles.text}>{children}</span>
    </th>
  );
}

/* ---------- 행 (Figma `State` 는 행 단위) ---------- */

export interface TableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, "style" | "onClick"> {
  /** Figma `State=Selected` */
  selected?: boolean;
  /** Figma `State=Disabled`(운행종료 차량 등) */
  disabled?: boolean;
  /** 행을 누르면 할 일(라디오 선택, 상세로 이동). 주면 마우스 올림 배경이 생기고 Enter로도 실행 */
  onClick?: () => void;
  children: ReactNode;
}

export function TableRow({ selected = false, disabled = false, onClick, className, children, ...rest }: TableRowProps) {
  const clickable = !!onClick && !disabled;
  return (
    <tr
      className={cx(styles.row, selected && styles.selected, disabled && styles.disabled, clickable && styles.clickable, className)}
      data-state={disabled ? "disabled" : selected ? "selected" : "default"}
      aria-selected={onClick ? selected : undefined}
      aria-disabled={disabled || undefined}
      onClick={clickable ? onClick : undefined}
      {...rest}
    >
      {children}
    </tr>
  );
}

/* ---------- 본문 칸 (Figma Table Cell) ---------- */

export interface TableCellRadio {
  /** 같은 표의 라디오끼리 같은 이름 */
  name: string;
  checked: boolean;
  onChange: () => void;
  /** 스크린리더용 이름(예: 행 이름 + " 선택") */
  label: string;
  /** 행이 비활성일 때 */
  disabled?: boolean;
}

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "style" | "children"> {
  /** Figma `Text`(+ `Label`). 없으면 글자 없음 */
  children?: string;
  /** Figma `Radio`. 행 선택 라디오 */
  radio?: TableCellRadio;
  /** Figma `Indent`. 하위 행 들여쓰기 */
  indent?: boolean;
  leading?: TableCellLeading;
  trailing?: TableCellTrailing;
  /** Figma `Chevron`. 행을 누르면 상세로 이동한다는 표시 */
  chevron?: boolean;
}

function Leading({ value }: { value: TableCellLeading }) {
  if (value.type === "icon") return <Icon name={value.name} size={STATUS_ICONS.includes(value.name) ? "small" : "medium"} />;
  if (value.type === "avatar") return <Avatar src={value.src} alt={value.alt ?? ""} size="small" />;
  return <EventLabel level={value.level}>{value.text}</EventLabel>;
}

function Trailing({ value }: { value: TableCellTrailing }) {
  switch (value.type) {
    case "tag": return <Tag type={value.tagType}>{value.text}</Tag>;
    case "count": return <CountBadge count={value.count} />;
    case "statusText": return <StatusText status={value.status}>{value.text}</StatusText>;
    case "statusBadge": return <StatusBadge status={value.status}>{value.text}</StatusBadge>;
    case "eventLabel": return <EventLabel level={value.level}>{value.text}</EventLabel>;
    case "button":
      return (
        <Button
          variant="secondary"
          size="small"
          iconRight={value.icon}
          onClick={(e) => { e.stopPropagation(); value.onClick(); }}
        >
          {value.label}
        </Button>
      );
  }
}

export function TableCell({ children, radio: r, indent = false, leading, trailing, chevron = false, className, ...rest }: TableCellProps) {
  return (
    <td className={cx(styles.cell, className)} {...rest}>
      <div className={styles.cellInner}>
        {r && (
          <label
            className={cx(radio.radio, radio.iconOnly, r.disabled && radio.disabled, styles.radio)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e: KeyboardEvent) => e.stopPropagation()}
          >
            <input type="radio" className={radio.input} name={r.name} checked={r.checked} disabled={r.disabled} onChange={() => { if (!r.disabled) r.onChange(); }} />
            <span className={radio.control} aria-hidden="true">
              <span className={radio.dot} />
            </span>
            <span className={radio.visuallyHidden}>{r.label}</span>
          </label>
        )}
        <div className={styles.content}>
          {indent && <span className={styles.indent} aria-hidden="true" />}
          {leading && <Leading value={leading} />}
          {children !== undefined && <span className={styles.text}>{children}</span>}
          {trailing && <Trailing value={trailing} />}
        </div>
        {chevron && <Icon name="arrow_right" size="medium" className={styles.chevron} />}
      </div>
    </td>
  );
}
