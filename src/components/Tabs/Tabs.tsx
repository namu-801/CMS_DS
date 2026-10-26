import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Tabs.module.css";

/** Figma `Orientation` → `orientation` */
export const TABS_ORIENTATIONS = ["horizontal", "vertical"] as const;
export type TabsOrientation = (typeof TABS_ORIENTATIONS)[number];

export interface TabItem {
  value: string;
  /** Figma `Text` */
  label: string;
  /** Figma `State=Disabled` */
  disabled?: boolean;
  /** 이 탭을 고르면 보이는 내용. 없으면 탭 묶음만 그림(내용은 화면이 그림) */
  content?: ReactNode;
}

export interface TabsProps {
  /** 탭 묶음 이름(필수). 화면에 보이지 않고 스크린리더가 읽음 */
  label: string;
  items: readonly TabItem[];
  /** 고른 탭(제어 방식) */
  value?: string;
  /** 처음 탭(비제어 방식). 없으면 첫 번째 탭 */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Figma `Orientation`. 기본 "horizontal" */
  orientation?: TabsOrientation;
  className?: string;
}

/** 같은 자리에서 내용을 바꿔 보여 주는 탭. Figma `Tab`·`Tab List`(237:16027)와 같은 규칙입니다. */
export function Tabs({ label, items, value, defaultValue, onValueChange, orientation = "horizontal", className }: TabsProps) {
  const autoId = useId();
  const firstEnabled = items.find((i) => !i.disabled)?.value;
  const [inner, setInner] = useState(defaultValue ?? firstEnabled);
  const current = value !== undefined ? value : inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };

  const enabledIdx = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
  const move = (from: number, dir: 1 | -1 | "first" | "last") => {
    const pos = enabledIdx.indexOf(from);
    let next: number;
    if (dir === "first") next = enabledIdx[0];
    else if (dir === "last") next = enabledIdx[enabledIdx.length - 1];
    else next = enabledIdx[(pos + dir + enabledIdx.length) % enabledIdx.length];
    refs.current[next]?.focus();
    select(items[next].value);
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (e.key === nextKey) { e.preventDefault(); move(index, 1); }
    else if (e.key === prevKey) { e.preventDefault(); move(index, -1); }
    else if (e.key === "Home") { e.preventDefault(); move(index, "first"); }
    else if (e.key === "End") { e.preventDefault(); move(index, "last"); }
  };

  const selected = items.find((i) => i.value === current);

  return (
    <div className={[styles.root, styles[orientation], className].filter(Boolean).join(" ")} data-orientation={orientation}>
      <div role="tablist" aria-label={label} aria-orientation={orientation} className={styles.list}>
        {items.map((it, i) => {
          const isSel = it.value === current;
          return (
            <button
              key={it.value}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${autoId}-tab-${it.value}`}
              aria-selected={isSel}
              aria-controls={it.content !== undefined ? `${autoId}-panel-${it.value}` : undefined}
              tabIndex={isSel ? 0 : -1}
              disabled={it.disabled}
              className={styles.tab}
              data-state={it.disabled ? "disabled" : isSel ? "selected" : "default"}
              onClick={() => select(it.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className={styles.text}>{it.label}</span>
            </button>
          );
        })}
      </div>
      {selected?.content !== undefined && (
        <div role="tabpanel" id={`${autoId}-panel-${selected.value}`} aria-labelledby={`${autoId}-tab-${selected.value}`} tabIndex={0} className={styles.panel}>
          {selected.content}
        </div>
      )}
    </div>
  );
}
