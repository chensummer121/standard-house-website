'use client';

import { useState } from 'react';

interface Country {
  id: string;
  name: string;
  flag: string;
  color: string;
  data: {
    gdp: string;
    growth: string;
    population: string;
    risk: string;
    labor: string;
    power: string;
    tax: string;
    urban: string;
    bizRank: number;
  };
}

const countries: Country[] = [
  {
    id: 'ethiopia',
    name: '埃塞俄比亚',
    flag: '🇪🇹',
    color: '#3b82f6',
    data: { gdp: '$155B', growth: '6.3%', population: '1.32亿', risk: 'B+', labor: '$60-120', power: '$0.04', tax: '30%', urban: '23%', bizRank: 175 },
  },
  {
    id: 'uganda',
    name: '乌干达',
    flag: '🇺🇬',
    color: '#22c55e',
    data: { gdp: '$54B', growth: '5.7%', population: '5000万', risk: 'B', labor: '$80-150', power: '$0.10', tax: '30%', urban: '25%', bizRank: 116 },
  },
  {
    id: 'kenya',
    name: '肯尼亚',
    flag: '🇰🇪',
    color: '#f59e0b',
    data: { gdp: '$120B', growth: '4.7%', population: '5640万', risk: 'A-', labor: '$150-300', power: '$0.13', tax: '30%', urban: '30%', bizRank: 52 },
  },
  {
    id: 'tanzania',
    name: '坦桑尼亚',
    flag: '🇹🇿',
    color: '#ef4444',
    data: { gdp: '$79B', growth: '5.5%', population: '6860万', risk: 'B+', labor: '$100-200', power: '$0.08', tax: '30%', urban: '38%', bizRank: 140 },
  },
  {
    id: 'rwanda',
    name: '卢旺达',
    flag: '🇷🇼',
    color: '#a855f7',
    data: { gdp: '$14B', growth: '8.9%', population: '1400万', risk: 'A', labor: '$120-180', power: '$0.10', tax: '30%', urban: '35%', bizRank: 38 },
  },
  {
    id: 'south-sudan',
    name: '南苏丹',
    flag: '🇸🇸',
    color: '#1a472a',
    data: { gdp: '$4.6B', growth: '-26%', population: '1545万', risk: 'CCC', labor: '$50-100', power: '$0.35', tax: '20%', urban: '20%', bizRank: 185 },
  },
];

const dimensions = [
  { key: 'gdp', name: 'GDP总量', format: (v: string) => v, better: 'higher' },
  { key: 'growth', name: 'GDP增速', format: (v: string) => v, better: 'higher' },
  { key: 'population', name: '人口', format: (v: string) => v, better: 'higher' },
  { key: 'risk', name: '主权风险', format: (v: string) => v, better: 'lower-risk' },
  { key: 'labor', name: '用工成本', format: (v: string) => v, better: 'lower' },
  { key: 'power', name: '电费成本', format: (v: string) => v, better: 'lower' },
  { key: 'tax', name: '企业税率', format: (v: string) => v, better: 'lower' },
  { key: 'urban', name: '城市化率', format: (v: string) => v, better: 'higher' },
  { key: 'bizRank', name: '营商排名', format: (v: string) => '#' + v, better: 'lower' },
];

type DimensionKey = typeof dimensions[number]['key'];

