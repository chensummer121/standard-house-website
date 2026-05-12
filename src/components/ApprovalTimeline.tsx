'use client';

import { useState } from 'react';

interface TimelineStep {
  step: number;
  name: string;
  duration: string;
  documents: string[];
  tips: string;
}

interface CountryApproval {
  country: string;
  flag: string;
  color: string;
  totalDays: string;
  steps: TimelineStep[];
}

const approvalData: CountryApproval[] = [
  {
    country: '埃塞俄比亚',
    flag: '🇪🇹',
    color: '#3b82f6',
    totalDays: '90-180天',
    steps: [
      { step: 1, name: '公司名称核准', duration: '3-5天', documents: ['申请表', '3个备选名称'], tips: '建议使用阿姆哈拉语备选名称' },
      { step: 2, name: '工商注册', duration: '7-14天', documents: ['公司章程', '股东名单', '地址证明'], tips: '可在电子商务平台在线办理' },
      { step: 3, name: '税务登记', duration: '3-5天', documents: ['营业执照副本', '法人身份证'], tips: 'TIN号码是必填项' },
      { step: 4, name: '投资许可', duration: '30-60天', documents: ['投资计划书', '环境影响评估', '资金证明'], tips: '部分行业需额外审批' },
      { step: 5, name: '土地/厂房许可', duration: '45-90天', documents: ['土地租赁合同', '建设图纸', '消防审批'], tips: '工业园区可加速审批' },
      { step: 6, name: '营业执照领取', duration: '3-5天', documents: ['所有前置许可证'], tips: '可选择电子营业执照' },
    ],
  },
  {
    country: '乌干达',
    flag: '🇺🇬',
    color: '#22c55e',
    totalDays: '30-60天',
    steps: [
      { step: 1, name: '公司注册(URS)', duration: '5-7天', documents: ['申请表', '公司章程', '注册地址'], tips: '可通过URSB在线门户办理' },
      { step: 2, name: 'TIN申请', duration: '1-2天', documents: ['公司注册证书', '董事身份证'], tips: '税务局现场即可办理' },
      { step: 3, name: '工作许可', duration: '14-30天', documents: ['护照复印件', '招聘计划', '技能证明'], tips: '外籍员工必需' },
      { step: 4, name: '环境评估', duration: '14-21天', documents: ['项目说明书', '污染控制方案'], tips: '制造业需做详细评估' },
      { step: 5, name: '行业许可', duration: '7-14天', documents: ['行业特定表格', '资质证书'], tips: '制造业需工业局批准' },
    ],
  },
  {
    country: '肯尼亚',
    flag: '🇰🇪',
    color: '#f59e0b',
    totalDays: '30-45天',
    steps: [
      { step: 1, name: '公司注册(E-citizen)', duration: '3-7天', documents: ['申请表', '公司章程', '股东信息'], tips: '全程在线办理，最便捷' },
      { step: 2, name: 'PIN申请', duration: '1-2天', documents: ['公司注册证书'], tips: 'KRA网站在线申请' },
      { step: 3, name: '营业许可', duration: '7-14天', documents: ['场所证明', '消防证书', '健康许可'], tips: '内罗毕市政厅统一发放' },
      { step: 4, name: '环境许可证', duration: '14-21天', documents: ['EIA报告', '废物处理方案'], tips: 'NEMA强制要求' },
      { step: 5, name: '进口许可(如需)', duration: '5-10天', documents: ['贸易许可申请', '产品目录'], tips: '部分商品需特殊许可' },
    ],
  },
  {
    country: '坦桑尼亚',
    flag: '🇹🇿',
    color: '#ef4444',
    totalDays: '45-90天',
    steps: [
      { step: 1, name: '公司注册(BRELA)', duration: '5-10天', documents: ['申请表', '公司章程', '注册费用'], tips: '达累斯萨拉姆办理' },
      { step: 2, name: '税务登记', duration: '3-5天', documents: ['公司注册证书', '董事信息'], tips: 'SIMBA系统注册' },
      { step: 3, name: '投资中心注册(TIC)', duration: '14-30天', documents: ['投资计划', '资金证明', '环评报告'], tips: '可享受投资激励' },
      { step: 4, name: '行业许可', duration: '14-30天', documents: ['行业特定材料', '技术资质'], tips: '不同行业审批部门不同' },
      { step: 5, name: '土地许可', duration: '30-60天', documents: ['土地申请', '测绘报告', '社区协商'], tips: '外籍企业受限较多' },
    ],
  },
  {
    country: '卢旺达',
    flag: '🇷🇼',
    color: '#a855f7',
    totalDays: '15-30天',
    steps: [
      { step: 1, name: '公司注册(RDB)', duration: '3-5天', documents: ['申请表', '公司章程', '注册地址'], tips: 'One Stop Center一站式办理' },
      { step: 2, name: '税务登记', duration: '1-2天', documents: ['营业执照'], tips: 'RRA自动完成' },
      { step: 3, name: '劳动许可', duration: '5-10天', documents: ['招聘计划', '外籍员工配额'], tips: '外籍员工不超过30%' },
      { step: 4, name: '行业许可', duration: '3-7天', documents: ['行业资质', '技术证书'], tips: 'ICAP平台在线申请' },
      { step: 5, name: '环境许可', duration: '3-7天', documents: ['环境筛查表', '减排方案'], tips: '大多数项目做筛查即可' },
    ],
  },
];

