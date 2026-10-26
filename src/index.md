# PBV 디자인 시스템 목차

이 파일은 목차입니다. 값과 속성은 적지 않았으니, 자세한 내용은 링크한 파일에서 읽으세요. 컴포넌트를 쓰거나 만들 때는 **계약 파일**이 기준입니다.

## 토큰

- [tokens/figma-variables.json](../tokens/figma-variables.json) — Figma Variable·Text Style·Effect Style을 내보낸 원본. 토큰을 바꿀 때 여기부터 고칩니다.
- [scripts/build-tokens.mjs](../scripts/build-tokens.mjs) — 원본에서 코드 토큰을 만드는 스크립트(`npm run tokens`).
- [src/tokens/tokens.css](tokens/tokens.css) — 컴포넌트가 참조하는 CSS 변수(자동 생성, 직접 고치지 않음).
- [src/tokens/typography.css](tokens/typography.css) — Text Style과 1:1인 글자 클래스(자동 생성).
- [src/tokens/tokens.ts](tokens/tokens.ts) — Figma 이름 → CSS 변수 대응을 TypeScript로(자동 생성).
- [04_이름규칙.md](../design-system/04_이름규칙.md) — 토큰 이름 규칙과 Semantic 토큰 목록, 각 토큰을 어디에 쓰는지.
- [03_컬러_스케일_설계안.md](../design-system/03_컬러_스케일_설계안.md) — Atomic 색 단계를 정한 근거.

## 컴포넌트

| 컴포넌트 | 한 줄 설명 | 계약 | 코드 |
|---|---|---|---|
| Button | 글자가 있는 버튼 | [10_버튼_계약.md](../design-system/10_버튼_계약.md) | [src/components/Button](components/Button) |
| IconButton | 아이콘만 있는 버튼 | [13_아이콘버튼_계약.md](../design-system/13_아이콘버튼_계약.md) | [src/components/IconButton](components/IconButton) |
| TextField | 한 줄 입력창 | [16_텍스트필드_계약.md](../design-system/16_텍스트필드_계약.md) | [src/components/TextField](components/TextField) |
| Radio | 여러 선택지 중 하나 고르기(`Radio` + `RadioGroup`) | [19_라디오_계약.md](../design-system/19_라디오_계약.md) | [src/components/Radio](components/Radio) |
| Checkbox | 항목 하나를 켜고 끄기(오류 문구 포함) | [22_체크박스_계약.md](../design-system/22_체크박스_계약.md) | [src/components/Checkbox](components/Checkbox) |
| Dropdown | 목록에서 값 하나 고르기 | [40_드롭다운_계약.md](../design-system/40_드롭다운_계약.md) | [src/components/Dropdown](components/Dropdown) |
| Badge | 보여 주기만 하는 표시: Tag·StatusBadge·StatusText·EventLabel·CountBadge | [41_배지_계약.md](../design-system/41_배지_계약.md) | [src/components/Badge](components/Badge) |
| Avatar | 둥근 프로필 사진(20·36) | [42_아바타_계약.md](../design-system/42_아바타_계약.md) | [src/components/Avatar](components/Avatar) |
| Tabs | 같은 자리 내용 전환(가로·세로) | [43_탭_계약.md](../design-system/43_탭_계약.md) | [src/components/Tabs](components/Tabs) |
| Pagination | 표 아래 페이지 이동 | [44_페이지네이션_계약.md](../design-system/44_페이지네이션_계약.md) | [src/components/Pagination](components/Pagination) |
| Table | 목록 표(머리 칸·행·칸, 앞·뒤 부품) | [45_테이블_계약.md](../design-system/45_테이블_계약.md) | [src/components/Table](components/Table) |
| Modal | Dialog(입력 팝업)·AlertDialog(확인 모달) | [46_모달_계약.md](../design-system/46_모달_계약.md) | [src/components/Modal](components/Modal) |
| Navigation | 좌측 네비게이션바·메뉴 항목·상단 바·화면 제목 | [47_좌측네비게이션바_계약.md](../design-system/47_좌측네비게이션바_계약.md) | [src/components/Navigation](components/Navigation) |
| Scrollbar | 스크롤바 모양(전역 스타일, 컴포넌트 아님) | [48_스크롤바_계약.md](../design-system/48_스크롤바_계약.md) | [src/styles/scrollbar.css](styles/scrollbar.css) |
| Icon | 장식용 아이콘·픽토그램(다른 컴포넌트 안에서 씀). 계약 대신 네이밍 규칙 | [07_아이콘_네이밍_규칙.md](../design-system/07_아이콘_네이밍_규칙.md) | [src/components/Icon](components/Icon) |

