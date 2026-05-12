#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF报告自动化入库脚本 (ingest_report.py)
功能：PDF解析 → 分级判断 → 三处入库 → Build验证
作者：Agent System
版本：v1.1 - 集成OCR解析能力
"""

import os
import sys
import json
import re
import subprocess
import tempfile
import shutil
import random
import hashlib
import argparse
import datetime
import time
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any

# OCR 相关 imports（可选导入，失败时给出友好提示）
try:
    from pdf2image import convert_from_path
    import pytesseract
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

# ==================== 颜色输出 ====================
class Colors:
    """终端颜色输出"""
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    RESET = '\033[0m'
    
    @staticmethod
    def success(msg: str) -> str:
        return f"{Colors.GREEN}✓ {msg}{Colors.RESET}"
    
    @staticmethod
    def error(msg: str) -> str:
        return f"{Colors.RED}✗ {msg}{Colors.RESET}"
    
    @staticmethod
    def warning(msg: str) -> str:
        return f"{Colors.YELLOW}⚠ {msg}{Colors.RESET}"
    
    @staticmethod
    def info(msg: str) -> str:
        return f"{Colors.BLUE}ℹ {msg}{Colors.RESET}"
    
    @staticmethod
    def header(msg: str) -> str:
        return f"{Colors.BOLD}{Colors.BLUE}{'='*60}\n{msg}\n{'='*60}{Colors.RESET}"
    
    @staticmethod
    def progress(msg: str) -> str:
        return f"{Colors.YELLOW}⏳ {msg}{Colors.RESET}"


# ==================== 日志系统 ====================
class LogSystem:
    """日志系统，同时输出到文件和终端"""
    
    def __init__(self, log_dir: str = "./ingest_logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.log_file = self.log_dir / f"ingest_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        self.entries: List[Dict] = []
        
    def log(self, level: str, message: str, details: Any = None):
        """记录日志"""
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        entry = {
            'timestamp': timestamp,
            'level': level,
            'message': message,
            'details': details
        }
        self.entries.append(entry)
        
        # 写入文件
        with open(self.log_file, 'a', encoding='utf-8') as f:
            if details:
                f.write(f"[{timestamp}] [{level}] {message}\n{json.dumps(details, ensure_ascii=False, indent=2)}\n")
            else:
                f.write(f"[{timestamp}] [{level}] {message}\n")
        
        # 输出到终端
        if level == 'ERROR':
            print(Colors.error(f"[{timestamp}] {message}"))
        elif level == 'WARNING':
            print(Colors.warning(f"[{timestamp}] {message}"))
        elif level == 'SUCCESS':
            print(Colors.success(f"[{timestamp}] {message}"))
        elif level == 'INFO':
            print(Colors.info(f"[{timestamp}] {message}"))
        elif level == 'PROGRESS':
            print(Colors.progress(f"[{timestamp}] {message}"))
        else:
            print(f"[{timestamp}] {message}")
    
    def get_summary(self) -> str:
        """获取日志摘要"""
        success_count = sum(1 for e in self.entries if e['level'] == 'SUCCESS')
        error_count = sum(1 for e in self.entries if e['level'] == 'ERROR')
        warning_count = sum(1 for e in self.entries if e['level'] == 'WARNING')
        return f"日志文件: {self.log_file}\n成功: {success_count}, 错误: {error_count}, 警告: {warning_count}"


# ==================== 安全校验类 ====================
class SecurityValidator:
    """完整性校验工具"""
    
    @staticmethod
    def calculate_md5(content: str) -> str:
        """计算MD5哈希"""
        return hashlib.md5(content.encode('utf-8')).hexdigest()
    
    @staticmethod
    def calculate_sha256(content: str) -> str:
        """计算SHA256哈希"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    @staticmethod
    def calculate_file_hash(filepath: str, algorithm: str = 'sha256') -> str:
        """计算文件的哈希值"""
        hash_func = hashlib.sha256() if algorithm == 'sha256' else hashlib.md5()
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b''):
                hash_func.update(chunk)
        return hash_func.hexdigest()
    
    @staticmethod
    def count_chars(content: str) -> int:
        """计算字符数（不含空白）"""
        return len(content.strip())
    
    @staticmethod
    def count_lines(content: str) -> int:
        """计算行数"""
        return len(content.splitlines())
    
    @staticmethod
    def extract_samples(content: str, sample_count: int = 5, sample_length: int = 100) -> List[str]:
        """提取随机样本片段"""
        lines = content.splitlines()
        if len(lines) < sample_count * 2:
            return []
        
        # 排除过短或过长的行
        valid_lines = [l for l in lines if len(l) >= 50 and len(l) <= 500]
        if len(valid_lines) < sample_count:
            valid_lines = lines
        
        samples = []
        used_indices = set()
        while len(samples) < sample_count and len(valid_lines) > 0:
            idx = random.randint(0, len(valid_lines) - 1)
            if idx not in used_indices:
                line = valid_lines[idx]
                # 提取随机位置开始的100字符片段
                start = random.randint(0, max(0, len(line) - sample_length))
                sample = line[start:start + sample_length].strip()
                if len(sample) >= 30:  # 确保样本有足够长度
                    samples.append(sample)
                used_indices.add(idx)
        
        return samples
    
    @staticmethod
    def verify_samples_in_content(samples: List[str], content: str) -> Tuple[int, int, List[str]]:
        """验证样本是否在目标内容中"""
        found = []
        missing = []
        for sample in samples:
            if sample in content:
                found.append(sample[:50] + "..." if len(sample) > 50 else sample)
            else:
                missing.append(sample[:50] + "..." if len(sample) > 50 else sample)
        return len(found), len(missing), missing


