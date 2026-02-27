# GameBox — AI Dev Edition

一个基于 Next.js + Supabase 构建的游戏合集平台，包含贪吃蛇、2048、五子棋、记忆翻牌等经典小游戏。

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 | 前端框架（App Router） |
| React 19 | UI |
| Supabase | 数据库 / 用户认证 |
| TailwindCSS v4 | 样式 |
| shadcn/ui | UI 组件库 |
| TypeScript | 类型安全 |

---

## 快速开始

### 1. 克隆项目并安装依赖

```bash
git clone <repo-url>
cd gamebox_aidev
npm install
```

### 2. 配置 Supabase

#### 2.1 创建 Supabase 项目

前往 [https://supabase.com/dashboard](https://supabase.com/dashboard)，新建一个项目。

#### 2.2 初始化数据库

在 Supabase 控制台的 **SQL Editor** 中执行以下 SQL：

```sql
-- 游戏元数据表
CREATE TABLE games (
  slug        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('puzzle', 'arcade', 'board', 'casual')),
  description TEXT NOT NULL DEFAULT '',
  thumbnail   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 分数表
CREATE TABLE scores (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_slug  TEXT REFERENCES games(slug) ON DELETE CASCADE NOT NULL,
  score      INTEGER NOT NULL CHECK (score >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 开启 RLS
ALTER TABLE games  ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 权限策略
CREATE POLICY "games_read_public"  ON games  FOR SELECT USING (true);
CREATE POLICY "scores_read_public" ON scores FOR SELECT USING (true);
CREATE POLICY "scores_insert_own"  ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 初始游戏数据
INSERT INTO games (slug, name, category, description) VALUES
  ('snake',  '贪吃蛇',   'arcade',  '经典街机游戏，控制蛇吃食物并越长越长'),
  ('2048',   '2048',     'puzzle',  '滑动方块合并数字，达到2048'),
  ('gomoku', '五子棋',   'board',   '双人对战，先连五子者获胜'),
  ('memory', '记忆翻牌', 'casual',  '翻开配对的卡片，考验你的记忆力');
```

#### 2.3 配置环境变量

复制示例文件：

```bash
copy .env.local.example .env.local   # Windows
# 或
cp .env.local.example .env.local     # macOS / Linux
```

编辑 `.env.local`，填入你的 Supabase 项目信息（在 **Settings → API** 中获取）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## 可用脚本

```bash
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
npm run start  # 运行生产服务器
npm run lint   # 代码检查
```
