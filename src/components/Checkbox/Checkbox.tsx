import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import styles from "./Checkbox.module.css";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "size"
  | "style"
  | "children"
  | "checked"
  | "defaultChecked"
  | "onChange"
  | "disabled"
  | "aria-invalid"
  | "aria-describedby"
>;

export interface CheckboxProps extends NativeInputProps {
  /** 선택 항목 글자(필수). Figma `Label Text`. 일부만 굵은 글(약관 동의)도 넣을 수 있음 */
  label: ReactNode;
  /** Figma `Label`을 끈 상태. 글자를 화면에서만 숨기고 스크린리더는 읽음. 클릭 영역은 32로 넓어짐 */
  hideLabel?: boolean;
  /** Figma `Checked`. 제어 방식 */
  checked?: boolean;
  /** 처음 켜짐 여부(비제어 방식). 기본 false */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Figma `State=Disabled` */
  disabled?: boolean;
  /** Figma `Message` + `Message Text`. 아래 오류 문구(한 줄로 짧게). 주면 aria-invalid */
  message?: string;
  /** 배치(margin, grid 위치)용 */
  className?: string;
}

/** 항목 하나를 켜고 끄는 체크박스. Figma `Checkbox` 세트(213:15908)와 같은 규칙입니다. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hideLabel = false, checked, defaultChecked = false, onCheckedChange, disabled = false, message, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `cb-${autoId}`;
  const messageId = message ? `${inputId}-message` : undefined;
  const [inner, setInner] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : inner;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <label
        htmlFor={inputId}
        className={[styles.row, hideLabel && styles.iconOnly, disabled && styles.disabled].filter(Boolean).join(" ")}
        data-checked={isChecked ? "on" : "off"}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={styles.input}
          {...rest}
          checked={isChecked}
          disabled={disabled}
          aria-invalid={message ? true : undefined}
          aria-describedby={messageId}
          onChange={(e) => {
            if (disabled) return;
            if (checked === undefined) setInner(e.target.checked);
            onCheckedChange?.(e.target.checked);
          }}
        />
        <span className={styles.control} aria-hidden="true">
          <Icon name="action_check" size="small" className={styles.check} />
        </span>
        <span className={[styles.text, hideLabel && styles.visuallyHidden].filter(Boolean).join(" ")}>{label}</span>
      </label>
      {message && (
        <p id={messageId} className={styles.message}>
          {message}
        </p>
      )}
    </div>
  );
});
