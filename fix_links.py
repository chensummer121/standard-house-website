import re
import os

# 链接修复映射
replacements = [
    # 1. cement.md - 建材链接
    (r'\[产业纵深链接\]\(\.\./三、产业纵深/4-内需产业/建材\.md\)', '[产业纵深链接](/invest/ethiopia/industry/domestic/building-materials)'),
    
    # 2. building-materials.md - 建材链接
    (r'\[产业纵深链接\]\(\.\./三、产业纵深/4-内需产业/建材\.md\)', '[产业纵深链接](/invest/ethiopia/industry/domestic/building-materials)'),
    
    # 3. renewable-energy.md - 电力与能源链接
    (r'\[产业纵深链接\]\(\.\./三、产业纵深/1-底座产业/电力与能源\.md\)', '[产业纵深链接](/invest/ethiopia/industry/foundation/power-energy)'),
    
    # 4. great-power-game.md - 投资决策和产业纵深链接
    (r'\[决策区：大国博弈矩阵评分卡\]\(\.\./三、投资决策/大国博弈矩阵评分卡\.md\)', '[决策区：大国博弈矩阵评分卡](/invest/ethiopia/decision/priority-matrix)'),
    (r'\[产业纵深：基础设施与国际贸易\]\(\.\./四、产业纵深/基础设施与国际贸易\.md\)', '[产业纵深：基础设施与国际贸易](/invest/ethiopia/industry/artery/logistics-customs)'),
    
    # 5. climate-killer.md - 气候风险和农业能源链接
    (r'\[决策区：气候风险评级\]\(\.\./三、投资决策/气候风险评级\.md\)', '[决策区：气候风险评级](/invest/ethiopia/decision/risk-scenarios)'),
    (r'\[产业纵深：农业与能源\]\(\.\./四、产业纵深/农业与能源\.md\)', '[产业纵深：农业与能源](/invest/ethiopia/industry/foundation/agriculture)'),
    
    # 6. khat-shadow-economy.md - 底座模型链接
    (r'\[埃塞俄比亚国家全景底座模型：变量08解析\]\(\.\./\.\./埃塞俄比亚国家全景底座模型\.md#Ⅲ-宏观对冲与暗网经济底盘--变量08暗网经济与非正式硬通货（巧茶网络）\)', '[埃塞俄比亚国家全景底座模型：变量08解析](/invest/ethiopia/archive/埃塞俄比亚国家全景底座模型)'),
    
    # 7. remittance.md - 宏观经济和人口劳动力链接
    (r'\[埃塞俄比亚宏观经济总览\]\(\.\./0-国家底层数据/宏观经济\.md\)', '[埃塞俄比亚宏观经济总览](/invest/ethiopia/insight/data-panels/macroeconomy)'),
    (r'\[埃塞俄比亚人口与劳动力\]\(\.\./0-国家底层数据/人口与劳动力\.md\)', '[埃塞俄比亚人口与劳动力](/invest/ethiopia/insight/data-panels/population-labor)'),
    
    # 8. money-printer.md - 宏观经济链接（含锚点）
    (r'\[埃塞俄比亚宏观经济总览\]\(\.\./0-国家底层数据/宏观经济\.md\)', '[埃塞俄比亚宏观经济总览](/invest/ethiopia/insight/data-panels/macroeconomy)'),
    (r'\[主权债务重组进程\]\(\.\./0-国家底层数据/宏观经济\.md#主权债务重组进展\)', '[主权债务重组进程](/invest/ethiopia/insight/data-panels/macroeconomy)'),
    
    # 9-10. zero-tariff.md 和 china-downgrade.md - 外部参考
    (r'\[中国企业出海3\.0：底层逻辑、空间拓扑与终局演进\]\(\.\./\.\./三、支撑域/市场研究/中国企业出海3\.0-底层逻辑与终局演进\.md\)', '中国企业出海3.0：底层逻辑、空间拓扑与终局演进（外部参考）'),
    
    # 11. capital-market.md - 待补充链接
    (r'\[埃塞俄比亚证券交易所（ESX）年度报告\]\(\.\./链接待补充\)', '埃塞俄比亚证券交易所（ESX）年度报告（待补充）'),
    (r'\[Ethio Telecom IPO招股书\]\(\.\./链接待补充\)', 'Ethio Telecom IPO招股书（待补充）'),
    (r'\[财政部月度债务公报\]\(\.\./链接待补充\)', '财政部月度债务公报（待补充）'),
    
    # 12. fx-system.md - 多个结构性变化链接
    (r'\[汇率自由化：金融国门打开了\]\(\.\./二、国家透视/5-正在发生的结构性变化/汇率自由化：金融国门打开了\.md\)', '[汇率自由化：金融国门打开了](/invest/ethiopia/insight/structural-change/fx-liberalization)'),
    (r'\[印钞机：为什么比尔年年暴跌\]\(\.\./二、国家透视/3-钱从哪来到哪去/印钞机：为什么比尔年年暴跌\.md\)', '[印钞机：为什么比尔年年暴跌](/invest/ethiopia/insight/money-flow/money-printer)'),
    (r'\[宏观经济——国家底层数据\]\(\.\./二、国家透视/0-国家底层数据/宏观经济\.md\)', '[宏观经济——国家底层数据](/invest/ethiopia/insight/data-panels/macroeconomy)'),
    
    # 13. banking.md - 待补充链接
    (r'\[Commercial Bank of Ethiopia重组计划\]\(\.\./链接待补充\)', 'Commercial Bank of Ethiopia重组计划（待补充）'),
    (r'\[NBE金融稳定报告2025\]\(\.\./链接待补充\)', 'NBE金融稳定报告2025（待补充）'),
    (r'\[World Bank FSSP项目文件\]\(\.\./链接待补充\)', 'World Bank FSSP项目文件（待补充）'),
    (r'\[telebirr生态系统分析\]\(\.\./链接待补充\)', 'telebirr生态系统分析（待补充）'),
    
    # 14-15. power-export.md 和 zero-carbon.md - 电力与能源链接
    (r'\[电力与能源\.md\]\(\.\./1-底座产业/电力与能源\.md\)', '[电力与能源](/invest/ethiopia/industry/foundation/power-energy)'),
]

