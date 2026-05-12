#!/usr/bin/env python3
"""批量生成卢旺达投资数据库MD文件"""

import os
from pathlib import Path

BASE_PATH = "/root/invest-db/src/content/countries/rwanda"

# 目录结构配置
DIRECTORIES = [
    "decision/quick-cards",
    "decision",
    "insight/why-exist",
    "insight/money-flow",
    "insight/data-panels",
    "insight/social-safety",
    "insight/structural-change",
    "insight/power-structure",
    "industry/finance",
    "industry/artery",
    "industry/domestic",
    "industry/arbitrage",
    "industry/foundation",
    "toolkit/companies",
    "toolkit/laws",
    "toolkit/cities",
    "toolkit/data-dashboards",
    "archive",
]

# 文件定义
FILES = {
    "decision/quick-cards": [
        ("agriculture", "卢旺达农业投资速查卡", "咖啡、茶叶、蔬菜种植，山地农业特色"),
        ("education", "卢旺达教育投资速查卡", "ICT培训、职业教育的数字人才培育"),
        ("energy", "卢旺达能源投资速查卡", "地热、水电、太阳能多元化能源"),
        ("fintech", "卢旺达金融科技速查卡", "移动支付M-Pesa，数字金融普惠"),
        ("healthcare", "卢旺达医疗投资速查卡", "全民医保Mutuelle de Sante，分级诊疗"),
        ("ict", "卢旺达ICT投资速查卡", "基加利创新城，数字经济先锋"),
        ("logistics", "卢旺达物流投资速查卡", "内陆国物流枢纽，跨境贸易通道"),
        ("manufacturing", "卢旺达制造业速查卡", "农产品加工，矿产冶炼"),
        ("mining", "卢旺达矿业投资速查卡", "3T矿产(锡/钨/钽)，战略矿产出口"),
        ("real-estate", "卢旺达房地产速查卡", "基加利城市扩张，商业住宅需求旺盛"),
        ("tourism", "卢旺达旅游投资速查卡", "山地大猩猩观光，非洲最安全目的地"),
    ],
    "decision": [
        ("index", "卢旺达投资决策框架", "一站式决策工具箱"),
        ("one-page-decision", "卢旺达一页投资决策", "高层速览投资全景"),
        ("policy-window", "卢旺达政策窗口期", "卡加梅执政期政策机遇"),
        ("priority-matrix", "卢旺达投资优先级矩阵", "行业优先级与时机判断"),
        ("red-flags", "卢旺达投资红牌警示", "风险识别与规避要点"),
        ("risk-scenarios", "卢旺达投资情景分析", "三种情景下的投资应对"),
    ],
    "insight/why-exist": [
        ("overview", "卢旺达凭什么存在", "非洲新加坡的崛起之路"),
        ("kigali-dream", "基加利梦想", "清洁城市与数字转型"),
        ("post-genocide", "大屠杀后的重建奇迹", "卡加梅领导下的社会修复"),
    ],
    "insight/money-flow": [
        ("fdi-patterns", "卢旺达外资流入模式", "一站式RDB吸引机制"),
        ("diaspora-remittance", "卢旺达侨汇流动", "海外卢旺达人汇款"),
        ("mining-revenue", "卢旺达矿业收益流向", "3T矿产出口与收益分配"),
    ],
    "insight/data-panels": [
        ("gdp-growth", "卢旺达GDP增长面板", "20年持续高增长轨迹"),
        ("trade-balance", "卢旺达贸易平衡面板", "进口依赖与出口潜力"),
        ("fdi-inflow", "卢旺达FDI流入面板", "外资来源与行业分布"),
        ("population-youth", "卢旺达人口结构面板", "年轻人口结构红利"),
        ("ict-adoption", "卢旺达ICT普及面板", "数字基础设施指标"),
        ("tourism-stats", "卢旺达旅游业面板", "大猩猩旅游核心数据"),
        ("mining-output", "卢旺达矿业产出面板", "3T矿产产量统计"),
        ("eac-trade", "卢旺达EAC贸易面板", "东非共同体内部贸易"),
    ],
    "insight/social-safety": [
        ("national-unity", "卢旺达民族和解", "团结与重建的社会工程"),
        ("crime-safety", "卢旺达治安安全", "非洲最安全国家之一"),
    ],
    "insight/structural-change": [
        ("agricultural-transformation", "卢旺达农业转型", "从 subsistence 到 commercial"),
        ("digital-leapfrog", "卢旺达数字跨越", "跳过传统直接进入数字时代"),
        ("urbanization-kigali", "基加利城市化", "快速城市化进程"),
    ],
    "insight/power-structure": [
        ("kagame-governance", "卡加梅治理模式", "强政府高效决策"),
        ("rdb-one-stop", "RDB一站式服务", "投资审批高效透明"),
    ],
    "industry/finance": [
        ("banking", "卢旺达银行业", "区域银行布局，本地化服务"),
        ("capital-market", "卢旺达资本市场", "RWANDA SE/RSSP证券交易"),
        ("fx-system", "卢旺达外汇体系", "RWF汇率机制与外汇管理"),
    ],
    "industry/artery": [
        ("road-network", "卢旺达公路网络", "东非交通枢纽建设"),
        ("logistics-hub", "卢旺达物流枢纽", "内陆国贸易通道"),
        ("digital-infrastructure", "卢旺达数字基础设施", "宽带、5G、IDC"),
    ],
    "industry/domestic": [
        ("retail", "卢旺达零售业", "现代零售与传统市场并存"),
        ("housing", "卢旺达住房市场", "基加利住房短缺与机遇"),
        ("consumer-goods", "卢旺达消费品", "中产阶级崛起消费升级"),
        ("telecom-media", "卢旺达电信媒体", "MTN与Tigo双寡头竞争"),
    ],
    "industry/arbitrage": [
        ("coffee-arbitrage", "卢旺达咖啡套利", "精品咖啡出口优势"),
        ("tea-arbitrage", "卢旺达茶叶套利", "特种茶出口欧洲"),
        ("mining-arbitrage", "卢旺达矿产套利", "3T矿产国际定价"),
    ],
    "industry/foundation": [
        ("agriculture-foundation", "卢旺达农业基础", "山地农业现代化"),
        ("energy-foundation", "卢旺达能源基础", "发电与输配电"),
        ("manufacturing-base", "卢旺达制造业基础", "工业化起步阶段"),
    ],
    "toolkit/companies": [
        ("top-companies", "卢旺达头部企业", "本地巨头与国企"),
        ("chinese-companies", "在卢旺达中资企业", "中资投资图谱"),
        ("industrial-parks", "卢旺达工业园区", "经济特区和工业区"),
        ("key-projects", "卢旺达重点项目", "国家级工程项目"),
    ],
    "toolkit/laws": [
        ("investment-law", "卢旺达投资法", "投资保护与激励"),
        ("company-law", "卢旺达公司法", "企业注册与治理"),
        ("labor-law", "卢旺达劳动法", "劳工法规与用工"),
        ("tax-incentives", "卢旺达税收优惠", "免税期与优惠税率"),
        ("land-law", "卢旺达土地法", "土地获取与使用"),
        ("mining-code", "卢旺达矿业法", "矿产勘探开发法规"),
        ("ict-regulation", "卢旺达ICT法规", "数字经济监管框架"),
    ],
    "toolkit/cities": [
        ("kigali", "基加利", "首都与经济中心"),
        ("huye", "胡耶", "南部大学城"),
        ("musanze", "穆桑泽", "火山地区门户"),
        ("rwamagana", "鲁瓦马加纳", "东部工业走廊"),
    ],
    "toolkit/data-dashboards": [
        ("economic-dashboard", "卢旺达经济仪表盘", "核心经济指标"),
        ("investment-dashboard", "卢旺达投资仪表盘", "FDI与营商数据"),
        ("trade-dashboard", "卢旺达贸易仪表盘", "进出口统计"),
        ("demographics-dashboard", "卢旺达人口仪表盘", "人口与社会数据"),
    ],
    "archive": [
        ("history-archive", "卢旺达历史档案", "1994年后重建历程"),
    ],
}

