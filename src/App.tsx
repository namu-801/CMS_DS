import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/components/Button";
import { useState } from "react";
import { IconButton, ICON_BUTTON_VARIANTS } from "@/components/IconButton";
import { TextField, TEXT_FIELD_SIZES } from "@/components/TextField";
import { Radio, RadioGroup } from "@/components/Radio";
import { Checkbox } from "@/components/Checkbox";
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
      <h1 className="text-24-semibold">TextField</h1>
      {TEXT_FIELD_SIZES.map((size) => (
        <section key={size} className={styles.section}>
          <h2 className="text-16-semibold">{size}</h2>
          <div className={styles.fieldGrid}>
            <TextField size={size} label="기본" placeholder="안내 문구" message="마우스를 올리거나 눌러 보세요" />
            <TextField size={size} label="입력됨" defaultValue="입력한 내용" />
            <TextField size={size} label="오류" status="error" defaultValue="abc" message="이메일 형식이 아닙니다." />
            <TextField size={size} label="성공" status="success" defaultValue="abc@gmail.com" message="사용 가능합니다." />
            <TextField size={size} label="비활성" disabled defaultValue="00 : 00 : 00" />
          </div>
        </section>
      ))}
      <section className={styles.section}>
        <h2 className="text-16-semibold">시안 쓰임 예</h2>
        <div className={styles.fieldGrid}>
          <TextField size="large" label="이메일" hideLabel type="email" placeholder="이메일" />
          <PasswordExample />
          <TextField size="large" label="이름" required placeholder="이름" />
          <TextField size="medium" label="차량 검색" hideLabel type="search" leadingIcon="action_search" placeholder="차량번호, 운전자 검색하기" />
        </div>
        <div className={styles.gpsRow}>
          <TextField size="xsmall" label="위치명" hideLabel placeholder="위치명을 입력해주세요." className={styles.gpsInput} />
          <IconButton variant="outline" size={24} icon="action_check" label="위치명 저장" />
          <IconButton variant="outline" size={24} icon="action_close" label="위치명 수정 취소" />
        </div>
      </section>
      <h1 className="text-24-semibold">Radio</h1>
      <section className={styles.section}>
        <h2 className="text-16-semibold">상태</h2>
        <RadioGroup label="상태 예시" defaultValue="on">
          <Radio value="off" label="기본" />
          <Radio value="on" label="선택" />
          <Radio value="dis" label="비활성" disabled />
        </RadioGroup>
        <RadioGroup label="선택된 비활성" defaultValue="b" disabled>
          <Radio value="a" label="선택 안 됨" />
          <Radio value="b" label="선택됨" />
        </RadioGroup>
        <RadioGroup label="세로 배치" orientation="vertical" defaultValue="video">
          <Radio value="video" label="비디오" />
          <Radio value="audio" label="오디오" />
          <Radio value="image" label="이미지" />
        </RadioGroup>
        <RadioGroup label="표 행 선택(글자 숨김)" hideLabel defaultValue="1">
          <Radio value="1" label="소노펠리체 CC 시설 안내 영상" hideLabel />
          <Radio value="2" label="소노펠리체 CC 광고 촬영 영상" hideLabel />
        </RadioGroup>
      </section>
      <h1 className="text-24-semibold">Checkbox</h1>
      <section className={styles.section}>
        <h2 className="text-16-semibold">상태</h2>
        <div className={styles.row}>
          <Checkbox label="꺼짐" />
          <Checkbox label="켜짐" defaultChecked />
          <Checkbox label="꺼짐 비활성" disabled />
          <Checkbox label="켜짐 비활성" defaultChecked disabled />
          <Checkbox label="글자 숨김" hideLabel />
        </div>
        <Checkbox
          label={
            <>
              가입 시 <strong>이용약관</strong> 및 <strong>개인정보처리방침</strong>에 동의하는 것으로 간주합니다.
            </>
          }
          message="약관에 동의해 주세요."
        />
      </section>
    </main>
  );
}

/** 비밀번호 보기·숨기기: 상태에 따라 아이콘과 버튼 이름을 함께 바꿉니다. */
function PasswordExample() {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      size="large"
      label="비밀번호"
      required
      type={visible ? "text" : "password"}
      placeholder="영문, 특수문자, 숫자 혼합 8~12자"
      trailingAction={{
        icon: visible ? "action_visibility" : "action_visibility_off",
        label: visible ? "비밀번호 숨기기" : "비밀번호 보기",
        onClick: () => setVisible((v) => !v),
      }}
    />
  );
}
