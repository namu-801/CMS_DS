// Figma `Pictogram/*` 세트(Style=Filled, Size=48)에서 내보낸 SVG 내용입니다.
// 색 고정 그림이라 색을 토큰 변수(style="fill: var(--…)")로 넣었습니다. 키는 Key 규칙에서 크기를 뺀 이름입니다.

export const pictograms = {
  pictogram_status_success_filled: {
    48: '<path d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z" style="fill: var(--surface-positive-tertiary)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 46C36.1503 46 46 36.1503 46 24C46 11.8497 36.1503 2 24 2C11.8497 2 2 11.8497 2 24C2 36.1503 11.8497 46 24 46ZM24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" style="fill: var(--foreground-positive-primary)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M39.4549 16.0018L23.0571 32.3756C22.4712 32.9607 21.5221 32.9603 20.9366 32.3749L9.87891 21.318L12.0001 19.1966L21.998 29.1937L37.3351 13.8789L39.4549 16.0018Z" style="fill: var(--foreground-positive-primary)"/>',
  },
  pictogram_status_error_filled: {
    48: '<path d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z" style="fill: var(--surface-negative-secondary)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 46C36.1503 46 46 36.1503 46 24C46 11.8497 36.1503 2 24 2C11.8497 2 2 11.8497 2 24C2 36.1503 11.8497 46 24 46ZM24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" style="fill: var(--foreground-negative-primary)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32.4942 34.6126L34.6155 32.4913L26.1304 24.0062L34.6158 15.5208L32.4944 13.3995L24.0091 21.8849L15.5237 13.3994L13.4023 15.5207L21.8878 24.0062L13.4026 32.4914L15.5239 34.6127L24.0091 26.1275L32.4942 34.6126Z" style="fill: var(--foreground-negative-primary)"/>',
  },
  pictogram_status_warning_filled: {
    48: '<path d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z" style="fill: var(--surface-warning-tertiary)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 46C36.1503 46 46 36.1503 46 24C46 11.8497 36.1503 2 24 2C11.8497 2 2 11.8497 2 24C2 36.1503 11.8497 46 24 46ZM24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" style="fill: var(--foreground-warning-primary)"/><path d="M26.7998 35.999H22V31.1992H26.7998V35.999Z" style="fill: var(--foreground-warning-primary)"/><path d="M26.7998 26.4004H22V12H26.7998V26.4004Z" style="fill: var(--foreground-warning-primary)"/>',
  },
} as const satisfies Record<string, { 48: string }>;
