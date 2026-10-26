import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/Icon";
import styles from "./Dropdown.module.css";

/** Figma `Size` → `size`. small 40, medium 48 */
export const DROPDOWN_SIZES = ["small", "medium"] as const;
export type DropdownSize = (typeof DROPDOWN_SIZES)[number];

export interface DropdownOption {
  /** 값(폼 제출·onValueChange에 쓰임) */
  value: string;
  /** 목록과 칸에 보이는 글자. Figma `Dropdown Option`의 `Text` */
  label: string;
}

export interface DropdownProps {
  /** 무엇을 고르는 칸인지(필수). 스크린리더가 읽음. 화면 시안처럼 제목을 숨기려면 hideLabel */
  label: string;
  /** 제목을 화면에서만 숨김(지금 시안의 필터·글꼴 칸) */
  hideLabel?: boolean;
  /** 선택지 목록 */
  options: readonly DropdownOption[];
  /** 고른 값(제어 방식). 값이 없으면 안내 문구(Figma `Value=Empty`) */
  value?: string;
  /** 처음 값(비제어 방식) */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 안내 문구. Figma `Text` 기본값 */
  placeholder?: string;
  /** Figma `Size`. 기본 "medium" */
  size?: DropdownSize;
  /** Figma `State=Disabled` */
  disabled?: boolean;
  /** 폼 제출 이름. 주면 숨은 input에 값이 들어감 */
  name?: string;
  id?: string;
  /** 배치(너비, margin)용 */
  className?: string;
}

/** 목록에서 값 하나를 고르는 드롭다운. Figma `Dropdown`·`Dropdown Option`·`Dropdown Menu`(232:15968)와 같은 규칙입니다. */
export function Dropdown({
  label,
  hideLabel = false,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "선택해 주세요",
  size = "medium",
  disabled = false,
  name,
  id,
  className,
}: DropdownProps) {
  const autoId = useId();
  const baseId = id ?? `dd-${autoId}`;
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const selectedIndex = options.findIndex((o) => o.value === current);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", time: 0 });

  const choose = (index: number) => {
    const opt = options[index];
    if (!opt) return;
    if (value === undefined) setInner(opt.value);
    onValueChange?.(opt.value);
    setOpen(false);
  };
  const openList = (start: number) => {
    if (disabled || options.length === 0) return;
    setOpen(true);
    setActive(Math.max(0, Math.min(options.length - 1, start)));
  };

  // 바깥을 누르면 닫음
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // 가리킨 선택지가 목록 안에서 보이게
  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(`${baseId}-opt-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [open, active, baseId]);

  const findByChar = (char: string) => {
    const now = Date.now();
    const t = typeahead.current;
    t.text = now - t.time < 500 ? t.text + char : char;
    t.time = now;
    const from = open ? active : selectedIndex;
    const n = options.length;
    for (let k = 1; k <= n; k++) {
      const i = (from + k + n) % n;
      if (options[i].label.toLowerCase().startsWith(t.text.toLowerCase())) return i;
    }
    return -1;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "Enter", " "].includes(e.key)) { e.preventDefault(); openList(selectedIndex < 0 ? 0 : selectedIndex); }
      else if (e.key === "ArrowUp") { e.preventDefault(); openList(selectedIndex < 0 ? 0 : selectedIndex); }
      else if (e.key === "Home") { e.preventDefault(); openList(0); }
      else if (e.key === "End") { e.preventDefault(); openList(last); }
      else if (e.key.length === 1 && /\S/.test(e.key)) { const i = findByChar(e.key); if (i >= 0) openList(i); }
      return;
    }
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive((a) => Math.min(last, a + 1)); break;
      case "ArrowUp": e.preventDefault(); setActive((a) => Math.max(0, a - 1)); break;
      case "Home": e.preventDefault(); setActive(0); break;
      case "End": e.preventDefault(); setActive(last); break;
      case "PageDown": e.preventDefault(); setActive((a) => Math.min(last, a + 10)); break;
      case "PageUp": e.preventDefault(); setActive((a) => Math.max(0, a - 10)); break;
      case "Enter": case " ": e.preventDefault(); choose(active); break;
      case "Escape": e.preventDefault(); setOpen(false); break;
      case "Tab": choose(active); break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) { const i = findByChar(e.key); if (i >= 0) setActive(i); }
    }
  };

  const selected = options[selectedIndex];

  return (
    <div
      ref={rootRef}
      className={[styles.root, styles[size], open && styles.open, disabled && styles.disabled, className].filter(Boolean).join(" ")}
      data-size={size}
    >
      <span id={labelId} className={hideLabel ? styles.visuallyHidden : styles.label}>
        {label}
      </span>
      <div className={styles.anchor}>
        <button
          type="button"
          id={baseId}
          role="combobox"
          className={styles.field}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? `${baseId}-opt-${active}` : undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList(selectedIndex < 0 ? 0 : selectedIndex))}
          onKeyDown={onKeyDown}
        >
          <span className={selected ? styles.value : styles.placeholder} data-value={selected ? "filled" : "empty"}>
            {selected ? selected.label : placeholder}
          </span>
          <Icon name={open ? "arrow_up" : "arrow_down"} size="small" className={styles.arrow} />
        </button>
        <ul id={listId} role="listbox" aria-labelledby={labelId} className={styles.menu} hidden={!open}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${baseId}-opt-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              className={[styles.option, i === active && styles.active].filter(Boolean).join(" ")}
              onPointerMove={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              <span className={styles.optionLabel}>{o.label}</span>
              {i === selectedIndex && <Icon name="action_check" size="small" className={styles.check} />}
            </li>
          ))}
        </ul>
      </div>
      {name && <input type="hidden" name={name} value={current ?? ""} />}
    </div>
  );
}
