# GameBox AIdev — Task Plan

> 参考实施计划：docs/plans/2026-02-27-gamebox-implementation.md

## 里程碑概览

| M | 阶段 | Tasks | 状态 |
|---|------|-------|------|
| M1 | 脚手架 + 暗色主题 | Task 1-2 | ⬜ 待开始 |
| M2 | Supabase + 类型定义 | Task 3-5 | ⬜ 待开始 |
| M3 | 游戏大厅 UI | Task 6-7 | ⬜ 待开始 |
| M4 | 4款游戏实现 | Task 8-11 | ⬜ 待开始 |
| M5 | 分数/Auth/排行榜 | Task 12-15 | ⬜ 待开始 |
| M6 | E2E 验证 | Task 16 | ⬜ 待开始 |

## 详细任务列表

### M1: 脚手架 + 暗色主题
- [ ] Task 1: Next.js 项目初始化 + shadcn/ui + Supabase 依赖
- [ ] Task 2: 暗色赛博朋克主题配置（Tailwind + globals.css + theme.ts）

### M2: Supabase + 类型定义
- [ ] Task 3: Supabase 客户端配置（client/server/middleware）
- [ ] Task 4: 数据库 Schema + RLS 策略
- [ ] Task 5: TypeScript 类型定义

### M3: 游戏大厅 UI
- [ ] Task 6: 游戏大厅主页 UI（GameCard + Navbar + page.tsx）
- [ ] Task 7: 游戏通用布局组件（GameLayout）

### M4: 4款游戏实现（并行）
- [ ] Task 8: 贪吃蛇（lib/games/snake.ts + hooks/useSnake.ts + 页面）
- [ ] Task 9: 2048（lib/games/2048.ts + hooks/use2048.ts + 页面）
- [ ] Task 10: 五子棋（lib/games/gomoku.ts + hooks/useGomoku.ts + 页面）
- [ ] Task 11: 记忆翻牌（lib/games/memory.ts + hooks/useMemory.ts + 页面）

### M5: 分数/Auth/排行榜
- [ ] Task 12: 分数提交 API（/api/scores + /api/leaderboard/[slug]）
- [ ] Task 13: Auth 流程（callback + Navbar 状态）
- [ ] Task 14: 排行榜组件（Leaderboard + Realtime 订阅）
- [ ] Task 15: 游戏结束分数提交集成

### M6: E2E 验证
- [ ] Task 16: dev-browser 全链路验证

## 关键决策记录

| 决策 | 选择 | 原因 |
|------|------|------|
| 前端框架 | Next.js 14 App Router | 现代全栈，适合工程化学习 |
| UI 组件 | shadcn/ui + Tailwind | ui-ux-pro-max 插件支持 |
| 后端/DB | Supabase | 内置 Auth + Realtime，开箱即用 |
| 视觉风格 | 深色赛博朋克 | 用户选择 |
| 游戏渲染 | Canvas(蛇/棋) + DOM(2048/翻牌) | 按游戏特性选择 |
