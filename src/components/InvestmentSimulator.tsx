'use client';

import { useState } from 'react';

interface Industry {
  id: string;
  name: string;
  icon: string;
  riskProfile: 'low' | 'medium' | 'high';
  baseReturn: number;
  riskFactor: number;
  suitableCountries: string[];
}

const industries: Industry[] = [
  { id: 'manufacturing', name: '制造业', icon: '🏭', riskProfile: 'medium', baseReturn: 15, riskFactor: 0.7, suitableCountries: ['ethiopia', 'uganda', 'tanzania'] },
  { id: 'ict', name: 'ICT/科技', icon: '💻', riskProfile: 'low', baseReturn: 25, riskFactor: 0.5, suitableCountries: ['kenya', 'rwanda'] },
  { id: 'agriculture', name: '农业加工', icon: '🌾', riskProfile: 'medium', baseReturn: 18, riskFactor: 0.6, suitableCountries: ['ethiopia', 'uganda', 'tanzania'] },
  { id: 'energy', name: '能源电力', icon: '⚡', riskProfile: 'high', baseReturn: 12, riskFactor: 0.9, suitableCountries: ['ethiopia', 'tanzania'] },
  { id: 'finance', name: '金融服务', icon: '💰', riskProfile: 'low', baseReturn: 22, riskFactor: 0.4, suitableCountries: ['kenya', 'rwanda'] },
  { id: 'mining', name: '矿业开采', icon: '⛏️', riskProfile: 'high', baseReturn: 20, riskFactor: 0.95, suitableCountries: ['tanzania', 'ethiopia'] },
  { id: 'tourism', name: '旅游业', icon: '🦁', riskProfile: 'medium', baseReturn: 16, riskFactor: 0.6, suitableCountries: ['tanzania', 'rwanda', 'kenya'] },
  { id: 'logistics', name: '物流运输', icon: '🚚', riskProfile: 'medium', baseReturn: 14, riskFactor: 0.7, suitableCountries: ['kenya', 'ethiopia', 'tanzania'] },
];

const countries = [
  { id: 'ethiopia', name: '埃塞俄比亚', flag: '🇪🇹', riskAdj: 0.85, costAdj: 0.7 },
  { id: 'uganda', name: '乌干达', flag: '🇺🇬', riskAdj: 0.9, costAdj: 0.8 },
  { id: 'kenya', name: '肯尼亚', flag: '🇰🇪', riskAdj: 1.0, costAdj: 1.0 },
  { id: 'tanzania', name: '坦桑尼亚', flag: '🇹🇿', riskAdj: 0.95, costAdj: 0.85 },
  { id: 'rwanda', name: '卢旺达', flag: '🇷🇼', riskAdj: 1.1, costAdj: 0.95 },
  { id: 'south-sudan', name: '南苏丹', flag: '🇸🇸', riskAdj: 0.5, costAdj: 0.6 },
];

