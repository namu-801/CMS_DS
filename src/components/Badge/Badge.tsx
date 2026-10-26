import { Icon, type IconName } from "@/components/Icon";
import styles from "./Badge.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- Tag (Figma `Tag`) ---------- */

/** Figma `Type` → `type` */
export const TAG_TYPES = ["gps", "time", "repeat", "repeat-off"] as const;
export type TagType = (typeof TAG_TYPES)[number];

const TAG_ICON: Record<TagType, IconName> = {
  gps: "location_pin_filled",
  time: "object_time",
  repeat: "media_repeat",
  "repeat-off": "media_repeat_off",
};
const TAG_CLASS: Record<TagType, string> = { gps: styles.gps, time: styles.time, repeat: styles.neutral, "repeat-off": styles.neutral };

export interface TagProps {
  /** Figma `Type`. 아이콘과 색이 함께 정해짐 */
  type: TagType;
  /** Figma `Text`. 태그 글자(필수, 글자만) */
  children: string;
  className?: string;
}

/** 분류 태그(GPS·시간·반복). 누를 수 없는 표시입니다. Figma `Tag` 세트(235:15998). */
export function Tag({ type, children, className }: TagProps) {
  return (
    <span className={cx(styles.tag, TAG_CLASS[type], className)} data-type={type}>
      <Icon name={TAG_ICON[type]} size="small" />
      <span className={styles.label}>{children}</span>
    </span>
  );
}

/* ---------- Status Badge (Figma `Status Badge`) ---------- */

/** Figma `Status` → `status` */
export const STATUS_BADGE_STATUSES = ["positive", "negative"] as const;
export type StatusBadgeStatus = (typeof STATUS_BADGE_STATUSES)[number];
/** Figma 종류별 기본 글자 */
const STATUS_BADGE_TEXT: Record<StatusBadgeStatus, string> = { positive: "운행중", negative: "운행종료" };

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  /** 없으면 종류별 기본 글자(운행중·운행종료) */
  children?: string;
  className?: string;
}

/** 운행 상태 알약. Figma `Status Badge` 세트(235:16005). */
export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span className={cx(styles.pill, styles[status], className)} data-status={status}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{children ?? STATUS_BADGE_TEXT[status]}</span>
    </span>
  );
}

/* ---------- Status Text (Figma `Status Text`) ---------- */

export const STATUS_TEXT_STATUSES = ["success", "fail"] as const;
export type StatusTextStatus = (typeof STATUS_TEXT_STATUSES)[number];
const STATUS_TEXT_TEXT: Record<StatusTextStatus, string> = { success: "성공", fail: "실패" };
const STATUS_TEXT_ICON: Record<StatusTextStatus, IconName> = { success: "status_success_filled", fail: "status_fail_filled" };

export interface StatusTextProps {
  status: StatusTextStatus;
  /** 없으면 종류별 기본 글자(성공·실패) */
  children?: string;
  className?: string;
}

/** 처리 결과 글자(아이콘 + 글자, 배경 없음). Figma `Status Text` 세트(235:16017). */
export function StatusText({ status, children, className }: StatusTextProps) {
  return (
    <span className={cx(styles.statusText, styles[status], className)} data-status={status}>
      <Icon name={STATUS_TEXT_ICON[status]} size="small" />
      <span className={styles.label}>{children ?? STATUS_TEXT_TEXT[status]}</span>
    </span>
  );
}

/* ---------- Event Label (Figma `Event Label`) ---------- */

export const EVENT_LABEL_LEVELS = ["danger", "warning", "caution"] as const;
export type EventLabelLevel = (typeof EVENT_LABEL_LEVELS)[number];
const EVENT_LABEL_TEXT: Record<EventLabelLevel, string> = { danger: "위험", warning: "경고", caution: "주의" };

export interface EventLabelProps {
  level: EventLabelLevel;
  /** 없으면 종류별 기본 글자(위험·경고·주의) */
  children?: string;
  className?: string;
}

/** 이벤트 단계 라벨. Figma `Event Label` 세트(242:16052). 옆에 이벤트 글자("네트워크 오류" 등)를 함께 둡니다. */
export function EventLabel({ level, children, className }: EventLabelProps) {
  return (
    <span className={cx(styles.eventLabel, styles[level], className)} data-level={level}>
      {children ?? EVENT_LABEL_TEXT[level]}
    </span>
  );
}

/* ---------- Count Badge (Figma `Count Badge`) ---------- */

export interface CountBadgeProps {
  /** 더 있는 개수. "+{count}"로 보여 줌 */
  count: number;
  className?: string;
}

/** "더 있음" 개수. Figma `Count Badge`(242:16053). 스크린리더는 "외 N개"로 읽습니다. */
export function CountBadge({ count, className }: CountBadgeProps) {
  return (
    <span className={cx(styles.count, className)}>
      <span aria-hidden="true">+{count}</span>
      <span className={styles.visuallyHidden}>외 {count}개</span>
    </span>
  );
}
