# Standerra - 全球投资情报系统

> 国家级投资情报系统，从"要不要去"到"怎么落地"

## 技术栈

- **Astro** - SSG框架，MDX原生支持
- **React** - Islands交互组件
- **Tailwind CSS** - 样式
- **Vercel** - 部署

## 项目结构

```
invest-db/
├── src/
│   ├── layouts/          # 页面布局
│   │   ├── BaseLayout.astro
│   ├── components/       # UI组件
│   │   ├── Header.astro
│   │   ├── Sidebar.astro
│   │   ├── Breadcrumb.astro
│   │   └── CountryCard.astro
│   ├── pages/           # 页面
│   │   ├── index.astro   # 全球首页
│   │   └── invest/[country]/
│   │       ├── index.astro      # 国家首页
│   │       ├── decision/        # 投资决策
│   │       ├── insight/         # 国家透视
│   │       ├── industry/         # 产业纵深
│   │       ├── toolkit/         # 实操工具
│   │       └── archive/         # 原始资料
│   └── content/          # 内容集合
│       └── countries/
│           └── ethiopia/  # 埃塞俄比亚数据
├── public/              # 静态资源
├── astro.config.mjs     # Astro配置
├── tailwind.config.mjs # Tailwind配置
└── vercel.json          # Vercel配置
```

## 多国家架构

项目设计支持多国家扩展：

1. **内容层**：`src/content/countries/[country]/` 下按国家划分
2. **页面层**：`src/pages/invest/[country]/` 使用动态路由
3. **Frontmatter**：`section` + `subsection` + `country` 三层结构

新增国家只需：
1. 在 `src/content/countries/` 创建新国家目录
2. 页面会自动生成

## 开发

```bash
# 安装依赖
npm install --legacy-peer-deps

# 本地开发
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 部署

已配置 Vercel 自动部署：

- 预览部署：`npx vercel`
- 生产部署：`npx vercel --prod`

## ⚠️ 数据恢复说明

原始的99个MD文件（包含5大区子目录内容）在迁移过程中意外丢失。
当前系统包含：
- 8个原始报告文件（已成功迁移）
- 完整的网站框架和导航结构

请从备份中恢复原始MD文件，放置到 `src/content/countries/ethiopia/` 下对应目录。

## 页面清单

### 首页
- `/` - 全球国家选择页

### 埃塞俄比亚
- `/invest/ethiopia` - 国家首页
- `/invest/ethiopia/decision` - 投资决策区
- `/invest/ethiopia/insight` - 国家透视区
- `/invest/ethiopia/industry` - 产业纵深区
- `/invest/ethiopia/toolkit` - 实操工具区
- `/invest/ethiopia/archive` - 原始资料区

### 子页面（26个）
- 各子区索引页
- 原始报告详情页

## License

© 2024 Standerra. All rights reserved.