export default function CountryComparisonTool() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['ethiopia', 'kenya']);
  const [selectedDimensions, setSelectedDimensions] = useState<DimensionKey[]>(['gdp', 'growth', 'labor', 'risk']);

  const toggleCountry = (id: string) => {
    if (selectedCountries.includes(id)) {
      if (selectedCountries.length > 2) {
        setSelectedCountries(selectedCountries.filter(c => c !== id));
      }
    } else if (selectedCountries.length < 3) {
      setSelectedCountries([...selectedCountries, id]);
    }
  };

  const toggleDimension = (key: DimensionKey) => {
    if (selectedDimensions.includes(key)) {
      if (selectedDimensions.length > 1) {
        setSelectedDimensions(selectedDimensions.filter(d => d !== key));
      }
    } else {
      setSelectedDimensions([...selectedDimensions, key]);
    }
  };

  const getValue = (country: Country, key: DimensionKey): string => {
    return country.data[key] as string;
  };

  const getWinner = (dim: typeof dimensions[number]): string | null => {
    const values = selectedCountries.map(id => {
      const country = countries.find(c => c.id === id);
      return country ? { id, value: getValue(country, dim.key) } : null;
    }).filter(Boolean);

    if (values.length < 2) return null;

    // 简单比较（实际项目中需要更复杂的解析）
    return values[0]?.id || null;
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold mb-2" style={{ color: '#e8e8e8' }}>
          国家对比工具
        </h3>
        <p className="text-sm" style={{ color: '#a0a0b0' }}>
          选择2-3个国家，对比关键投资指标
        </p>
      </div>

      {/* 国家选择 */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3" style={{ color: '#a0a0b0' }}>
          选择国家 (2-3个):
        </p>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => {
            const isSelected = selectedCountries.includes(country.id);
            return (
              <button
                key={country.id}
                onClick={() => toggleCountry(country.id)}
                disabled={!isSelected && selectedCountries.length >= 3}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isSelected 
                    ? 'text-white shadow-lg' 
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'}
                  ${!isSelected && selectedCountries.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={isSelected ? { backgroundColor: country.color } : {}}
              >
                <span className="mr-1">{country.flag}</span>
                {country.name}
                {isSelected && <span className="ml-2">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 维度选择 */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3" style={{ color: '#a0a0b0' }}>
          选择对比维度:
        </p>
        <div className="flex flex-wrap gap-2">
          {dimensions.map((dim) => {
            const isSelected = selectedDimensions.includes(dim.key);
            return (
              <button
                key={dim.key}
                onClick={() => toggleDimension(dim.key)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${isSelected 
                    ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50' 
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 hover:bg-slate-600/50'}
                `}
              >
                {dim.name}
                {isSelected && <span className="ml-1">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 对比表格 */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: '#a0a0b0' }}>
                指标
              </th>
              {selectedCountries.map((id) => {
                const country = countries.find(c => c.id === id);
                return country ? (
                  <th 
                    key={id} 
                    className="px-4 py-3 text-center text-sm font-medium"
                    style={{ color: country.color }}
                  >
                    <span className="text-lg mr-1">{country.flag}</span>
                    {country.name}
                  </th>
                ) : null;
              })}
            </tr>
          </thead>
          <tbody>
            {selectedDimensions.map((dimKey) => {
              const dim = dimensions.find(d => d.key === dimKey);
              if (!dim) return null;

              return (
                <tr 
                  key={dimKey}
                  className="border-t"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#e8e8e8' }}>
                    {dim.name}
                  </td>
                  {selectedCountries.map((id) => {
                    const country = countries.find(c => c.id === id);
                    if (!country) return null;
                    const value = getValue(country, dimKey);
                    
                    return (
                      <td 
                        key={id} 
                        className="px-4 py-3 text-center text-sm"
                        style={{ color: country.color }}
                      >
                        <span className="font-semibold">{dim.format(value)}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 建议 */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)' }}
      >
        <h4 className="font-bold mb-2" style={{ color: '#00e676' }}>
          💡 对比分析建议
        </h4>
        <ul className="text-sm space-y-1" style={{ color: '#a0a0b0' }}>
          <li>• <span style={{ color: '#00e676' }}>肯尼亚</span>营商环境最佳(BizRank #52)，适合服务业和高科技</li>
          <li>• <span style={{ color: '#3b82f6' }}>埃塞俄比亚</span>劳动力成本最低，适合劳动密集型制造业</li>
          <li>• <span style={{ color: '#a855f7' }}>卢旺达</span>增速最快(8.9%)且风险最低，适合稳健投资</li>
        </ul>
      </div>
    </div>
  );
}
