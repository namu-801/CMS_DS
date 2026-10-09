import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type Ref } from "react";
import { Icon, type IconName, type IconSize } from "@/components/Icon";
import styles from "./IconButton.module.css";

/** Figma `Style` → `variant` (패널 순서: Plain, Outline, Primary) */
export const ICON_BUTTON_VARIANTS = ["plain", "outline", "primary"] as const;
export type IconButtonVariant = (typeof ICON_BUTTON_VARIANTS)[number];

/** Figma `Size` → `size`. 버튼 틀(정사각) 크기 */
export const ICON_BUTTON_SIZES = [20, 24, 40, 48] as const;
export type IconButtonSize = (typeof ICON_BUTTON_SIZES)[number];

/** Figma `Icon Color` → `iconColor`. primary 스타일에서는 아이콘이 항상 흰색이라 적용되지 않음.
 * Subtle(#A3A3A3)은 아이콘 대비 기준(3:1) 미달이라 2026-10-09에 뺐습니다. */
export const ICON_BUTTON_ICON_COLORS = ["strong", "default", "primary"] as const;
export type IconButtonIconColor = (typeof ICON_BUTTON_ICON_COLORS)[number];

/** 아이콘 그림 크기(Figma 아이콘 세트의 Size). 틀보다 큰 아이콘은 넣지 않는다는 지침을 타입으로 막습니다. */
export type IconButtonIconSize = 16 | 20 | 24 | 32;
export type IconSizeFor<S extends IconButtonSize> = S extends 20 ? 16 | 20 : S extends 24 ? 16 | 20 | 24 : IconButtonIconSize;

const ICON_SIZE_NAME: Record<IconButtonIconSize, IconSize> = { 16: "xsmall", 20: "small", 24: "medium", 32: "large" };
const VARIANT_CLASS: Record<IconButtonVariant, string> = { plain: styles.plain, outline: styles.outline, primary: styles.primary };
const SIZE_CLASS: Record<IconButtonSize, string> = { 20: styles.s20, 24: styles.s24, 40: styles.s40, 48: styles.s48 };
const COLOR_CLASS: Record<IconButtonIconColor, string> = {
  strong: styles.toneStrong,
  default: styles.toneDefault,
  primary: styles.tonePrimary,
};

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "style" | "children" | "type" | "color" | "aria-label" | "aria-pressed" | "title"
>;

export interface IconButtonProps<S extends IconButtonSize = 40> extends NativeButtonProps {
  /** Figma `Icon`. 아이콘 모양(필수) */
  icon: IconName;
  /** 버튼 이름(필수). 스크린리더 이름(aria-label)과 툴팁에 씁니다. Figma에서는 인스턴스 레이어 이름 */
  label: string;
  /** Figma `Style`. 기본 "plain" */
  variant?: IconButtonVariant;
  /** Figma `Size`. 기본 40 */
  size?: S;
  /** Figma 아이콘의 Size. 기본 20. 틀(size)보다 큰 값은 넣을 수 없음 */
  iconSize?: IconSizeFor<S>;
  /** Figma `Icon Color`. 기본 "strong" */
  iconColor?: IconButtonIconColor;
  /** Figma `State=Selected`. 켜고 끄는 버튼에만 줍니다(aria-pressed). 주지 않으면 일반 버튼 */
  selected?: boolean;
  /** Figma `State=Disabled`. selected보다 우선 */
  disabled?: boolean;
  /** Figma `Floating`. 지도처럼 떠 있는 곳의 그림자(Elevation/Low) */
  floating?: boolean;
  /** 기본 "button" */
  type?: "button" | "submit" | "reset";
  /** 배치(margin, grid 위치)용. 색·크기를 바꾸는 데 쓰지 않습니다 */
  className?: string;
}

function IconButtonInner(
  {
    icon,
    label,
    variant = "plain",
    size = 40 as IconButtonSize,
    iconSize = 20,
    iconColor = "strong",
    selected,
    disabled = false,
    floating = false,
    type = "button",
    className,
    ...rest
  }: IconButtonProps<IconButtonSize>,
  ref: Ref<HTMLButtonElement>,
) {
  const s = size as IconButtonSize;
  return (
    <button
      ref={ref}
      type={type}
      className={[
        styles.button,
        VARIANT_CLASS[variant],
        SIZE_CLASS[s],
        COLOR_CLASS[iconColor],
        // 20·24 틀은 보이는 크기는 그대로 두고 클릭 영역만 32로 넓힘
        (s === 20 || s === 24) && styles.extendHit,
        floating && styles.floating,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
      // 이름은 항상 label. rest보다 뒤에 둬서 다른 값으로 덮어쓰지 못하게 함
      aria-label={label}
      title={label}
      aria-pressed={selected === undefined ? undefined : selected}
      disabled={disabled}
      data-variant={variant}
      data-size={s}
      data-icon-color={iconColor}
    >
      <Icon name={icon} size={ICON_SIZE_NAME[iconSize as IconButtonIconSize]} />
    </button>
  );
}

/** 아이콘만 있는 버튼. Figma `IconButton` 세트(156:15581)와 같은 규칙입니다. */
export const IconButton = forwardRef(IconButtonInner) as <S extends IconButtonSize = 40>(
  props: IconButtonProps<S> & { ref?: Ref<HTMLButtonElement> },
) => ReactElement;
