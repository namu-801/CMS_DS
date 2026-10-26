import styles from "./Avatar.module.css";

/** Figma `Size` → `size`. small 20(표), large 36(상단 바 프로필) */
export const AVATAR_SIZES = ["small", "large"] as const;
export type AvatarSize = (typeof AVATAR_SIZES)[number];

export interface AvatarProps {
  /** 사진 주소 */
  src: string;
  /** 사진 설명. 옆에 이름 글자가 있으면 ""(장식용)로 둡니다 */
  alt: string;
  /** Figma `Size`. 기본 "small" */
  size?: AvatarSize;
  className?: string;
}

/** 둥근 프로필 사진. Figma `Avatar` 세트(257:16453). */
export function Avatar({ src, alt, size = "small", className }: AvatarProps) {
  return (
    <img
      className={[styles.avatar, styles[size], className].filter(Boolean).join(" ")}
      src={src}
      alt={alt}
      data-size={size}
    />
  );
}