# ==================== PDF解析类 ====================
class PDFParser:
    """PDF解析器，支持OCR增强"""
    
    def __init__(self, logger: LogSystem, use_ocr: bool = True, ocr_timeout: int = 120):
        """
        初始化PDF解析器
        
        Args:
            logger: 日志系统实例
            use_ocr: 是否使用OCR（默认True）
            ocr_timeout: OCR单页超时秒数（默认120秒）
        """
        self.logger = logger
        self.use_ocr = use_ocr and OCR_AVAILABLE
        self.ocr_timeout = ocr_timeout
        self.ocr_dpi = 200
        self.ocr_lang = 'chi_sim+eng'
        
        if use_ocr and not OCR_AVAILABLE:
            self.logger.log('WARNING', 'OCR库未安装，将使用pdftotext解析')
    
    def parse(self, pdf_path: str) -> Tuple[bool, str, Dict]:
        """
        解析PDF文件，按优先级尝试多种方法：
        1. OCR（pdf2image + pytesseract）
        2. pdftotext -layout（fallback）
        
        返回: (成功标志, 文本内容, 元数据)
        """
        self.logger.log('INFO', f"开始解析PDF: {pdf_path}")
        
        if not os.path.exists(pdf_path):
            self.logger.log('ERROR', f"PDF文件不存在: {pdf_path}")
            return False, "", {}
        
        # 获取PDF页数，用于进度显示
        try:
            result = subprocess.run(
                ['pdfinfo', pdf_path],
                capture_output=True,
                text=True,
                timeout=30
            )
            page_count = 0
            for line in result.stdout.splitlines():
                if line.startswith('Pages:'):
                    page_count = int(line.split(':')[1].strip())
                    break
        except:
            page_count = 0
        
        content = ""
        method = ""
        ocr_char_count = 0
        pdftotext_char_count = 0
        
        # ===== 方法1: OCR（默认优先） =====
        if self.use_ocr:
            self.logger.log('PROGRESS', f'开始OCR解析 (DPI={self.ocr_dpi}, 语言={self.ocr_lang}, 约{page_count}页)...')
            start_time = time.time()
            
            ocr_content, ocr_error = self._parse_with_ocr(pdf_path, page_count)
            
            if ocr_content and len(ocr_content.strip()) > 0:
                ocr_char_count = len(ocr_content.strip())
                elapsed = time.time() - start_time
                self.logger.log('INFO', f'OCR完成，耗时{elapsed:.1f}秒，提取{ocr_char_count}字符')
                content = ocr_content
                method = "ocr"
        
        # ===== 方法2: pdftotext（fallback 或 --no-ocr 模式） =====
        if not content:
            self.logger.log('INFO', '使用pdftotext解析...')
            content, pdftotext_error = self._parse_with_pdftotext(pdf_path)
            
            if content:
                pdftotext_char_count = len(content.strip())
                method = "pdftotext"
            else:
                self.logger.log('ERROR', f"pdftotext解析失败: {pdftotext_error}")
                return False, "", {}
        
        # ===== 校验：如果OCR结果少于pdftotext，发出警告 =====
        if ocr_char_count > 0 and pdftotext_char_count > 0:
            if ocr_char_count < pdftotext_char_count * 0.8:
                ratio = ocr_char_count / pdftotext_char_count * 100
                self.logger.log('WARNING', f'OCR结果({ocr_char_count})比pdftotext({pdftotext_char_count})少{100-ratio:.0f}%，内容可能不完整')
        
        if not content:
            self.logger.log('ERROR', "PDF解析失败，所有方法均未成功")
            return False, "", {}
        
        # 清理内容
        content = self._clean_content(content)
        
        # 验证字符数
        char_count = len(content.strip())
        if char_count < 1000:
            self.logger.log('WARNING', f"解析内容较少 ({char_count} 字符)，继续处理")
        
        # 计算指纹
        metadata = {
            'char_count': char_count,
            'line_count': len(content.splitlines()),
            'md5': SecurityValidator.calculate_md5(content),
            'sha256': SecurityValidator.calculate_sha256(content),
            'method': method,
            'source_file': pdf_path,
            'source_size': os.path.getsize(pdf_path),
            'ocr_char_count': ocr_char_count,
            'pdftotext_char_count': pdftotext_char_count
        }
        
        self.logger.log('SUCCESS', f"PDF解析成功，使用{method}，共{char_count}字符")
        return True, content, metadata
    
    def _parse_with_ocr(self, pdf_path: str, page_count: int = 0) -> Tuple[str, str]:
        """
        使用OCR解析PDF
        
        Args:
            pdf_path: PDF文件路径
            page_count: 预估页数（用于进度显示）
            
        Returns:
            (解析内容, 错误信息)
        """
        if not OCR_AVAILABLE:
            return "", "OCR库未安装"
        
        try:
            self.logger.log('INFO', f'转换PDF为图片 (DPI={self.ocr_dpi})...')
            
            # 转换PDF为图片
            images = convert_from_path(
                pdf_path,
                dpi=self.ocr_dpi,
                fmt='png',
                thread_count=2
            )
            
            total_pages = len(images)
            self.logger.log('INFO', f'PDF共{total_pages}页，开始OCR识别...')
            
            all_text = []
            for i, image in enumerate(images):
                try:
                    # 单页超时控制
                    page_start = time.time()
                    
                    # OCR识别
                    text = pytesseract.image_to_string(
                        image,
                        lang=self.ocr_lang,
                        config='--psm 1'  # 自动分页
                    )
                    
                    page_elapsed = time.time() - page_start
                    
                    # 进度显示
                    progress = f"[{i+1}/{total_pages}]"
                    if page_elapsed > 10:
                        self.logger.log('PROGRESS', f'{progress} 第{i+1}页耗时{page_elapsed:.1f}秒')
                    else:
                        self.logger.log('PROGRESS', f'{progress} 已完成')
                    
                    if text.strip():
                        all_text.append(text)
                    
                except Exception as e:
                    self.logger.log('WARNING', f'第{i+1}页OCR失败: {e}')
                    all_text.append(f"\n--- 第{i+1}页 [OCR失败] ---")
            
            full_text = '\n'.join(all_text)
            
            # OCR后处理清理
            full_text = self._cleanup_ocr_text(full_text)
            
            return full_text, ""
            
        except Exception as e:
            return "", str(e)
    
    def _cleanup_ocr_text(self, text: str) -> str:
        """
        清理OCR结果中的常见错误
        
        处理：
        - 连续3个以上空行
        - 中英文混合时的断行
        - 页码（"第X页"或纯数字行）
        - 常见OCR错误（如0/O混淆，l/1混淆等）
        """
        if not text:
            return text
        
        lines = text.splitlines()
        cleaned = []
        
        for line in lines:
            stripped = line.strip()
            
            # 跳过纯数字页码（如 "1", "12", "123"）
            if re.match(r'^[\d\s]+$', stripped):
                continue
            
            # 跳过 "第X页" 格式的页码
            if re.match(r'^第\s*\d+\s*页\s*$', stripped):
                continue
            
            # 跳过 "Page X" 格式
            if re.match(r'^Page\s+\d+\s*$', stripped, re.IGNORECASE):
                continue
            
            # 修复常见OCR错误
            cleaned_line = self._fix_ocr_errors(stripped)
            
            # 跳过空行（将在后面统一处理）
            if cleaned_line or not cleaned:
                cleaned.append(cleaned_line)
        
        # 合并并处理连续空行（保留最多2个连续空行）
        result_lines = []
        empty_count = 0
        for line in cleaned:
            if not line:
                empty_count += 1
                if empty_count <= 2:
                    result_lines.append('')
            else:
                empty_count = 0
                result_lines.append(line)
        
        # 移除开头和结尾的空行
        while result_lines and not result_lines[0]:
            result_lines.pop(0)
        while result_lines and not result_lines[-1]:
            result_lines.pop()
        
        return '\n'.join(result_lines)
    
    def _fix_ocr_errors(self, text: str) -> str:
        """
        修复常见OCR错误
        """
        if not text:
            return text
        
        # 修复引号配对（中文引号）
        replacements = [
            # 中文引号
            ('"', '"'),
            ('"', '"'),
            (''', "'"),
            (''', "'"),
            # 修复多余空格
            (r'\s+', ' '),
            # 修复句末标点前的空格
            (r' ([。！？；])', r'\1'),
            # 修复数字和中文之间的多余空格
            (r'([\d]) ([\d])', r'\1\2'),
        ]
        
        for old, new in replacements:
            text = re.sub(old, new, text)
        
        return text.strip()
    
    def _parse_with_pdftotext(self, pdf_path: str) -> Tuple[str, str]:
        """
        使用pdftotext解析PDF
        
        Returns:
            (解析内容, 错误信息)
        """
        try:
            result = subprocess.run(
                ['pdftotext', '-layout', pdf_path, '-'],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                return result.stdout, ""
            else:
                return "", result.stderr or "pdftotext返回非零退出码"
                
        except subprocess.TimeoutExpired:
            return "", "pdftotext超时"
        except Exception as e:
            return "", str(e)
    
    def _clean_content(self, content: str) -> str:
        """清理解析后的内容"""
        # 移除多余空白
        lines = content.splitlines()
        cleaned_lines = []
        prev_empty = False
        
        for line in lines:
            stripped = line.strip()
            if stripped:
                cleaned_lines.append(stripped)
                prev_empty = False
            elif not prev_empty:
                cleaned_lines.append('')  # 保留单个空行
                prev_empty = True
        
        # 移除开头和结尾的空行
        while cleaned_lines and not cleaned_lines[0]:
            cleaned_lines.pop(0)
        while cleaned_lines and not cleaned_lines[-1]:
            cleaned_lines.pop()
        
        return '\n'.join(cleaned_lines)


# ==================== 脱敏处理器 ====================
class Sanitizer:
    """内容脱敏处理器"""
    
    def __init__(self, logger: LogSystem):
        self.logger = logger
        
    def sanitize_with_explanation(self, content: str, title: str, 
                                   section: str, subsection: str,
                                   country: str, level: str) -> str:
        """
        脱敏处理，保留核心内容
        
        Args:
            content: 原始内容
            title: 标题
            section: 板块
            subsection: 子目录
            country: 国家
            level: 安全级别
            
        Returns:
            脱敏后的内容
        """
        # 标记敏感内容
        sensitive_patterns = [
            # 联系方式
            (r'\d{3,4}[-‐]\d{7,8}', '[联系方式]'),
            (r'1[3-9]\d{9}', '[手机号]'),
            # 邮箱
            (r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '[邮箱]'),
            # 银行账号
            (r'\d{10,30}', '[账号]'),
        ]
        
        result = content
        for pattern, replacement in sensitive_patterns:
            result = re.sub(pattern, replacement, result)
        
        return result


# ==================== 原子写入 ====================
class AtomicWriter:
    """原子写入，确保数据一致性"""
    
    def __init__(self, logger: LogSystem):
        self.logger = logger
        self.write_count = 0
        
    def write(self, filepath: str, content: str) -> Tuple[bool, str]:
        """
        原子写入文件
        
        策略：
        1. 写入临时文件
        2. 验证临时文件
        3. 重命名覆盖目标文件
        
        Args:
            filepath: 目标路径
            content: 内容
            
        Returns:
            (成功标志, 错误信息)
        """
        try:
            filepath = Path(filepath)
            filepath.parent.mkdir(parents=True, exist_ok=True)
            
            # 生成临时文件
            fd, tmppath = tempfile.mkstemp(
                dir=filepath.parent,
                prefix='.tmp_',
                suffix='_' + filepath.name
            )
            
            # 写入临时文件
            with os.fdopen(fd, 'w', encoding='utf-8') as f:
                f.write(content)
                f.flush()
                os.fsync(f.fileno())  # 确保写入磁盘
            
            # 验证
            with open(tmppath, 'r', encoding='utf-8') as f:
                verified = f.read()
            
            if len(verified) != len(content):
                os.unlink(tmppath)
                return False, f"写入验证失败: 长度不匹配"
            
            # 原子移动
            shutil.move(tmppath, filepath)
            self.write_count += 1
            
            return True, ""
            
        except Exception as e:
            if 'tmppath' in locals() and os.path.exists(tmppath):
                os.unlink(tmppath)
            return False, str(e)


# ==================== 路径管理器 ====================
class PathManager:
    """路径管理"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        
    def get_intel_kb_path(self, country: str, filename: str, 
                          level: str, subsection: str) -> Path:
        """获取intel-kb路径"""
        base = self.base_dir / "intel-kb"
        return base / country / level / subsection / f"{filename}.md"
    
    def get_wiki_path(self, country: str, filename: str) -> Path:
        """获取WIKI路径"""
        base = self.base_dir / "STANDERRA-Wiki"
        return base / country / f"{filename}.md"
    
    def get_website_path(self, country: str, section: str, 
                         subsection: str, filename: str) -> Path:
        """获取网站路径"""
        base = self.base_dir / "Standard-House-Website" / "src" / "content"
        return base / country / section / subsection / f"{filename}.md"


# ==================== 入库校验 ====================
class IngestValidator:
    """入库校验器"""
    
    def __init__(self, logger: LogSystem):
        self.logger = logger
        self.validation_count = 0
        
    def validate_write_result(self, filepath: str, content: str,
                              metadata: Dict, mode: str = 'full') -> Tuple[bool, Dict]:
        """
        校验写入结果
        
        模式:
        - full: 全文模式（字符数≥95%）
        - sanitized: 脱敏模式（字符数≥60%）
        
        Returns:
            (验证通过, 详细结果)
        """
        self.validation_count += 1
        results = {}
        checks_passed = 0
        checks_total = 0
        
        # 1. 读取文件验证
        checks_total += 1
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                written = f.read()
            if len(written) == len(content):
                checks_passed += 1
                results['length_match'] = True
            else:
                results['length_match'] = False
                results['length_diff'] = len(content) - len(written)
        except Exception as e:
            results['length_match'] = False
            results['file_error'] = str(e)
        
        # 2. MD5校验
        checks_total += 1
        written_md5 = hashlib.md5(written.encode('utf-8')).hexdigest()
        if written_md5 == metadata.get('md5', ''):
            checks_passed += 1
            results['md5_match'] = True
        else:
            results['md5_match'] = False
        
        # 3. 字符数校验
        source_chars = metadata.get('char_count', 0)
        target_chars = len(written.strip())
        results['source_chars'] = source_chars
        results['target_chars'] = target_chars
        
        if source_chars > 0:
            ratio = target_chars / source_chars
            results['ratio'] = ratio
            
            threshold = 0.95 if mode == 'full' else 0.60
            
            checks_total += 1
            if ratio >= threshold:
                checks_passed += 1
                results['ratio_pass'] = True
            else:
                results['ratio_pass'] = False
                self.logger.log('WARNING', f"字符数比例过低: {ratio:.1%} (阈值: {threshold:.0%})")
        else:
            results['ratio'] = 0
            results['ratio_pass'] = True  # 无法校验时跳过
        
        # 4. 样本验证
        samples = SecurityValidator.extract_samples(content)
        if samples:
            found, missing, missing_list = SecurityValidator.verify_samples_in_content(samples, written)
            results['samples'] = {'total': len(samples), 'found': found, 'missing': missing}
            
            if missing > 0:
                self.logger.log('WARNING', f"样本验证: {found}/{len(samples)} 成功")
        
        results['checks_passed'] = checks_passed
        results['checks_total'] = checks_total
        
        passed = (checks_passed == checks_total)
        if passed:
            self.logger.log('SUCCESS', f"写入验证通过")
        else:
            self.logger.log('ERROR', f"写入验证失败: {checks_passed}/{checks_total} 通过")
        
        return passed, results


# ==================== Build验证 ====================
class BuildVerifier:
    """Build验证器"""
    
    def __init__(self, logger: LogSystem):
        self.logger = logger
        self.base_dir = Path(__file__).parent.parent
        
    def verify(self, skip: bool = False) -> Tuple[bool, Dict]:
        """执行Build验证"""
        results = {'errors': [], 'warnings': []}
        
        if skip:
            self.logger.log('INFO', "跳过Build验证")
            return True, results
        
        try:
            # 记录初始状态
            before_build = self._get_dist_stats()
            
            # 执行构建
            self.logger.log('INFO', "执行npm run build...")
            
            result = subprocess.run(
                ['npm', 'run', 'build'],
                cwd=str(self.base_dir / "Standard-House-Website"),
                capture_output=True,
                text=True,
                timeout=300
            )
            
            # 记录结果
            results['stdout'] = result.stdout[-500:] if len(result.stdout) > 500 else result.stdout
            results['stderr'] = result.stderr[-500:] if len(result.stderr) > 500 else result.stderr
            
            if result.returncode != 0:
                self.logger.log('ERROR', f"Build失败: {result.returncode}")
                return False, results
            
            # 检查输出页数变化
            if after_build['html_files'] > before_build['html_files']:
                self.logger.log('SUCCESS', f"Build成功: 生成了{after_build['html_files'] - before_build['html_files']}个新页面")
                results['passed'] = True
                results['pages_added'] = after_build['html_files'] - before_build['html_files']
                return True, results
            else:
                results['passed'] = True
                self.logger.log('INFO', "Build成功，无新增页面")
                return True, results
                
        except subprocess.TimeoutExpired:
            results['errors'].append("Build超时")
            self.logger.log('ERROR', "Build超时（>5分钟）")
            return False, results
        except Exception as e:
            results['errors'].append(f"Build异常: {str(e)}")
            self.logger.log('ERROR', f"Build异常: {e}")
            return False, results
    
    def _get_dist_stats(self) -> Dict:
        """获取dist目录统计"""
        dist_dir = self.base_dir / "dist"
        if not dist_dir.exists():
            return {'html_files': 0, 'total_size': 0}
        
        html_files = list(dist_dir.rglob("*.html"))
        total_size = sum(f.stat().st_size for f in html_files if f.is_file())
        
        return {
            'html_files': len(html_files),
            'total_size': total_size
        }


# ==================== 主入库处理器 ====================
class ReportIngestor:
    """PDF报告入库主处理器"""
    
    def __init__(self, args: argparse.Namespace):
        self.args = args
        self.logger = LogSystem()
        self.validator = SecurityValidator()
        # 初始化PDF解析器，传递OCR设置
        self.parser = PDFParser(
            self.logger, 
            use_ocr=not args.no_ocr,
            ocr_timeout=getattr(args, 'ocr_timeout', 120)
        )
        self.sanitizer = Sanitizer(self.logger)
        self.writer = AtomicWriter(self.logger)
        self.path_manager = PathManager()
        self.ingest_validator = IngestValidator(self.logger)
        self.build_verifier = BuildVerifier(self.logger)
        
        # 处理结果
        self.results = {
            'source_metadata': {},
            'target_results': [],
            'overall_success': False
        }
        
    def process_single(self) -> Tuple[bool, Dict]:
        """处理单个PDF文件"""
        pdf_path = self.args.pdf
        
        print(Colors.header("PDF报告自动化入库"))
        self.logger.log('INFO', f"开始处理: {pdf_path}")
        self.logger.log('INFO', f"OCR模式: {'启用' if not self.args.no_ocr else '禁用'}")
        
        # ===== 步骤1: 解析PDF =====
        self.logger.log('INFO', "步骤1: 解析PDF...")
        success, content, metadata = self.parser.parse(pdf_path)
        if not success:
            return False, self.results
        
        self.results['source_metadata'] = metadata
        self.logger.log('INFO', f"源文件指纹: MD5={metadata['md5'][:16]}..., SHA256={metadata['sha256'][:16]}...")
        
        # ===== 步骤2: 目标路径 =====
        self.logger.log('INFO', "步骤2: 生成目标路径...")
        
        country = self.args.country
        filename = self.args.filename
        level = self.args.level
        section = self.args.section
        subsection = self.args.subsection
        title = self.args.title
        
        intel_kb_path = self.path_manager.get_intel_kb_path(country, filename, level, subsection)
        wiki_path = self.path_manager.get_wiki_path(country, filename)
        website_path = self.path_manager.get_website_path(country, section, subsection, filename)
        
        self.logger.log('INFO', f"intel-kb: {intel_kb_path}")
        self.logger.log('INFO', f"WIKI: {wiki_path}")
        self.logger.log('INFO', f"网站: {website_path}")
        
        # ===== 步骤3: 写入intel-kb全文版 =====
        self.logger.log('INFO', "步骤3: 写入intel-kb全文版...")
        
        # intel-kb不需要frontmatter，直接写入内容
        kb_success, kb_error = self.writer.write(str(intel_kb_path), content)
        if not kb_success:
            return False, self.results
        
        kb_valid, kb_results = self.ingest_validator.validate_write_result(
            str(intel_kb_path), content, metadata, 'full'
        )
        
        self.results['target_results'].append({
            'target': 'intel-kb',
            'path': str(intel_kb_path),
            'write_success': kb_success,
            'validation_passed': kb_valid,
            'details': kb_results
        })
        
        if not kb_valid:
            # 验证失败，删除文件
            if os.path.exists(intel_kb_path):
                os.unlink(intel_kb_path)
            return False, self.results
        
        # ===== 步骤4: 写入WIKI全文版 =====
        self.logger.log('INFO', "步骤4: 写入WIKI全文版...")
        
        wiki_success, wiki_error = self.writer.write(str(wiki_path), content)
        if not wiki_success:
            return False, self.results
        
        wiki_valid, wiki_results = self.ingest_validator.validate_write_result(
            str(wiki_path), content, metadata, 'full'
        )
        
        self.results['target_results'].append({
            'target': 'WIKI',
            'path': str(wiki_path),
            'write_success': wiki_success,
            'validation_passed': wiki_valid,
            'details': wiki_results
        })
        
        if not wiki_valid:
            if os.path.exists(wiki_path):
                os.unlink(wiki_path)
            return False, self.results
        
        # ===== 步骤5: 写入网站脱敏版 =====
        self.logger.log('INFO', "步骤5: 写入网站脱敏版...")
        
        sanitized_content = self.sanitizer.sanitize_with_explanation(
            content, title, section, subsection, country, level
        )
        
        website_success, website_error = self.writer.write(str(website_path), sanitized_content)
        if not website_success:
            return False, self.results
        
        # 脱敏版校验（字符数要求≥60%）
        website_valid, website_results = self.ingest_validator.validate_write_result(
            str(website_path), sanitized_content, metadata, 'sanitized'
        )
        
        self.results['target_results'].append({
            'target': 'website',
            'path': str(website_path),
            'write_success': website_success,
            'validation_passed': website_valid,
            'details': website_results
        })
        
        if not website_valid:
            if os.path.exists(website_path):
                os.unlink(website_path)
            return False, self.results
        
        # ===== 步骤6: Build验证 =====
        self.logger.log('INFO', "步骤6: Build验证...")
        
        build_success, build_results = self.build_verifier.verify(self.args.skip_build)
        
        self.results['build'] = {
            'success': build_success,
            'details': build_results
        }
        
        # ===== 完成 =====
        self.results['overall_success'] = True
        self._print_summary()
        
        return True, self.results
    
    def process_batch(self) -> Tuple[bool, List[Dict]]:
        """批量处理"""
        config_path = self.args.batch
        
        print(Colors.header("批量PDF报告入库"))
        self.logger.log('INFO', f"加载配置文件: {config_path}")
        
        with open(config_path, 'r', encoding='utf-8') as f:
            configs = json.load(f)
        
        self.logger.log('INFO', f"共{len(configs)}个任务待处理")
        self.logger.log('INFO', f"OCR模式: {'启用' if not self.args.no_ocr else '禁用'}")
        
        results = []
        all_success = True
        
        for i, config in enumerate(configs):
            print(Colors.header(f"处理第{i+1}/{len(configs)}个任务"))
            self.logger.log('INFO', f"任务: {config.get('filename', 'unknown')}")
            
            # 更新args
            for key, value in config.items():
                setattr(self.args, key, value)
            
            # 处理
            success, result = self.process_single()
            results.append(result)
            
            if not success:
                all_success = False
                self.logger.log('WARNING', f"任务失败: {config.get('filename')}")
        
        # 批量完成后执行一次build
        if all_success and not self.args.skip_build:
            self.logger.log('INFO', "所有任务完成，执行最终Build验证...")
            build_success, build_results = self.build_verifier.verify(False)
            if build_success:
                self.logger.log('SUCCESS', "最终Build验证通过")
            else:
                self.logger.log('ERROR', f"最终Build验证失败: {build_results.get('errors')}")
        elif all_success:
            self.logger.log('SUCCESS', "所有任务处理完成")
        
        return all_success, results
    
    def _print_summary(self):
        """打印处理摘要"""
        print(Colors.header("处理摘要"))
        
        print(f"\n{Colors.BOLD}源文件信息:{Colors.RESET}")
        meta = self.results['source_metadata']
        print(f"  - 字符数: {meta.get('char_count', 0):,}")
        print(f"  - 行数: {meta.get('line_count', 0):,}")
        print(f"  - MD5: {meta.get('md5', '')[:32]}")
        print(f"  - SHA256: {meta.get('sha256', '')[:32]}")
        print(f"  - 解析方法: {meta.get('method', 'unknown')}")
        if meta.get('ocr_char_count', 0) > 0:
            print(f"  - OCR字符数: {meta.get('ocr_char_count', 0):,}")
            print(f"  - pdftotext字符数: {meta.get('pdftotext_char_count', 0):,}")
        
        print(f"\n{Colors.BOLD}目标文件:{Colors.RESET}")
        for target in self.results['target_results']:
            status = Colors.success("✓") if target['validation_passed'] else Colors.error("✗")
            print(f"  {status} {target['target']}: {target['path']}")
            details = target['details']
            if details.get('target_chars'):
                ratio = details.get('ratio', 0)
                print(f"      字符数: {details['target_chars']:,} ({ratio:.1%})")
        
        print(f"\n{Colors.BOLD}{self.logger.get_summary()}{Colors.RESET}")


# ==================== 主函数 ====================
def parse_arguments():
    """解析命令行参数"""
    parser = argparse.ArgumentParser(
        description='PDF报告自动化入库脚本 (v1.1 - 支持OCR解析)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  # 单文件模式（默认启用OCR）
  python3 ingest_report.py --pdf "用户上传/report.pdf" --country uganda --section insight \\
    --subsection grey-economy --level internal --title "乌干达灰色经济" \\
    --filename "uganda-grey-economy"
  
  # 跳过OCR，使用pdftotext（更快，但可能丢失图片内容）
  python3 ingest_report.py --pdf "用户上传/report.pdf" --country uganda ... --no-ocr
  
  # 设置OCR超时时间
  python3 ingest_report.py --pdf "用户上传/report.pdf" --country uganda ... --ocr-timeout 180
  
  # 跳过Build验证
  python3 ingest_report.py --pdf "用户上传/report.pdf" --country kenya ... --skip-build
  
  # 批量模式
  python3 ingest_report.py --batch "ingest_report_config.json"
        """
    )
    
    # 输入参数
    parser.add_argument('--pdf', type=str, help='PDF文件路径')
    parser.add_argument('--batch', type=str, help='批量配置文件路径(JSON)')
    
    # 元数据参数
    parser.add_argument('--country', type=str, 
                       choices=['ethiopia', 'kenya', 'uganda', 'tanzania', 'rwanda'],
                       help='国家代码')
    parser.add_argument('--section', type=str,
                       choices=['decision', 'insight', 'industry', 'toolkit', 'archive'],
                       help='内容板块')
    parser.add_argument('--subsection', type=str, help='子目录名')
    parser.add_argument('--level', type=str,
                       choices=['public', 'internal', 'classified'],
                       help='安全级别')
    parser.add_argument('--title', type=str, help='报告标题')
    parser.add_argument('--filename', type=str, help='输出文件名(不含扩展名)')
    
    # OCR选项
    parser.add_argument('--no-ocr', action='store_true',
                       help='跳过OCR，直接使用pdftotext解析（更快但可能丢失图片内容）')
    parser.add_argument('--ocr-timeout', type=int, default=120,
                       help='OCR单页超时秒数（默认120秒）')
    parser.add_argument('--ocr-dpi', type=int, default=200,
                       help='OCR图像DPI（默认200）')
    
    # 选项
    parser.add_argument('--skip-build', action='store_true',
                       help='跳过Build验证')
    
    return parser.parse_args()


def main():
    """主函数"""
    args = parse_arguments()
    
    # 检查OCR库是否可用
    if not args.no_ocr and not OCR_AVAILABLE:
        print(Colors.warning("警告: OCR库未安装，自动切换到pdftotext模式"))
        print(Colors.info("提示: 安装OCR支持请运行: pip install pdf2image pytesseract"))
        args.no_ocr = True
    
    # 检查参数
    if args.batch:
        # 批量模式
        if not os.path.exists(args.batch):
            print(Colors.error(f"配置文件不存在: {args.batch}"))
            sys.exit(1)
        ingestor = ReportIngestor(args)
        success, results = ingestor.process_batch()
    else:
        # 单文件模式
        if not args.pdf:
            print(Colors.error("错误: --pdf 参数是必需的"))
            sys.exit(1)
        
        required = ['country', 'section', 'subsection', 'level', 'title', 'filename']
        missing = [p for p in required if not getattr(args, p)]
        if missing:
            print(Colors.error(f"错误: 缺少必需参数: {', '.join(missing)}"))
            sys.exit(1)
        
        ingestor = ReportIngestor(args)
        success, results = ingestor.process_single()
    
    # 退出码
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
