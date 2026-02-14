# Cross-cutting: C3 シードデータスクリプト (stations, units, users)

- Estimate: 0.5d
- Labels: backend, devops
- Description:
  - 開発用のシードスクリプトを用意し、Stations/Units/Users を投入できるようにする。
- Acceptance Criteria:
  - `pnpm --filter backend seed:dev` でデータが投入される
