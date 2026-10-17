import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import styles from "./TextField.module.css";

/** Figma `Size` → `size`. 높이 32 / 40 / 48 / 52 (Button과 같은 이름·높이) */
export const TEXT_FIELD_SIZES = ["xsmall", "small", "medium", "large"] as const;
export type TextFieldSize = (typeof TEXT_FIELD_SIZES)[number];

/** Figma `State=Error`, `State=Success` → `status`. 나머지 상태(Hover·Focus)는 브라우저가, Disabled는 `disabled`가 정합니다. */
export const TEXT_FIELD_STATUSES = ["error", "success"] as const;
export type TextFieldStatus = (typeof TEXT_FIELD_STATUSES)[number];

/** 한 줄 입력창에서 쓰는 입력 종류만 허용합니다(여러 줄·숫자 조절·날짜는 다른 컴포넌트). */
export const TEXT_FIELD_TYPES = ["text", "email", "password", "search", "tel", "url"] as const;
export type TextFieldType = (typeof TEXT_FIELD_TYPES)[number];

/** Figma `Trailing Icon` + `Trailing Icon Swap`. 코드에서는 누르는 버튼이라 이름(label)과 동작이 필요합니다. */
export interface TextFieldTrailingAction {
  icon: IconName;
  /** 버튼 이름(필수). 스크린리더 이름과 툴팁 */
  label: string;
  onClick: () => void;
}

const SIZE_CLASS: Record<TextFieldSize, string> = {
  xsmall: styles.xsmall,
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "style" | "children" | "type" | "disabled" | "required" | "aria-invalid" | "aria-describedby" | "aria-required"
>;

export interface TextFieldProps extends NativeInputProps {
  /** 제목(필수). Figma `Label Text`. 화면에 안 보이게 하려면 `hideLabel` */
  label: string;
  /** Figma `Label`을 끈 상태. 제목을 화면에서 숨기되 스크린리더는 읽습니다(예: 로그인) */
  hideLabel?: boolean;
  /** Figma `Required`. 제목 옆 "(필수)"와 aria-required */
  required?: boolean;
  /** Figma `Size`. 기본 "small" */
  size?: TextFieldSize;
  /** Figma `State=Error | Success`. 테두리와 아래 문구 색이 바뀝니다 */
  status?: TextFieldStatus;
  /** Figma `Message` + `Message Text`. 칸 아래 문구(안내·오류·성공) */
  message?: string;
  /** Figma `State=Disabled` */
  disabled?: boolean;
  /** Figma `Leading Icon` + `Leading Icon Swap`. 누르지 않는 아이콘(예: 검색) */
  leadingIcon?: IconName;
  /** Figma `Trailing Icon` + `Trailing Icon Swap`. 칸 뒤 IconButton(예: 비밀번호 보기) */
  trailingAction?: TextFieldTrailingAction;
  /** 기본 "text" */
  type?: TextFieldType;
  /** 배치(margin, grid 위치, 너비)용. 색·크기를 바꾸는 데 쓰지 않습니다 */
  className?: string;
}

/** 한 줄 입력창. Figma `TextField` 세트(188:16373)와 같은 규칙입니다. 너비는 부모를 채웁니다. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    hideLabel = false,
    required = false,
    size = "small",
    status,
    message,
    disabled = false,
    leadingIcon,
    trailingAction,
    type = "text",
    className,
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `tf-${autoId}`;
  const messageId = message ? `${inputId}-message` : undefined;

  return (
    <div
      className={[styles.root, SIZE_CLASS[size], status && styles[status], disabled && styles.disabled, className]
        .filter(Boolean)
        .join(" ")}
      data-size={size}
      data-status={status}
    >
      <label htmlFor={inputId} className={[styles.labelRow, hideLabel && styles.visuallyHidden].filter(Boolean).join(" ")}>
        <span className={styles.label}>{label}</span>
        {required && (
          <span className={styles.required} aria-hidden="true">
            (필수)
          </span>
        )}
      </label>
      <div className={styles.field}>
        {leadingIcon && <Icon name={leadingIcon} size="medium" className={styles.icon} />}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={styles.input}
          {...rest}
          disabled={disabled}
          aria-required={required || undefined}
          aria-invalid={status === "error" || undefined}
          aria-describedby={messageId}
        />
        {trailingAction && (
          <IconButton
            variant="plain"
            size={24}
            iconSize={24}
            iconColor="default"
            icon={trailingAction.icon}
            label={trailingAction.label}
            onClick={trailingAction.onClick}
            disabled={disabled}
          />
        )}
      </div>
      {message && (
        <p id={messageId} className={styles.message}>
          {message}
        </p>
      )}
    </div>
  );
});
