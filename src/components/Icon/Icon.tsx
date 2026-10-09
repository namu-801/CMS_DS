import { icons } from "./icons.generated";
import styles from "./Icon.module.css";

export type IconName = keyof typeof icons;

/** Foundation `Size/Icon/*`과 같은 이름. xsmall 16, small 20, medium 24, large 32, xlarge 36 */
export const ICON_SIZES = ["xsmall", "small", "medium", "large", "xlarge"] as const;
export type IconSize = (typeof ICON_SIZES)[number];

type IconPx = 16 | 20 | 24 | 32 | 36;
const ICON_PX: Record<IconSize, IconPx> = { xsmall: 16, small: 20, medium: 24, large: 32, xlarge: 36 };

/** 요청한 크기의 그림이 있으면 그것을, 없으면 가장 가까운 크기의 그림을 골라 크기 토큰에 맞춰 그립니다. */
function pickVariant(name: IconName, size: IconSize) {
  const variants = icons[name] as Partial<Record<IconPx, string>>;
  const want = ICON_PX[size];
  const available = (Object.keys(variants).map(Number) as IconPx[]).sort(
    (a, b) => Math.abs(a - want) - Math.abs(b - want) || b - a,
  );
  const px = variants[want] ? want : available[0];
  return { px, body: variants[px] as string };
}

export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
}

/** 장식용 아이콘입니다. 색은 부모 글자색(currentColor)을 따르고, 스크린리더에서는 숨깁니다. */
export function Icon({ name, size = "small", className }: IconProps) {
  const { px, body } = pickVariant(name, size);
  return (
    <svg
      className={[styles.icon, styles[size], className].filter(Boolean).join(" ")}
      viewBox={`0 0 ${px} ${px}`}
      aria-hidden="true"
      focusable="false"
      data-icon={name}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
