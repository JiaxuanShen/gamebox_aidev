# GameBox AIdev — Findings

> 记录代码探索、调试发现和关键技术决策

## 项目结构

- 当前状态：空项目，仅有 .git 和 .claude 目录
- 设计文档：docs/plans/2026-02-27-gamebox-design.md
- 实施计划：docs/plans/2026-02-27-gamebox-implementation.md

## 已安装插件

| 插件 | 用途 |
|------|------|
| dev-browser | 浏览器自动化，截图验证，E2E 测试 |
| ui-ux-pro-max | UI/UX 设计，shadcn/ui 组件生成 |

## 技术发现

### Tailwind CSS v4
- 无 `tailwind.config.ts`，通过 `app/globals.css` 的 CSS 变量配置主题
- Task 2 主题配置需要用 CSS 变量写法，而非 JS config 对象
- globals.css 使用 `@import "tailwindcss"` 而非 v3 的 `@tailwind base/components/utilities`

### Next.js 16.x
- 已安装版本：16.1.6（截至 2026-02-27 的最新版）
- **已移除 `next lint` 子命令**，lint 脚本应使用 `eslint .`
- **`middleware.ts` 已重命名为 `proxy.ts`**，导出函数名从 `middleware` 改为 `proxy`
- App Router、TypeScript、Tailwind 集成方式与 14.x 一致

### shadcn/ui
- 使用 "new-york" 风格（非 "default"）
- components.json 中 `tailwind.config` 为空字符串（v4 的正确处理方式）

## Supabase 配置

- Project URL: https://pltzexkwjrjkvqclqbrr.supabase.co
- 表：games（slug PK）、scores（user_id FK → auth.users）
- RLS：games/scores 公开可读，scores 仅限本人写入
- 初始数据：snake/2048/gomoku/memory 4 条游戏记录已插入

## 已知问题 / 踩坑

_（执行过程中记录）_
