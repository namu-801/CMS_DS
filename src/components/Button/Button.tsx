import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { Icon, type IconName, type IconSize } from "@/components/Icon";
import styles from "./Button.module.css";

/** Figma `Style` → `variant` */
export const BUTTON_VARIANTS = ["primary", "secondary", "neutral", "outline", "outline-brand", "plain", "destructive"] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

/** Figma `Size` → `size` */
export const BUTTON_SIZES = ["xsmall", "small", "medium", "large", "xlarge"] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  neutral: styles.neutral,
  outline: styles.outline,
  "outline-brand": styles.outlineBrand,
  plain: styles.plain,
  destructive: styles.destructive,
};

/** 버튼 크기별 아이콘 크기(Figma Size별 `Size/Icon/*`). 코드는 크기에 맞는 그림을 직접 고릅니다. */
const ICON_SIZE: Record<ButtonSize, IconSize> = {
  xsmall: "xsmall",
  small: "small",
  medium: "small",
  large: "medium",
  xlarge: "medium",
};

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "children" | "type" | "color">;

export interface ButtonProps extends NativeButtonProps {
  /** Figma `Style`. 기본 "primary" */
  variant?: ButtonVariant;
  /** Figma `Size`. 기본 "small" */
  size?: ButtonSize;
  /** Figma `Label`. 버튼 문구(글자만) */
  children: string;
  /** Figma `Icon Left` + `Icon Left Swap`. 값이 없으면 아이콘 없음 */
  iconLeft?: IconName;
  /** Figma `Icon Right` + `Icon Right Swap` */
  iconRight?: IconName;
  /** Figma `State=Loading`. 클릭을 막고 왼쪽 아이콘 자리에 회전 아이콘을 그립니다. disabled보다 우선 */
  loading?: boolean;
  /** Figma `State=Disabled` */
  disabled?: boolean;
  /** 인스턴스 너비 Fill container에 해당. 부모 너비를 채웁니다 */
  fullWidth?: boolean;
  /** 기본 "button"(폼 안에서 실수로 제출되지 않게) */
  type?: "button" | "submit" | "reset";
  /** 배치(margin, grid 위치)용. 색·크기·여백을 바꾸는 데 쓰지 않습니다 */
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "small",
    children,
    iconLeft,
    iconRight,
    loading = false,
    disabled = false,
    fullWidth = false,
    type = "button",
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const iconSize = ICON_SIZE[size];

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      // 처리 중에는 중복 실행과 폼 제출을 막습니다.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={[styles.button, VARIANT_CLASS[variant], styles[size], fullWidth && styles.fullWidth, className]
        .filter(Boolean)
        .join(" ")}
      // 로딩 중에는 포커스를 유지하려고 native disabled 대신 aria-disabled를 씁니다.
      disabled={disabled && !loading}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <Icon name="status_loading" size={iconSize} className={styles.spinner} />
      ) : (
        iconLeft && <Icon name={iconLeft} size={iconSize} />
      )}
      <span className={styles.label}>{children}</span>
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
});
