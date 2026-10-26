import { Button } from "@/components/Button";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  /** 지금 페이지(1부터) */
  page: number;
  /** 전체 페이지 수 */
  totalPages: number;
  onPageChange: (page: number) => void;
  /** 스크린리더용 이름. 기본 "페이지 이동" */
  label?: string;
  className?: string;
}

/** 번호는 최대 5개. 넘으면 처음·끝 번호와 "…"로 줄입니다(Figma 스펙 ⚑ D). */
export function pageItems(page: number, total: number): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 4, "ellipsis-end", total];
  if (page >= total - 2) return [1, "ellipsis-start", total - 3, total - 2, total - 1, total];
  return [1, "ellipsis-start", page, "ellipsis-end", total].flatMap((x) => (x === page ? [page - 1, page, page + 1] : [x])) as (number | "ellipsis-start" | "ellipsis-end")[];
}

/** 표 아래 페이지 이동. Figma `Pagination`·`Pagination Item`(239:16033)과 같은 규칙입니다. */
export function Pagination({ page, totalPages, onPageChange, label = "페이지 이동", className }: PaginationProps) {
  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== page) onPageChange(p);
  };
  return (
    <nav aria-label={label} className={[styles.root, className].filter(Boolean).join(" ")}>
      <Button variant="plain" size="small" iconLeft="arrow_left" disabled={page <= 1} onClick={() => go(page - 1)}>
        이전
      </Button>
      <ul className={styles.list}>
        {pageItems(page, totalPages).map((it) =>
          typeof it === "number" ? (
            <li key={it}>
              <button
                type="button"
                className={styles.item}
                aria-current={it === page ? "page" : undefined}
                aria-label={`${it}페이지`}
                onClick={() => go(it)}
              >
                {it}
              </button>
            </li>
          ) : (
            <li key={it} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ),
        )}
      </ul>
      <Button variant="plain" size="small" iconRight="arrow_right" disabled={page >= totalPages} onClick={() => go(page + 1)}>
        다음
      </Button>
    </nav>
  );
}