def get_content(filename, title, desc, section, subsection):
    """生成文件内容"""
    
    if section == "decision" and subsection == "quick-cards":
        return f'''---
title: "{title}"
section: decision
subsection: "quick-cards"
country: "rwanda"
---

# {title}

## 一句话
卢旺达是东非内陆国，"非洲新加坡"愿景，ICT驱动经济转型。

## 关键数据
- **GDP**: ~$140亿
- **人均GDP**: ~$1,000
- **GDP增速**: 8.2%
- **FDI流入**: $4.1亿
- **人口**: 1,400万

## 投资逻辑
1. ICT与数字经济 - 基加利创新城
2. 山地大猩猩旅游 - 高端生态旅游
3. 3T矿产出口 - 锡/钨/钽战略矿产
4. 精品咖啡茶叶 - 特种农产品出口

## 风险
- 内陆国物流成本高
- 电力供应稳定性
- 市场规模有限
'''
    
    elif section == "decision" and subsection == "":
        if filename == "index":
            return f'''---
title: "{title}"
section: decision
subsection: "decision"
country: "rwanda"
---

# {title}

## 决策框架概览

### 政治稳定性
- 卡加梅执政延续性强
- 政府效率高，决策快速
- 大屠杀后社会凝聚力强

### 经济机遇
- 8%以上高增长持续
- ICT数字经济转型
- 旅游业持续增长

### 投资风险
- 内陆国物流瓶颈
- 市场规模较小
- 电力成本较高

## 决策建议
- **优先**: ICT、旅游、矿业
- **次优**: 农业加工、建筑
- **慎入**: 零售竞争激烈
'''
        elif filename == "one-page-decision":
            return f'''---
title: "{title}"
section: decision
subsection: "decision"
country: "rwanda"
---

# {title}

## 卢旺达投资一页决策

| 维度 | 评估 | 备注 |
|------|------|------|
| 政治 | ★★★★★ | 卡加梅强政府，稳定 |
| 经济 | ★★★★☆ | 高增长，市场小 |
| 营商 | ★★★★★ | 全球第38，清廉 |
| 风险 | ★★★☆☆ | 内陆物流成本 |

**一句话**: 政策友好，优先数字经济和旅游
'''
        elif filename == "policy-window":
            return f'''---
title: "{title}"
section: decision
subsection: "decision"
country: "rwanda"
---

# {title}

## 当前政策窗口

### Vision 2050
- 非洲新加坡目标
- 高收入国家愿景
- 持续政策支持

### RDB一站式
- 单一窗口投资审批
- 48小时公司注册
- 全程投资服务

### 税收激励
- 出口加工区免税
- 高新技术企业优惠
- 农业投资优惠
'''
        elif filename == "priority-matrix":
            return f'''---
title: "{title}"
section: decision
subsection: "decision"
country: "rwanda"
---

# {title}

## 投资优先级矩阵

| 行业 | 吸引力 | 可行性 | 优先级 |
|------|--------|--------|--------|
| ICT/数字经济 | 高 | 高 | ★★★★★ |
| 生态旅游 | 高 | 中 | ★★★★☆ |
| 矿业(3T) | 高 | 高 | ★★★★☆ |
| 咖啡/茶叶 | 中 | 高 | ★★★☆☆ |
| 能源 | 高 | 中 | ★★★☆☆ |
| 制造业 | 中 | 中 | ★★☆☆☆ |
'''
        elif filename == "red-flags":
            return f'''---
title: "{title}"
section: decision
subsection: "decision"
country: "rwanda"
---

# {title}

## 红牌警示

### ⚠️ 物流成本
- 内陆国，无海港
- 依赖肯尼亚蒙巴萨港
- 运输成本高

### ⚠️ 市场容量
- 人口1400万
- 消费能力有限
- 规模经济难实现

### ⚠️ 电力成本
- 电价相对较高
- 停电偶有发生
- 增加运营成本

### ⚠️ 政策风险
- 政府干预较强
- 卡加梅后时代不确定
'''
        elif filename == "risk-scenarios":
            return f'''---
title: "{title}"
section: decision
subsection: "decision"
country: "rwanda"
---

# {title}

## 情景分析

### 乐观情景 (60%)
- 卡加梅继续执政
- ICT旅游持续增长
- FDI持续流入
- **行动**: 积极布局数字经济

### 基线情景 (30%)
- 稳定发展
- 增速6-7%
- 机遇与风险并存
- **行动**: 谨慎投资，稳定运营

### 悲观情景 (10%)
- 政策变化
- 经济放缓
- 区域不稳定
- **行动**: 规避风险，保持灵活
'''
    
    elif section == "insight" and subsection == "why-exist":
        if filename == "overview":
            return f'''---
title: "{title}"
section: insight
subsection: "why-exist"
country: "rwanda"
---

# 🌍 {title}

## 地缘战略定位

### 内陆枢纽
- 东非共同体成员
- 连接肯尼亚、乌干达、坦桑尼亚、布隆迪
- 区域贸易通道

### 安全模范
- 非洲最安全国家之一
- 低犯罪率，治安良好
- 国际形象重塑

### 数字先锋
- "非洲新加坡"愿景
- ICT驱动经济转型
- 政府数字化程度高

## 历史定位

### 大屠杀后重建
- 1994年后和平重建
- 卡加梅强有力领导
- 民族和解成功典范

### 发展奇迹
- 20年持续高增长
- 从贫困到中等收入
- 社会发展指标提升

## 经济定位

### 转型经济体
- 农业向服务业转型
- ICT数字经济崛起
- 旅游业持续增长

### 出口导向
- 3T矿产出口
- 咖啡茶叶出口
- 旅游服务出口

## 核心竞争优势

1. **政治稳定**: 卡加梅政府高效
2. **安全环境**: 非洲最安全目的地
3. **营商环境**: 全球第38位
4. **数字基础设施**: 非洲领先
'''
        elif filename == "kigali-dream":
            return f'''---
title: "{title}"
section: insight
subsection: "why-exist"
country: "rwanda"
---

# {title}

## 基加利愿景

### 非洲最清洁城市
- 禁用塑料袋
- 每月全民大扫除
- 城市管理典范

### 数字城市
- 免费WiFi覆盖
- 电子政务普及
- 智慧城市项目

## 创新生态系统

### Kigali Innovation City
- 科技园区建设
- 创业孵化支持
- 数字技能培训

### 科技人才
- 编程教育普及
- 技术培训项目
- 年轻数字人才储备
'''
        elif filename == "post-genocide":
            return f'''---
title: "{title}"
section: insight
subsection: "why-exist"
country: "rwanda"
---

# {title}

## 历史背景

### 1994年大屠杀
- 胡图族与图西族冲突
- 百日之内近百万人死亡
- 国家崩溃

## 重建进程

### 卡加梅领导
- 结束冲突，建立秩序
- 图西族主导新政府
- 强力稳定措施

### 民族和解
- Gacaca传统司法
- 和解与问责平衡
- 社会凝聚力重建

## 发展成就

### 经济复苏
- 年均8%增长
- 贫困率大幅下降
- 基础设施重建

### 国际认可
- 发展典范
- 区域稳定力量
- 软实力提升
'''
    
    elif section == "insight" and subsection == "money-flow":
        if filename == "fdi-patterns":
            return f'''---
title: "{title}"
section: insight
subsection: "money-flow"
country: "rwanda"
---

# {title}

## 外资流入特征

### 来源分布
- 荷兰、英国、美国为主
- 东非邻国投资
- 中国投资增长

### 行业分布
- 服务业(金融、ICT)
- 制造业
- 旅游业

## RDB吸引机制

### 一站式服务
- 投资审批
- 公司注册
- 许可办理

### 激励政策
- 税收优惠
- 土地优惠
- 签证便利
'''
        elif filename == "diaspora-remittance":
            return f'''---
title: "{title}"
section: insight
subsection: "money-flow"
country: "rwanda"
---

# {title}

## 侨汇概况

### 规模
- 侨汇是重要外汇来源
- 主要来自欧洲、美国
- 增长稳定

### 渠道
- 银行转账
- 移动支付
- 汇款公司
'''
        elif filename == "mining-revenue":
            return f'''---
title: "{title}"
section: insight
subsection: "money-flow"
country: "rwanda"
---

# {title}

## 3T矿产收益

### 锡(Tin)
- 主要来自东部省
- 出口到亚洲

### 钨(Tungsten)
- 战略矿产
- 全球供应重要

### 钽(Tantalum)
- 电子元件原料
- 高价值出口

## 收益分配

### 政府收入
- 矿产特许权费
- 出口关税
- 企业税收

### 社区发展
- 矿业社区基金
- 基础设施投入
'''
    
    elif section == "insight" and subsection == "data-panels":
        return f'''---
title: "{title}"
section: insight
subsection: "data-panels"
country: "rwanda"
---

# {title}

## 核心数据

### 关键指标
- GDP: $140亿
- 人口: 1400万
- 人均GDP: $1,000
- GDP增速: 8.2%
- 通胀率: 5.4%

## 趋势分析

### 增长轨迹
- 持续20年高增长
- 后疫情快速恢复
- 数字化转型加速

## 数据来源
- NISR (国家统计局)
- 世界银行
- IMF
'''
    
    elif section == "insight" and subsection == "social-safety":
        return f'''---
title: "{title}"
section: insight
subsection: "social-safety"
country: "rwanda"
---

# {title}

## 社会安全

### 治安状况
- 非洲最安全国家之一
- 低犯罪率
- 社区警务有效

### 社会稳定
- 民族和解成功
- 社会凝聚力强
- 政治稳定
'''
    
    elif section == "insight" and subsection == "structural-change":
        return f'''---
title: "{title}"
section: insight
subsection: "structural-change"
country: "rwanda"
---

# {title}

## 结构性转型

### 产业升级
- 农业→服务业
- 传统→数字
- 制造→高技术

### 城市化
- 基加利快速扩张
- 二三线城市发展
- 基础设施改善
'''
    
    elif section == "insight" and subsection == "power-structure":
        return f'''---
title: "{title}"
section: insight
subsection: "power-structure"
country: "rwanda"
---

# {title}

## 权力结构

### 卡加梅体制
- 强政府模式
- 高效决策
- 长期执政稳定

### 执政党
- 卢旺达爱国阵线(RPF)
- 图西族主导
- 精英治理

## RDB一站式

### 职能
- 投资审批
- 公司注册
- 许可证办理

### 效率
- 48小时注册
- 单一窗口
- 全程服务
'''
    
    elif section == "industry" and subsection == "finance":
        return f'''---
title: "{title}"
section: industry
subsection: "finance"
country: "rwanda"
---

# {title}

## 银行业

### 主要银行
- BK (Bank of Kigali)
- Equity BCDC
- Cogebanque

### 特点
- 区域化布局
- 数字化转型
- 普惠金融发展

## 资本市场

### RSSP
- 卢旺达证券交易
- 政府债券为主
- 发展初期

## 外汇管理

### RWF
- 卢旺达法郎
- 相对稳定
- 外汇管制宽松
'''
    
    elif section == "industry" and subsection == "artery":
        return f'''---
title: "{title}"
section: industry
subsection: "artery"
country: "rwanda"
---

# {title}

## 交通基础设施

### 公路
- 路网密度高
- 连接EAC各国
- 道路维护改善

### 航空
- 基加利国际机场
- 卢旺达航空扩张
- 区域航空枢纽

## 数字基础设施

### 宽带
- 光纤网络扩展
- 4G覆盖提升
- 5G试点推进

### 数据中心
- 区域数据中心
- 云服务发展
'''
    
    elif section == "industry" and subsection == "domestic":
        return f'''---
title: "{title}"
section: industry
subsection: "domestic"
country: "rwanda"
---

# {title}

## 消费市场

### 市场特点
- 规模较小但增长
- 中产阶级兴起
- 数字化消费

### 竞争格局
- 本地企业为主
- 区域品牌进入
- 电商起步
'''
    
    elif section == "industry" and subsection == "arbitrage":
        return f'''---
title: "{title}"
section: industry
subsection: "arbitrage"
country: "rwanda"
---

# {title}

## 套利机会

### 咖啡出口
- 精品咖啡认证
- 公平贸易
- 高端市场价格

### 矿产出口
- 3T矿产国际定价
- 出口关税优惠
- 直连国际买家

## 贸易通道

### 蒙巴萨路线
- 肯尼亚蒙巴萨港
- 公路运输
- 成本较高
'''
    
    elif section == "industry" and subsection == "foundation":
        return f'''---
title: "{title}"
section: industry
subsection: "foundation"
country: "rwanda"
---

# {title}

## 产业基础

### 农业
- 山地农业特色
- 咖啡茶叶为主
- 现代化起步

### 能源
- 水电为主
- 地热潜力
- 太阳能发展

### 制造
- 初级阶段
- 农产品加工
- 进口替代
'''
    
    elif section == "toolkit" and subsection == "companies":
        return f'''---
title: "{title}"
section: toolkit
subsection: "companies"
country: "rwanda"
---

# {title}

## 头部企业

### BK (Bank of Kigali)
- 最大商业银行
- 上市银行
- 数字化领先

### MTN Rwanda
- 最大电信运营商
- 移动支付

### RwandAir
- 国有航空公司
- 区域扩张

## 中资企业

### 中国路桥
- 基础设施
- 公路建设

### 中国水电
- 能源项目
'''
    
    elif section == "toolkit" and subsection == "laws":
        return f'''---
title: "{title}"
section: toolkit
subsection: "laws"
country: "rwanda"
---

# {title}

## 法律框架

### 投资法
- 投资保护
- 激励政策
- 争端解决

### 公司法规
- 公司注册
- 公司治理
- 股东权益

## 合规要点

### 注册要求
- 公司类型
- 资本要求
- 税务登记
'''
    
    elif section == "toolkit" and subsection == "cities":
        if filename == "kigali":
            return f'''---
title: "{title}"
section: toolkit
subsection: "cities"
country: "rwanda"
---

# {title}

## 首都概览

### 基本信息
- 人口: ~130万
- 海拔: 1,500米
- 气候: 热带高原

### 经济中心
- GDP贡献最大
- 服务业集中
- 基础设施最好

## 投资机会

### 房地产
- 住宅需求旺盛
- 商业地产增长
- 土地增值

### ICT
- 创新城项目
- 创业中心
- 数字技能
'''
        else:
            return f'''---
title: "{title}"
section: toolkit
subsection: "cities"
country: "rwanda"
---

# {title}

## 城市概况

### 区位优势
- 区域连接
- 产业特色
- 发展潜力

## 投资机会

### 产业机会
- 农业加工
- 服务业
- 基础设施
'''
    
    elif section == "toolkit" and subsection == "data-dashboards":
        return f'''---
title: "{title}"
section: toolkit
subsection: "data-dashboards"
country: "rwanda"
---

# {title}

## 数据指标

### 经济指标
- GDP及增长率
- 通货膨胀
- 失业率

### 投资指标
- FDI流入
- 营商环境
- 行业分布

## 数据来源
- NISR
- 世界银行
- IMF
'''
    
    elif section == "archive":
        return f'''---
title: "{title}"
section: archive
subsection: "archive"
country: "rwanda"
---

# {title}

## 历史沿革

### 殖民时期
- 德国殖民
- 比利时托管

### 独立后
- 1962年独立
- 胡图图西冲突

## 重建历程

### 1994年后
- 卡加梅执政
- 和平重建
- 经济发展

### 发展成就
- 20年高增长
- 社会稳定
- 国际认可
'''
    
    return f'''---
title: "{title}"
section: {section}
subsection: "{subsection}"
country: "rwanda"
---

# {title}

## 概述
{desc}

## 核心要点
- 要点1
- 要点2
- 要点3
'''

def main():
    # 创建目录
    for dir_path in DIRECTORIES:
        full_path = os.path.join(BASE_PATH, dir_path)
        os.makedirs(full_path, exist_ok=True)
        print(f"Created: {full_path}")
    
    # 生成文件
    total_files = 0
    for dir_path, files in FILES.items():
        for filename, title, desc in files:
            # 确定section和subsection
            parts = dir_path.split("/")
            section = parts[0]
            subsection = parts[1] if len(parts) > 1 else ""
            
            # 生成文件名
            file_path = os.path.join(BASE_PATH, dir_path, f"{filename}.md")
            
            # 生成内容
            content = get_content(filename, title, desc, section, subsection)
            
            # 写入文件
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            
            print(f"Created: {file_path}")
            total_files += 1
    
    print(f"\n✅ Total files created: {total_files}")

if __name__ == "__main__":
    main()
