import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/Button";
import { Pictogram, type PictogramName } from "@/components/Icon";
import styles from "./Modal.module.css";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** 열린 동안 포커스를 안에 가두고, 닫히면 연 버튼으로 되돌립니다. */
function useFocusTrap(open: boolean, ref: RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? ref.current)?.focus();
    return () => prev?.focus?.();
  }, [open, ref]);
  return (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !ref.current) return;
    const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
}

/* ---------- 입력 팝업 (Figma Modal Header + 본문 + Modal Footer) ---------- */

/** 팝업 크기. Foundation `Size/Width/Dialog*` 400·680·1100 */
export const DIALOG_SIZES = ["small", "medium", "large"] as const;
export type DialogSize = (typeof DIALOG_SIZES)[number];

export interface DialogProps {
  open: boolean;
  /** 취소·Esc로 닫을 때 */
  onClose: () => void;
  /** Figma `Modal Header`의 `Title` */
  title: string;
  /** 기본 "small" */
  size?: DialogSize;
  /** 본문(팝업마다 다름) */
  children: ReactNode;
  /** Figma `Modal Footer` 오른쪽 버튼(Primary). 기본 "저장" */
  confirmLabel?: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  /** 왼쪽 버튼(Neutral). 기본 "취소" */
  cancelLabel?: string;
}

/** 입력을 받는 팝업. Figma `Modal Header`·`Modal Footer`(247:16197)와 크기 규칙. 덮개를 눌러도 닫히지 않습니다(입력 내용 보호). */
export function Dialog({ open, onClose, title, size = "small", children, confirmLabel = "저장", onConfirm, confirmDisabled, cancelLabel = "취소" }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const trap = useFocusTrap(open, ref);
  if (!open) return null;
  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[styles.dialog, styles[size]].join(" ")}
        data-size={size}
        onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } trap(e); }}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>{title}</h2>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <Button variant="neutral" size="small" onClick={onClose}>{cancelLabel}</Button>
          <Button variant="primary" size="small" onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ---------- 확인 모달 (Figma Alert Dialog) ---------- */

/** Figma `Type` → `type` */
export const ALERT_DIALOG_TYPES = ["warning", "success", "error"] as const;
export type AlertDialogType = (typeof ALERT_DIALOG_TYPES)[number];
const PICTOGRAM: Record<AlertDialogType, PictogramName> = {
  warning: "pictogram_status_warning_filled",
  success: "pictogram_status_success_filled",
  error: "pictogram_status_error_filled",
};

export interface AlertDialogProps {
  open: boolean;
  /** Figma `Type` */
  type: AlertDialogType;
  /** Figma `Title` */
  title: string;
  /** Figma `Description` + `Description Text`. 없으면 설명 없음 */
  description?: string;
  /** 오른쪽(또는 하나뿐인) 버튼 글자. 예: "확인", "삭제", "다시 시도" */
  confirmLabel: string;
  onConfirm: () => void;
  /** 주면 버튼 2개(Figma `Buttons=Two`), 없으면 1개(`One`) */
  cancelLabel?: string;
  onCancel?: () => void;
  /** 삭제 최종 확인이면 빨간 버튼(Destructive). 기본: 경고 + 버튼 2개일 때 true */
  destructive?: boolean;
}

/** 결과를 알리거나 확인을 받는 모달. Figma `Alert Dialog`(247:16346). 버튼으로만 닫힙니다(취소가 있으면 Esc = 취소). */
export function AlertDialog({ open, type, title, description, confirmLabel, onConfirm, cancelLabel, onCancel, destructive }: AlertDialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const trap = useFocusTrap(open, ref);
  if (!open) return null;
  const two = cancelLabel !== undefined;
  const isDestructive = destructive ?? (type === "warning" && two);
  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={styles.alert}
        data-type={type}
        onKeyDown={(e) => { if (e.key === "Escape" && two) { e.stopPropagation(); onCancel?.(); } trap(e); }}
      >
        <div className={styles.alertContent}>
          <Pictogram name={PICTOGRAM[type]} />
          <div className={styles.alertText}>
            <h2 id={titleId} className={styles.alertTitle}>{title}</h2>
            {description && <p id={descId} className={styles.alertDescription}>{description}</p>}
          </div>
        </div>
        <div className={styles.alertButtons} data-buttons={two ? "two" : "one"}>
          {two && <Button variant="neutral" size="small" onClick={onCancel}>{cancelLabel}</Button>}
          <Button variant={isDestructive ? "destructive" : "primary"} size="small" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