## 컴포넌트를 정한 근거 (조사 → 스펙안)

- [08_버튼_조사.md](../design-system/08_버튼_조사.md) · [09_버튼_스펙안.md](../design-system/09_버튼_스펙안.md) — Button을 조사하고 결정한 기록.
- [11_아이콘버튼_조사.md](../design-system/11_아이콘버튼_조사.md) · [12_아이콘버튼_스펙안.md](../design-system/12_아이콘버튼_스펙안.md) — IconButton을 조사하고 결정한 기록.
- [14_텍스트필드_조사.md](../design-system/14_텍스트필드_조사.md) · [15_텍스트필드_스펙안.md](../design-system/15_텍스트필드_스펙안.md) — TextField를 조사하고 결정한 기록.
- [17_라디오_조사.md](../design-system/17_라디오_조사.md) · [18_라디오_스펙안.md](../design-system/18_라디오_스펙안.md) — Radio를 조사하고 결정한 기록.
- [20_체크박스_조사.md](../design-system/20_체크박스_조사.md) · [21_체크박스_스펙안.md](../design-system/21_체크박스_스펙안.md) — Checkbox를 조사하고 결정한 기록.
- [38_일괄작업_검토표.md](../design-system/38_일괄작업_검토표.md) — 아래 컴포넌트들은 2026-10-27 일괄 작업(조사·스펙·Figma·코드·계약)으로 만들었습니다. 코드 대응표 [39_코드구현_대응표.md](../design-system/39_코드구현_대응표.md).
- [23_드롭다운_조사.md](../design-system/23_드롭다운_조사.md) · [24_드롭다운_스펙안.md](../design-system/24_드롭다운_스펙안.md) — Dropdown(검토 전).
- [25_배지_조사.md](../design-system/25_배지_조사.md) · [26_배지_스펙안.md](../design-system/26_배지_스펙안.md) — Badge·Tag(검토 전).
- [27_탭_조사.md](../design-system/27_탭_조사.md) · [28_탭_스펙안.md](../design-system/28_탭_스펙안.md) — Tab(검토 전).
- [29_페이지네이션_조사.md](../design-system/29_페이지네이션_조사.md) · [30_페이지네이션_스펙안.md](../design-system/30_페이지네이션_스펙안.md) — Pagination(검토 전).
- [31_테이블_조사.md](../design-system/31_테이블_조사.md) · [32_테이블_스펙안.md](../design-system/32_테이블_스펙안.md) — Table(검토 전).
- [33_모달_조사.md](../design-system/33_모달_조사.md) · [34_모달_스펙안.md](../design-system/34_모달_스펙안.md) — Modal(검토 전).
- [35_좌측네비게이션바_조사.md](../design-system/35_좌측네비게이션바_조사.md) · [36_좌측네비게이션바_스펙안.md](../design-system/36_좌측네비게이션바_스펙안.md) — 좌측 네비게이션바·상단 바·화면 제목(검토 전).
- [37_스크롤바_목록항목_지도표시_검토.md](../design-system/37_스크롤바_목록항목_지도표시_검토.md) — Scrollbar(만듦)·List Item·Map Marker(만들지 않음) 판단(검토 전).
- [06_아이콘_조사.md](../design-system/06_아이콘_조사.md) — 시안 아이콘 조사.

## 기초 정리 기록

- [01_현재값_인벤토리.md](../design-system/01_현재값_인벤토리.md) — 시안에서 쓰이던 색·글자·간격 값 조사.
- [02_정리안_v5.md](../design-system/02_정리안_v5.md) — 인벤토리 값을 토큰으로 정리한 제안서(마지막 버전).
- [05_컴포넌트_후보.md](../design-system/05_컴포넌트_후보.md) — 앞으로 만들 컴포넌트 후보 조사.

## 예시·확인용

- [assets/11_작은아이콘버튼_예시.html](../design-system/assets/11_작은아이콘버튼_예시.html) — 작은 아이콘 버튼 결정 때 쓴 비교 예시.
- [src/App.tsx](App.tsx) — 모든 컴포넌트를 Figma와 비교하는 확인용 화면(`npm run dev`).
