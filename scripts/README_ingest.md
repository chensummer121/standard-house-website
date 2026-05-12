# PDF报告自动化入库脚本 (ingest_report.py)

## 概述

`ingest_report.py` 是一个用于将PDF报告自动解析、入库并发布到多个目标位置的Python脚本。它实现了严格的完整性校验机制，确保零内容丢失。

## 功能特性

### 核心功能
- **PDF解析**：自动检测并使用pandoc或pdftotext解析PDF
- **分级入库**：根据安全级别自动路由到intel-kb的对应目录
- **三处入库**：
  - Intel-KB 全文版
  - STANDERRA-WIKI 全文版
  - 网站脱敏版 (.mdx)

### 安全校验机制

1. **源文件指纹校验**
   - 解析后立即计算MD5和SHA256
   - 每个写入目标完成后重新计算并比对

2. **字符数守恒检查**
   - 全文版：目标字符数 ≥ 源文件95%
   - 脱敏版：目标字符数 ≥ 源文件60%

3. **行级抽样验证**
   - 随机抽取5个100字符片段
   - 验证片段是否存在于目标文件中

4. **回读验证**
   - 写入后立即读取并比对内容

5. **原子性写入**
   - 先写临时文件(.tmp)
   - 验证通过后rename到目标路径
   - 失败时自动清理临时文件

6. **操作日志**
   - 详细记录每次操作到 `./ingest_logs/` 目录

## 安装依赖

脚本使用Python 3标准库，无需额外安装依赖。但需要以下系统工具：
- `pandoc` 或 `pdftotext`（用于PDF解析）

```bash
# 验证依赖
which pandoc pdftotext
```

## 使用方法

### 单文件模式

```bash
python3 ingest_report.py \
  --pdf "用户上传/report.pdf" \
  --country uganda \
  --section insight \
  --subsection grey-economy \
  --level internal \
  --title "乌干达灰色经济深度分析" \
  --filename "uganda-grey-economy"
```

### 跳过Build验证

```bash
python3 ingest_report.py \
  --pdf "用户上传/report.pdf" \
  --country kenya \
  --section industry \
  --subsection construction \
  --level classified \
  --title "肯尼亚建筑业分析" \
  --filename "kenya-construction" \
  --skip-build
```

### 批量模式

```bash
python3 ingest_report.py --batch "ingest_report_config.json"
```

## 参数说明

| 参数 | 必填 | 说明 | 可选值 |
|------|------|------|--------|
| `--pdf` | 是* | PDF文件路径 | 相对或绝对路径 |
| `--batch` | 是* | 批量配置文件路径 | JSON文件 |
| `--country` | 是 | 国家代码 | ethiopia, kenya, uganda, tanzania, rwanda |
| `--section` | 是 | 内容板块 | decision, insight, industry, toolkit, archive |
| `--subsection` | 是 | 子目录名 | 如 grey-economy, power-structure 等 |
| `--level` | 是 | 安全级别 | public, internal, classified |
| `--title` | 是 | 报告标题 | 任意字符串 |
| `--filename` | 是 | 输出文件名 | 英文字符，无扩展名 |
| `--skip-build` | 否 | 跳过Build验证 | flag |

*`--pdf`和`--batch`二选一

## 脱敏规则

网站脱敏版会自动应用以下规则：

| 规则 | 示例 |
|------|------|
| 品牌替换 | 尧柏 → 西控集团 |
| 电话号码 | +86-138-0000-0000 → *** |
| 邮箱地址 | xxx@example.com → [邮箱已删除] |
| 具体金额 | 12.5亿美元 → 数十亿美元级 |
| Gemini链接 | https://gemini.google.com/... → [报告链接已删除] |
| 详细地址 | XX市XX路XX号 → [详细地址已删除] |
| 人名+职位 | President Museveni → 某Museveni |
| 操作细节 | 详细步骤段落 → 详见内部报告 |

## 路径规则

### Intel-KB

