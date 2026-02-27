# GameBox AIdev — 设计文档

**日期**：2026-02-27
**状态**：已批准，待实施

---

## 项目概述

一个类 4399 的前端小游戏合集网站，用于学习 Claude Code 工具链和工作流。包含 4 款经典游戏，支持用户登录和全球排行榜。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) + TypeScript |
| UI 组件 | shadcn/ui + Tailwind CSS |
| 后端 | Next.js API Routes |
| 数据库 & Auth | Supabase (PostgreSQL + Auth + Realtime) |
| 部署 | Vercel（可选） |

---

## 游戏列表

| 类型 | 游戏 | 渲染方式 | 核心技术点 |
|------|------|---------|-----------|
| 经典益智 | 2048 | CSS Grid + DOM | 滑动手势、合并动画 |
| 街机动作 | 贪吃蛇 | Canvas | 游戏循环、碰撞检测 |
| 棋牌 | 五子棋（双人） | Canvas | 棋盘坐标系、胜负判断 |
| 休闲 | 记忆翻牌 | CSS Flip 动画 | 状态机、配对逻辑 |

---

## 项目结构

```
gamebox_aidev/
├── app/
│   ├── page.tsx                  # 游戏大厅主页
│   ├── games/
│   │   ├── [slug]/page.tsx       # 游戏详情/游玩页（动态路由）
│   │   ├── snake/
│   │   ├── 2048/
│   │   ├── gomoku/
│   │   └── memory/
│   ├── api/
│   │   ├── scores/route.ts       # 提交分数
│   │   └── leaderboard/route.ts  # 获取排行榜
│   └── auth/                     # Supabase Auth 回调
├── components/
│   ├── ui/                       # shadcn/ui 组件
│   ├── GameCard.tsx
│   ├── Leaderboard.tsx
│   └── GameLayout.tsx
├── lib/
│   ├── supabase.ts
│   └── games/                   # 游戏纯逻辑（无框架依赖）
│       ├── snake.ts
│       ├── 2048.ts
│       ├── gomoku.ts
│       └── memory.ts
├── hooks/                        # 游戏 React Hooks
│   ├── useSnake.ts
│   ├── use2048.ts
│   ├── useGomoku.ts
│   └── useMemory.ts
├── types/
│   └── index.ts
└── docs/
    └── plans/
```

---

## 数据库设计（Supabase）

### 表结构

```sql
-- Supabase Auth 自动管理 users 表

CREATE TABLE games (
  slug        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT,
  thumbnail   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scores (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_slug  TEXT REFERENCES games(slug),
  score      INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS 安全规则

```sql
-- 任何人可读排行榜
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores_read_public" ON scores FOR SELECT USING (true);

-- 只能提交自己的分数（防刷分）
CREATE POLICY "scores_insert_own" ON scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 用户系统

- 登录方式：邮箱密码 + GitHub OAuth（Supabase Auth）
- 未登录：可玩游戏，分数仅本地 localStorage 记录
- 已登录：分数自动提交到云端，参与全球排行榜

**分数提交流程：**
```
游戏结束 → 显示得分弹窗
→ 已登录 → POST /api/scores → 写入 Supabase
→ 未登录 → 提示登录，同时写入 localStorage
```

---

## 排行榜设计

- 每款游戏独立排行榜（按 `game_slug` 过滤）
- 展示全球 Top 10 + 当前用户最佳成绩和排名
- Supabase Realtime 订阅，新记录实时刷新，无需轮询

---

## 游戏模块架构

每个游戏遵循统一三层结构：

```
lib/games/<name>.ts     → 纯 TS 游戏逻辑（无 React 依赖，可独立测试）
hooks/use<Name>.ts      → React Hook（游戏循环、键盘输入、分数提交）
app/games/<name>/       → 页面组件（渲染层，Canvas 或 DOM）
```

**游戏生命周期：**
```
IDLE → PLAYING → PAUSED → GAME_OVER → SUBMITTING → DONE
```

---

## 视觉风格

- **主题**：深色赛博朋克 / 霓虹风格
- **背景**：深色（#0a0a0f 类）
- **强调色**：霓虹青 (#00ffcc)、霓虹紫 (#b344ff)
- **组件库**：shadcn/ui 暗色主题
- **字体**：等宽 / 科技感字体搭配

---

## Claude Code 工作流规划

| 阶段 | 使用技能/插件 | 目标 |
|------|-------------|------|
| 脚手架 & UI | `ui-ux-pro-max` | 生成暗色赛博风格大厅 UI |
| 并行游戏开发 | `dispatching-parallel-agents` | 4 个游戏同时开发 |
| 进度追踪 | `planning-with-files` | task_plan.md / findings.md / progress.md |
| 浏览器验证 | `dev-browser` | 截图验证、模拟用户操作、E2E 测试 |
| Bug 修复 | `systematic-debugging` | 系统化定位问题 |
| 完成确认 | `verification-before-completion` | 每个游戏完成前验证 |
| 分支管理 | `using-git-worktrees` | 每个游戏独立 worktree |
| 集成合并 | `finishing-a-development-branch` | 合并策略决策 |

---

## 里程碑

1. **M1**：项目脚手架 + 游戏大厅 UI（无游戏，仅占位卡片）
2. **M2**：Supabase 接入（Auth + 数据库 + RLS）
3. **M3**：4 款游戏实现（并行开发）
4. **M4**：分数提交 + 排行榜联调
5. **M5**：全链路 E2E 验证（dev-browser）
