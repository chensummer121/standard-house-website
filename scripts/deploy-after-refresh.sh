#!/bin/bash
#
# 数据刷新并触发 Vercel 部署脚本
# 
# 流程：
# 1. 执行 data-refresh.js 获取最新数据
# 2. 检查是否有数据变化
# 3. 如果有变化，git commit + push
# 4. Vercel 会自动检测到 push 并重新部署
#

set -e

# 项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 进入项目目录
cd "$PROJECT_ROOT"

log "==========================================="
log "  数据刷新与部署脚本启动"
log "==========================================="
log "  项目目录: $PROJECT_ROOT"
log ""

# 步骤1: 执行数据刷新脚本
log "--- 步骤1: 执行数据刷新 ---"
node "$SCRIPT_DIR/data-refresh.js"

# 步骤2: 检查 git 状态
log ""
log "--- 步骤2: 检查变化 ---"
CHANGES=$(git status --porcelain)

if [ -z "$CHANGES" ]; then
    log "⚠️ 没有检测到文件变化，跳过部署"
    exit 0
fi

log "检测到以下变化:"
echo "$CHANGES"

# 步骤3: Git 提交
log ""
log "--- 步骤3: Git 提交 ---"
git add -A

# 生成提交消息（包含日期）
COMMIT_MSG="chore: auto-refresh data $(date '+%Y-%m-%d %H:%M')"
git commit -m "$COMMIT_MSG"

log "✓ 已提交: $COMMIT_MSG"

# 步骤4: Git Push
log ""
log "--- 步骤4: Git Push ---"

# 检查是否有远程仓库配置
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REMOTE_URL" ]; then
    log "⚠️ 没有配置远程仓库，无法自动部署"
    exit 1
fi

# 如果远程 URL 没有包含 token，尝试使用 Vercel token
if [[ "$REMOTE_URL" != *"github.com"* ]]; then
    log "⚠️ 远程仓库配置异常，请检查 .git/config"
    exit 1
fi

# 执行 push（假设已经有正确的认证配置）
git push origin main

log ""
log "==========================================="
log "✓ 数据刷新并推送完成"
log "  Vercel 将自动检测到 push 并开始部署"
log "==========================================="

exit 0