| 分级 | 路径格式 |
|------|----------|
| public | `/root/intel-kb/structured-data/{country}/{filename}.md` |
| internal | `/root/intel-kb/internal/{subsection}/{country}/{filename}.md` |
| classified | `/root/intel-kb/classified/{country}/{filename}.md` |

### STANDERRA-WIKI

路径：`/app/data/所有对话/主对话/STANDERRA-Wiki/三、支撑域/市场研究/{country}/deep-research/{filename}.md`

### 网站

路径：`/root/invest-db/src/content/countries/{country}/{section}/{subsection}/{filename}.mdx`

## 输出示例

```
============================================================
PDF报告自动化入库
============================================================
[2026-05-13 10:30:00] ℹ 开始处理: 用户上传/report.pdf
[2026-05-13 10:30:05] ✓ PDF解析成功，使用pandoc，共45,230字符
[2026-05-13 10:30:05] ℹ 源文件指纹: MD5=a1b2c3..., SHA256=d4e5f6...
[2026-05-13 10:30:06] ℹ 写入intel-kb全文版...
[2026-05-13 10:30:06] ✓ 文件写入成功: /root/intel-kb/internal/...
[2026-05-13 10:30:06] ✓ 校验通过: /root/intel-kb/internal/...
[2026-05-13 10:30:07] ℹ 写入WIKI全文版...
[2026-05-13 10:30:07] ✓ 文件写入成功: ...
[2026-05-13 10:30:07] ✓ 校验通过: ...
[2026-05-13 10:30:08] ℹ 写入网站脱敏版...
[2026-05-13 10:30:08] ✓ 文件写入成功: ...
[2026-05-13 10:30:08] ✓ 校验通过: ...
[2026-05-13 10:30:09] ℹ 跳过Build验证（--skip-build参数）

============================================================
处理摘要
============================================================

源文件信息:
  - 字符数: 45,230
  - 行数: 1,234
  - MD5: a1b2c3d4e5f6...

目标文件:
  ✓ intel-kb: /root/intel-kb/internal/uganda/uganda-grey-economy.md
      字符数: 45,100 (99.7%)
  ✓ WIKI: /app/data/.../uganda-grey-economy.md
      字符数: 45,100 (99.7%)
  ✓ website: /root/invest-db/src/.../uganda-grey-economy.mdx
      字符数: 32,500 (71.9%)

日志文件: ./ingest_logs/ingest_20260513_103000.log
成功: 12, 错误: 0, 警告: 1
```

## 配置文件格式

```json
[
  {
    "pdf": "用户上传/report1.pdf",
    "country": "uganda",
    "section": "insight",
    "subsection": "grey-economy",
    "level": "internal",
    "title": "报告标题1",
    "filename": "report-1"
  },
  {
    "pdf": "用户上传/report2.pdf",
    "country": "kenya",
    "section": "industry",
    "subsection": "construction",
    "level": "classified",
    "title": "报告标题2",
    "filename": "report-2"
  }
]
```

## 错误处理

脚本会在以下情况下报错并停止：
- PDF文件不存在或解析失败
- 字符数守恒校验失败
- 抽样验证失败（超过阈值）
- 回读内容不一致
- 任何写入错误

失败时：
- 已写入的文件会被自动删除
- 错误详情记录到日志文件
- 退出码为1

## 日志位置

日志文件保存在 `./ingest_logs/` 目录，格式为：
`ingest_YYYYMMDD_HHMMSS.log`

## 注意事项

1. 建议首次运行时使用 `--skip-build` 测试
2. 确保有足够的写入权限到目标目录
3. 批量处理时，前一个任务失败不会影响后续任务
4. Build验证可能需要较长时间（最多5分钟超时）

## 故障排除

### PDF解析失败
- 确认系统已安装pandoc或pdftotext
- 尝试手动解析：`pandoc yourfile.pdf -t plain`

### 字符数校验失败
- 检查PDF是否有扫描页（无法解析）
- 确认源文件字符数>1000

### Build失败
- 检查npm依赖是否完整
- 手动执行：`cd /root/invest-db && npm run build`