export default function ApprovalTimeline() {
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const country = approvalData[selectedCountry];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold mb-2" style={{ color: '#e8e8e8' }}>
          建厂审批流程时间轴
        </h3>
        <p className="text-sm" style={{ color: '#a0a0b0' }}>
          各国公司注册与经营许可证办理流程对比
        </p>
      </div>

      {/* 国家选择器 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {approvalData.map((c, index) => (
          <button
            key={c.country}
            onClick={() => {
              setSelectedCountry(index);
              setExpandedStep(null);
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${selectedCountry === index 
                ? 'text-white shadow-lg' 
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'}
            `}
            style={selectedCountry === index ? { backgroundColor: c.color } : {}}
          >
            <span className="mr-1">{c.flag}</span>
            <span>{c.country}</span>
          </button>
        ))}
      </div>

      {/* 总时长提示 */}
      <div 
        className="text-center p-3 rounded-lg mb-6"
        style={{ backgroundColor: country.color + '20', border: `1px solid ${country.color}40` }}
      >
        <span style={{ color: country.color }} className="font-bold">
          ⏱️ {country.country} 标准审批时长: {country.totalDays}
        </span>
      </div>

      {/* 时间轴 */}
      <div className="relative">
        {/* 时间轴线 */}
        <div 
          className="absolute left-[19px] top-0 bottom-0 w-0.5"
          style={{ backgroundColor: country.color + '40' }}
        ></div>

        {/* 步骤列表 */}
        <div className="space-y-4">
          {country.steps.map((step) => (
            <div 
              key={step.step}
              className="relative flex items-start gap-4"
            >
              {/* 步骤圆点 */}
              <div 
                className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                  ${expandedStep === step.step ? 'scale-110' : ''}
                `}
                style={{ backgroundColor: country.color }}
              >
                {step.step}
              </div>

              {/* 步骤内容 */}
              <div 
                className={`
                  flex-1 p-4 rounded-lg cursor-pointer transition-all duration-200
                  ${expandedStep === step.step 
                    ? 'ring-2' 
                    : 'hover:scale-[1.01]'}
                `}
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  border: `1px solid ${expandedStep === step.step ? country.color : 'var(--border-color)'}`,
                }}
                onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold" style={{ color: '#e8e8e8' }}>
                    {step.name}
                  </h4>
                  <span 
                    className="text-sm px-2 py-1 rounded"
                    style={{ backgroundColor: country.color + '20', color: country.color }}
                  >
                    {step.duration}
                  </span>
                </div>

                {/* 展开详情 */}
                {expandedStep === step.step && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    {/* 所需文件 */}
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2" style={{ color: '#a0a0b0' }}>
                        📄 所需文件:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.documents.map((doc, i) => (
                          <span 
                            key={i}
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 提示 */}
                    <div 
                      className="p-3 rounded-lg text-sm"
                      style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                    >
                      💡 {step.tips}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部说明 */}
      <div 
        className="mt-6 p-4 rounded-lg text-center text-sm"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
      >
        📌 实际审批时间可能因案件复杂度、政府效率及材料完整性而有所不同。<br/>
        建议委托当地律所或使用政府一站式服务加速流程。
      </div>
    </div>
  );
}