export default function InvestmentSimulator() {
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('manufacturing');
  const [selectedCountry, setSelectedCountry] = useState<string>('ethiopia');

  const industry = industries.find(i => i.id === selectedIndustry)!;
  const country = countries.find(c => c.id === selectedCountry)!;

  // 计算预期回报
  const calculateReturns = () => {
    const baseAmount = investmentAmount;
    const industryFactor = industry.baseReturn / 100;
    const countryRiskAdj = country.riskAdj;
    const countryCostAdj = country.costAdj;
    
    // 调整后回报率
    const adjustedReturn = industryFactor * countryRiskAdj * (0.8 + (1 - countryCostAdj) * 0.4);
    
    // 年化回报（考虑风险）
    const yearlyReturns = Array.from({ length: 5 }, (_, i) => {
      const riskVariation = 1 + (Math.random() - 0.5) * industry.riskFactor * 0.2;
      return baseAmount * Math.pow(1 + adjustedReturn * riskVariation, i + 1);
    });

    // 风险评分 (1-10)
    const riskScore = Math.round((1 - industry.riskFactor) * 10 + (1 / countryRiskAdj) * 5);

    // 月度现金流 (简化估算)
    const monthlyCashFlow = (baseAmount * adjustedReturn) / 12;

    return {
      totalReturn: yearlyReturns[4],
      totalReturnPercent: ((yearlyReturns[4] / baseAmount - 1) * 100).toFixed(1),
      yearlyReturns,
      riskScore: Math.min(10, Math.max(1, riskScore)),
      monthlyCashFlow,
      paybackYears: (1 / adjustedReturn).toFixed(1),
    };
  };

  const results = calculateReturns();

  const getRiskColor = (score: number): string => {
    if (score >= 8) return '#00e676';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
  };

  const getRiskLabel = (score: number): string => {
    if (score >= 8) return '低风险';
    if (score >= 5) return '中风险';
    return '高风险';
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold mb-2" style={{ color: '#e8e8e8' }}>
          投资回报模拟器
        </h3>
        <p className="text-sm" style={{ color: '#a0a0b0' }}>
          输入投资参数，估算5年投资回报
        </p>
      </div>

      {/* 输入控制 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 投资金额 */}
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <label className="block text-sm font-medium mb-2" style={{ color: '#a0a0b0' }}>
            💰 投资金额 (万美元)
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: 'var(--bg-secondary)' }}
          />
          <div className="text-center mt-2">
            <span className="text-2xl font-bold" style={{ color: '#448aff' }}>
              ${investmentAmount}万
            </span>
          </div>
        </div>

        {/* 行业选择 */}
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <label className="block text-sm font-medium mb-2" style={{ color: '#a0a0b0' }}>
            🏭 投资行业
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full p-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg-secondary)', color: '#e8e8e8', border: '1px solid var(--border-color)' }}
          >
            {industries.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.icon} {ind.name}
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs" style={{ color: '#a0a0b0' }}>
            预期回报率: <span style={{ color: '#00e676' }}>{industry.baseReturn}%</span>
          </div>
        </div>

        {/* 国家选择 */}
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <label className="block text-sm font-medium mb-2" style={{ color: '#a0a0b0' }}>
            🌍 投资国家
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg-secondary)', color: '#e8e8e8', border: '1px solid var(--border-color)' }}
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          {!industry.suitableCountries.includes(selectedCountry) && (
            <div className="mt-2 text-xs" style={{ color: '#f59e0b' }}>
              ⚠️ {industry.name}在{country.name}非核心行业
            </div>
          )}
        </div>
      </div>

      {/* 结果展示 */}
      <div 
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${getRiskColor(results.riskScore)}40` }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* 5年总回报 */}
          <div className="text-center">
            <p className="text-sm mb-1" style={{ color: '#a0a0b0' }}>5年总回报</p>
            <p className="text-2xl font-bold" style={{ color: '#00e676' }}>
              ${(results.totalReturn / 100).toFixed(1)}万
            </p>
            <p className="text-sm" style={{ color: '#00e676' }}>
              (+{results.totalReturnPercent}%)
            </p>
          </div>

          {/* 月度现金流 */}
          <div className="text-center">
            <p className="text-sm mb-1" style={{ color: '#a0a0b0' }}>预估月现金流</p>
            <p className="text-2xl font-bold" style={{ color: '#448aff' }}>
              ${(results.monthlyCashFlow / 100).toFixed(1)}万
            </p>
          </div>

          {/* 回本周期 */}
          <div className="text-center">
            <p className="text-sm mb-1" style={{ color: '#a0a0b0' }}>预计回本周期</p>
            <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
              {results.paybackYears}年
            </p>
          </div>

          {/* 风险评分 */}
          <div className="text-center">
            <p className="text-sm mb-1" style={{ color: '#a0a0b0' }}>综合风险</p>
            <p 
              className="text-2xl font-bold"
              style={{ color: getRiskColor(results.riskScore) }}
            >
              {results.riskScore}/10
            </p>
            <p className="text-sm" style={{ color: getRiskColor(results.riskScore) }}>
              {getRiskLabel(results.riskScore)}
            </p>
          </div>
        </div>
      </div>

      {/* 年度回报趋势 */}
      <div 
        className="rounded-xl p-4"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <h4 className="text-sm font-medium mb-4" style={{ color: '#e8e8e8' }}>
          📈 5年资产变化趋势
        </h4>
        <div className="flex items-end justify-between gap-2 h-32">
          {results.yearlyReturns.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t-lg transition-all duration-500"
                style={{ 
                  height: `${((value - investmentAmount) / (results.totalReturn - investmentAmount)) * 100}%`,
                  minHeight: '10%',
                  background: 'linear-gradient(to top, #00e676, #448aff)',
                }}
              >
                <div className="text-center pt-1 text-xs" style={{ color: '#e8e8e8' }}>
                  ${(value/100).toFixed(0)}
                </div>
              </div>
              <div className="text-xs mt-2" style={{ color: '#a0a0b0' }}>
                第{i + 1}年
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 免责声明 */}
      <div 
        className="mt-4 p-3 rounded-lg text-xs text-center"
        style={{ backgroundColor: 'var(--bg-secondary)', color: '#a0a0b0' }}
      >
        ⚠️ 本模拟器仅供参考，实际回报受市场、政策、汇率等多因素影响，不构成投资建议。
      </div>
    </div>
  );
}
