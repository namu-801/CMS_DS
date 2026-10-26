import { pictograms } from "./pictograms.generated";
import styles from "./Icon.module.css";

export type PictogramName = keyof typeof pictograms;

export interface PictogramProps {
  name: PictogramName;
  className?: string;
}

/** 지름 48의 그림형 아이콘(Figma `Pictogram/*`). 색이 고정된 장식용 그림이라 스크린리더에서는 숨깁니다. */
export function Pictogram({ name, className }: PictogramProps) {
  return (
    <svg
      className={[styles.icon, styles.pictogram, className].filter(Boolean).join(" ")}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      data-pictogram={name}
      dangerouslySetInnerHTML={{ __html: pictograms[name][48] }}
    />
  );
}
