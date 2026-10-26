import { useState } from "react";
import { Dropdown } from "@/components/Dropdown";
import { CountBadge, EventLabel, StatusBadge, StatusText, Tag } from "@/components/Badge";
import { Tabs } from "@/components/Tabs";
import { Pagination } from "@/components/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/Table";
import { Avatar } from "@/components/Avatar";
import { AlertDialog, Dialog } from "@/components/Modal";
import { LeftNavigationBar, PageTitle, TopBar } from "@/components/Navigation";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import styles from "../App.module.css";

/** 확인용 사진(색 없는 기본 그림) */
const AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='7' r='4'/%3E%3Cpath d='M2 20a8 8 0 0 1 16 0z'/%3E%3C/svg%3E";

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "driving", label: "운행 중" },
  { value: "idle", label: "대기" },
  { value: "charging", label: "충전 중" },
  { value: "repair", label: "점검 중" },
  { value: "end", label: "운행 종료" },
];

/** 2026-10-27 일괄 구현한 컴포넌트를 Figma와 비교하는 확인용 화면 */
export function NewDemos() {
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState("1");
  const [dialog, setDialog] = useState(false);
  const [alert, setAlert] = useState<"warning" | "success" | null>(null);

  return (
    <>
      <h1 className="text-24-semibold">Dropdown</h1>
      <section className={styles.section}>
        <div className={styles.rowTop}>
          <Dropdown label="운행 상태" hideLabel placeholder="운행 상태별" options={STATUS_OPTIONS} value={status} onValueChange={setStatus} className={styles.demoNarrow} />
          <Dropdown label="글꼴" hideLabel size="small" options={STATUS_OPTIONS} defaultValue="driving" className={styles.demoNarrow} />
          <Dropdown label="비활성" hideLabel options={STATUS_OPTIONS} disabled className={styles.demoNarrow} />
          <Dropdown label="제목 있는 드롭다운" options={STATUS_OPTIONS} className={styles.demoNarrow} />
        </div>
      </section>

      <h1 className="text-24-semibold">Badge</h1>
      <section className={styles.section}>
        <div className={styles.row}>
          <Tag type="gps">GPS 기반 그룹 재생</Tag>
          <Tag type="time">16:00:00 ~ 16:30:00</Tag>
          <Tag type="repeat">반복재생</Tag>
          <Tag type="repeat-off">반복재생안함</Tag>
        </div>
        <div className={styles.row}>
          <StatusBadge status="positive" />
          <StatusBadge status="negative" />
          <StatusText status="success" />
          <StatusText status="fail">다운로드 실패</StatusText>
          <EventLabel level="danger" />
          <EventLabel level="warning" />
          <EventLabel level="caution" />
          <CountBadge count={2} />
          <Avatar src={AVATAR} alt="김마바" />
          <Avatar src={AVATAR} alt="마바산업" size="large" />
        </div>
      </section>

      <h1 className="text-24-semibold">Tabs</h1>
      <section className={styles.section}>
        <Tabs label="설정 방식" items={[{ value: "location", label: "위치 설정" }, { value: "time", label: "시간 설정" }, { value: "etc", label: "비활성", disabled: true }]} />
        <div className={styles.demoVerticalTabs}>
          <Tabs
            label="콘텐츠 종류"
            orientation="vertical"
            items={["비디오 + 오디오", "비디오", "오디오", "이미지", "텍스트"].map((l) => ({ value: l, label: l, content: <p className={styles.demoPanel}>{l} 업로드</p> }))}
          />
        </div>
      </section>

      <h1 className="text-24-semibold">Pagination</h1>
      <section className={styles.section}>
        <Pagination page={page} totalPages={3} onPageChange={setPage} />
        <Pagination page={10} totalPages={20} onPageChange={() => {}} />
      </section>

      <h1 className="text-24-semibold">Table</h1>
      <section className={styles.section}>
        <Table caption="차량 목록">
          <TableHead>
            <TableHeaderCell>차량번호</TableHeaderCell>
            <TableHeaderCell>운행 상태</TableHeaderCell>
            <TableHeaderCell>운전자</TableHeaderCell>
            <TableHeaderCell>이벤트 상태</TableHeaderCell>
            <TableHeaderCell>현재 위치</TableHeaderCell>
          </TableHead>
          <TableBody>
            <TableRow selected onClick={() => {}}>
              <TableCell>123아1234</TableCell>
              <TableCell>운행중</TableCell>
              <TableCell leading={{ type: "avatar", src: AVATAR }}>김마바</TableCell>
              <TableCell leading={{ type: "eventLabel", level: "danger" }}>네트워크 오류</TableCell>
              <TableCell chevron>서울 강남구</TableCell>
            </TableRow>
            <TableRow onClick={() => {}}>
              <TableCell>122바2135</TableCell>
              <TableCell>정비중</TableCell>
              <TableCell leading={{ type: "avatar", src: AVATAR }}>김하늘</TableCell>
              <TableCell leading={{ type: "eventLabel", level: "warning" }} trailing={{ type: "count", count: 2 }}>장치 오류</TableCell>
              <TableCell chevron>서울 영등포구</TableCell>
            </TableRow>
            <TableRow disabled onClick={() => {}}>
              <TableCell>132아1801</TableCell>
              <TableCell>운행종료</TableCell>
              <TableCell leading={{ type: "icon", name: "status_error_filled" }}>할당 필요</TableCell>
              <TableCell>없음</TableCell>
              <TableCell chevron>차고지-01</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table caption="콘텐츠 그룹 목록">
          <TableHead>
            <TableHeaderCell>그룹 이름</TableHeaderCell>
            <TableHeaderCell>다운로드</TableHeaderCell>
            <TableHeaderCell hideLabel>할당</TableHeaderCell>
          </TableHead>
          <TableBody>
            {[["1", "소노펠리체 CC 시설 안내 영상", true], ["2", "시설 안내 영상", false]].map(([id, name, ok]) => (
              <TableRow key={String(id)} selected={selected === id} onClick={() => setSelected(String(id))}>
                <TableCell
                  radio={{ name: "group", checked: selected === id, onChange: () => setSelected(String(id)), label: `${name} 선택` }}
                  leading={{ type: "icon", name: "object_group_folder_filled" }}
                  trailing={{ type: "tag", tagType: "gps", text: "GPS" }}
                >
                  {String(name)}
                </TableCell>
                <TableCell trailing={{ type: "statusText", status: ok ? "success" : "fail", text: ok ? "다운로드 성공" : "다운로드 실패" }} />
                <TableCell trailing={{ type: "button", label: "할당하기", icon: "arrow_right", onClick: () => {} }} />
              </TableRow>
            ))}
            <TableRow>
              <TableCell indent leading={{ type: "icon", name: "navigation_display_filled" }}>LED-001</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <h1 className="text-24-semibold">Modal</h1>
      <section className={styles.section}>
        <div className={styles.row}>
          <Button variant="outline" onClick={() => setDialog(true)}>입력 팝업 열기</Button>
          <Button variant="outline" onClick={() => setAlert("warning")}>삭제 확인 열기</Button>
          <Button variant="outline" onClick={() => setAlert("success")}>완료 알림 열기</Button>
        </div>
        <Dialog open={dialog} onClose={() => setDialog(false)} onConfirm={() => setDialog(false)} title="차량등록">
          <TextField label="차량번호" size="small" placeholder="테스트" />
        </Dialog>
        <AlertDialog
          open={alert === "warning"}
          type="warning"
          title="정말 삭제하시겠습니까?"
          description={"이 작업은 되돌릴 수 없습니다.\n데이터를 영구적으로 삭제하시겠습니까?"}
          confirmLabel="삭제"
          onConfirm={() => setAlert(null)}
          cancelLabel="취소"
          onCancel={() => setAlert(null)}
        />
        <AlertDialog open={alert === "success"} type="success" title="완료되었습니다" description="GPS・시간 설정이 저장되었습니다." confirmLabel="확인" onConfirm={() => setAlert(null)} />
      </section>

      <h1 className="text-24-semibold">좌측 네비게이션바 · 상단 바 · 화면 제목</h1>
      <section className={styles.section}>
        <div className={styles.demoShell}>
          <LeftNavigationBar
            logo={<span className="text-24-semibold">M-CMS</span>}
            currentValue="content"
            groups={[
              { title: "모니터링", items: [{ value: "dashboard", icon: "navigation_dashboard_filled", label: "대시보드" }, { value: "vehicle", icon: "navigation_vehicle_filled", label: "차량관리" }] },
              { title: "콘텐츠 설정", items: [{ value: "content", icon: "navigation_content_filled", label: "콘텐츠 관리" }, { value: "group", icon: "navigation_content_group_filled", label: "콘텐츠 그룹 관리" }, { value: "assign", icon: "navigation_assign", label: "할당 및 실행" }] },
              { title: "OTA", items: [{ value: "ota", icon: "navigation_ota_filled", label: "OTA 관리" }] },
            ]}
          />
          <div className={styles.demoShellMain}>
            <TopBar greeting="안녕하세요, 마바산업님" avatarSrc={AVATAR} onNotificationClick={() => {}} onLogoutClick={() => {}} />
            <PageTitle title="콘텐츠 관리" description="콘텐츠들을 생성하고 업로드해 주세요." />
          </div>
        </div>
      </section>
    </>
  );
}