# 需要处理的文件列表
files_to_process = [
    'src/content/countries/ethiopia/decision/quick-cards/cement.md',
    'src/content/countries/ethiopia/decision/quick-cards/building-materials.md',
    'src/content/countries/ethiopia/decision/quick-cards/renewable-energy.md',
    'src/content/countries/ethiopia/insight/why-exist/great-power-game.md',
    'src/content/countries/ethiopia/insight/why-exist/climate-killer.md',
    'src/content/countries/ethiopia/insight/money-flow/khat-shadow-economy.md',
    'src/content/countries/ethiopia/insight/money-flow/remittance.md',
    'src/content/countries/ethiopia/insight/money-flow/money-printer.md',
    'src/content/countries/ethiopia/insight/structural-change/zero-tariff.md',
    'src/content/countries/ethiopia/insight/structural-change/china-downgrade.md',
    'src/content/countries/ethiopia/industry/finance/capital-market.md',
    'src/content/countries/ethiopia/industry/finance/fx-system.md',
    'src/content/countries/ethiopia/industry/finance/banking.md',
    'src/content/countries/ethiopia/industry/arbitrage/power-export.md',
    'src/content/countries/ethiopia/industry/arbitrage/zero-carbon.md',
]

total_changes = 0
for file_path in files_to_process:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            changes = len(re.findall(r'/invest/|（待补充）|（外部参考）', content))
            total_changes += changes
            print(f"✓ Fixed: {file_path}")
    else:
        print(f"✗ Not found: {file_path}")

print(f"\nTotal files processed: {len(files_to_process)}")
print(f"Total changes made: {total_changes}")
