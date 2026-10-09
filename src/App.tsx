import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/components/Button";
import { IconButton, ICON_BUTTON_VARIANTS } from "@/components/IconButton";
import styles from "./App.module.css";

/** Figma Button 세트와 나란히 비교하기 위한 확인용 화면 */
export function App() {
  return (
    <main className={styles.page}>
      <h1 className="text-24-semibold">Button</h1>
      {BUTTON_VARIANTS.map((variant) => (
        <section key={variant} className={styles.section}>
          <h2 className="text-16-semibold">{variant}</h2>
          {BUTTON_SIZES.map((size) => (
            <div key={size} className={styles.row}>
              <span className={`text-13-regular ${styles.caption}`}>{size}</span>
              <Button variant={variant} size={size}>추가</Button>
              <Button variant={variant} size={size} iconLeft="action_plus">추가</Button>
              <Button variant={variant} size={size} iconRight="arrow_right">다음</Button>
              <Button variant={variant} size={size} disabled>추가</Button>
              <Button variant={variant} size={size} loading>저장</Button>
            </div>
          ))}
        </section>
      ))}

      <h1 className="text-24-semibold">IconButton</h1>
      {ICON_BUTTON_VARIANTS.map((variant) => (
        <section key={variant} className={styles.section}>
          <h2 className="text-16-semibold">{variant}</h2>
          <div className={styles.row}>
            <span className={`text-13-regular ${styles.caption}`}>기본·선택·비활성</span>
            <IconButton variant={variant} icon="action_plus" iconSize={24} label="추가" />
            <IconButton variant={variant} icon="editor_bold" iconSize={24} label="굵게" selected />
            <IconButton variant={variant} icon="action_plus" iconSize={24} label="추가" disabled />
            <IconButton variant={variant} icon="action_plus" iconSize={24} label="확대" floating />
          </div>
          <div className={styles.row}>
            <span className={`text-13-regular ${styles.caption}`}>크기 20·24·40·48</span>
            <IconButton variant={variant} size={20} icon="action_edit_filled" iconColor="default" label="수정" />
            <IconButton variant={variant} size={24} icon="action_check" label="확인" />
            <IconButton variant={variant} size={40} icon="location_my_location" iconSize={24} iconColor="default" label="현재 위치" />
            <IconButton variant={variant} size={48} icon="arrow_up" iconSize={32} label="위로" />
          </div>
        </section>
      ))}
      <section className={styles.section}>
        <h2 className="text-16-semibold">시안 쓰임 예</h2>
        <div className={styles.row}>
          <IconButton variant="primary" icon="location_add_location" iconSize={24} label="위치 추가" floating />
          <IconButton variant="primary" icon="action_undo" iconSize={24} label="위치 추가 끄기" floating selected />
          <IconButton variant="outline" icon="location_my_location" iconSize={24} iconColor="default" label="현재 위치" floating />
          <IconButton variant="outline" icon="action_plus" iconSize={24} iconColor="default" label="확대" floating />
          <IconButton variant="outline" icon="action_minus" iconSize={24} iconColor="default" label="축소" floating />
          <IconButton variant="plain" size={24} icon="navigation_notification" iconSize={24} label="알림" />
          <IconButton variant="plain" size={24} icon="navigation_logout" iconSize={24} label="로그아웃" />
          <IconButton variant="plain" size={20} icon="arrow_down" iconColor="default" label="펼치기" />
        </div>
      </section>
    </main>
  );
}
