import { createContext, useContext, useId, useState, type ReactNode } from "react";
import styles from "./Radio.module.css";

/** 묶음 배치. Figma에는 묶음 컴포넌트가 없고, 화면에서 Radio를 나란히 놓는 방식과 같습니다(가로 간격 20, 세로 간격 12). */
export const RADIO_GROUP_ORIENTATIONS = ["horizontal", "vertical"] as const;
export type RadioGroupOrientation = (typeof RADIO_GROUP_ORIENTATIONS)[number];

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  select: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /** 묶음 이름(필수). 스크린리더가 "○○, 라디오 그룹"으로 읽습니다 */
  label: string;
  /** 묶음 이름을 화면에서만 숨김(화면에 제목을 따로 배치할 때) */
  hideLabel?: boolean;
  /** 선택된 값(제어 방식). 주지 않으면 defaultValue로 시작해 내부에서 관리 */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 기본 "horizontal" */
  orientation?: RadioGroupOrientation;
  /** 묶음 전체 비활성 */
  disabled?: boolean;
  /** 폼 제출 이름. 주지 않으면 자동 */
  name?: string;
  /** Radio들 */
  children: ReactNode;
  /** 배치(margin, grid 위치)용 */
  className?: string;
}

/** 하나만 고르는 묶음. 같은 name의 네이티브 라디오라 키보드 화살표 이동이 기본으로 됩니다. */
export function RadioGroup({
  label,
  hideLabel = false,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  disabled = false,
  name,
  children,
  className,
}: RadioGroupProps) {
  const autoId = useId();
  const labelId = `rg-${autoId}-label`;
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const select = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-disabled={disabled || undefined}
      className={[styles.group, className].filter(Boolean).join(" ")}
      data-orientation={orientation}
    >
      <span id={labelId} className={[styles.groupLabel, hideLabel && styles.visuallyHidden].filter(Boolean).join(" ")}>
        {label}
      </span>
      <div className={[styles.options, styles[orientation]].join(" ")}>
        <RadioGroupContext.Provider value={{ name: name ?? `rg-${autoId}`, value: current, disabled, select }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
    </div>
  );
}

export interface RadioProps {
  /** 이 선택지의 값(필수) */
  value: string;
  /** 선택지 글자(필수). Figma `Label Text` */
  label: string;
  /** Figma `Label`을 끈 상태. 글자를 화면에서만 숨기고 스크린리더는 읽음(예: 표 행). 클릭 영역은 32로 넓어짐 */
  hideLabel?: boolean;
  /** Figma `State=Disabled` */
  disabled?: boolean;
  /** 배치용 */
  className?: string;
}

/** 라디오 하나. Figma `Radio` 세트(204:15904)와 같은 규칙입니다. 반드시 RadioGroup 안에서 씁니다. */
export function Radio({ value, label, hideLabel = false, disabled = false, className }: RadioProps) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error("Radio는 RadioGroup 안에서만 쓸 수 있습니다.");
  const isDisabled = group.disabled || disabled;
  const checked = group.value === value;

  return (
    <label
      className={[styles.radio, hideLabel && styles.iconOnly, isDisabled && styles.disabled, className]
        .filter(Boolean)
        .join(" ")}
      data-selected={checked ? "on" : "off"}
    >
      <input
        type="radio"
        className={styles.input}
        name={group.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={() => {
          if (!isDisabled) group.select(value);
        }}
      />
      <span className={styles.control} aria-hidden="true">
        <span className={styles.dot} />
      </span>
      <span className={[styles.text, hideLabel && styles.visuallyHidden].filter(Boolean).join(" ")}>{label}</span>
    </label>
  );
}
