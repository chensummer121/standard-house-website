'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import industryData from '../data/industry-comparison.json';

interface Industry {
  id: string;
  name: string;
  icon: string;
  marketSize: number;
  marketSizeUnit: string;
  growthRate: string;
  growthRateValue: number;
  ratings: {
    riskLevel: number;
    returnPotential: number;
    entryBarrier: number;
    fxRisk: number;
    policySupport: number;
  };
  keyAdvantage: string;
  keyRisk: string;
  slug: string;
}

const industries: Industry[] = industryData.industries;
const ratingLabels = industryData.ratingLabels;
const colors = industryData.chartConfig.colors;

const MAX_SELECTION = 5;

export default function IndustryComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['coffee', 'mining', 'fintech', 'consumer-goods']);
  const radarChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const radarChartInstance = useRef<echarts.ECharts | null>(null);
  const barChartInstance = useRef<echarts.ECharts | null>(null);

  const toggleIndustry = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= MAX_SELECTION) {
        return prev;
      }
      return [...prev, id];
    });
  };

  useEffect(() => {
    if (!radarChartRef.current || !barChartRef.current) return;

    // Init radar chart
    if (!radarChartInstance.current) {
      radarChartInstance.current = echarts.init(radarChartRef.current);
    }
    
    // Init bar chart
    if (!barChartInstance.current) {
      barChartInstance.current = echarts.init(barChartRef.current);
    }

    const selectedIndustries = industries.filter(i => selectedIds.includes(i.id));
    
    // Radar chart config
    const radarOption: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '多维度行业对比',
        subtext: '选择最多5个行业进行对比',
        left: 'center',
        textStyle: {
          color: '#e8e8e8',
          fontSize: 18,
          fontWeight: 'bold',
        },
        subtextStyle: {
          color: '#a0a0b0',
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1f4068',
        borderColor: '#2a3a5c',
        textStyle: { color: '#e8e8e8' },
      },
      legend: {
        data: selectedIndustries.map(i => `${i.icon} ${i.name}`),
        bottom: 10,
        textStyle: { color: '#a0a0b0' },
        itemWidth: 20,
        itemHeight: 12,
      },
      radar: {
        indicator: [
          { name: ratingLabels.riskLevel, max: 5 },
          { name: ratingLabels.returnPotential, max: 5 },
          { name: ratingLabels.entryBarrier, max: 5 },
          { name: ratingLabels.fxRisk, max: 5 },
          { name: ratingLabels.policySupport, max: 5 },
        ],
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#a0a0b0',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: { color: '#2a3a5c' },
        },
        splitArea: {
          show: true,
          areaStyle: { color: ['rgba(59,130,246,0.05)', 'rgba(59,130,246,0.1)', 'rgba(59,130,246,0.15)', 'rgba(59,130,246,0.2)', 'rgba(59,130,246,0.25)'] },
        },
        axisLine: {
          lineStyle: { color: '#2a3a5c' },
        },
      },
      series: [{
        type: 'radar',
        data: selectedIndustries.map((industry, idx) => ({
          value: [
            industry.ratings.riskLevel,
            industry.ratings.returnPotential,
            industry.ratings.entryBarrier,
            industry.ratings.fxRisk,
            industry.ratings.policySupport,
          ],
          name: `${industry.icon} ${industry.name}`,
          lineStyle: { color: colors[idx % colors.length], width: 2 },
          areaStyle: { color: colors[idx % colors.length], opacity: 0.2 },
          itemStyle: { color: colors[idx % colors.length] },
          symbol: 'circle',
          symbolSize: 6,
        })),
      }],
    };

    // Bar chart config - sort by market size
    const sortedBySize = [...industries].sort((a, b) => b.marketSize - a.marketSize);
    const topIndustries = sortedBySize.slice(0, 10);
    
    const barOption: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '市场规模排名 Top 10',
        subtext: '单位：亿美元/年（建材为总市场规模）',
        left: 'center',
        textStyle: {
          color: '#e8e8e8',
          fontSize: 18,
          fontWeight: 'bold',
        },
        subtextStyle: {
          color: '#a0a0b0',
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#1f4068',
        borderColor: '#2a3a5c',
        textStyle: { color: '#e8e8e8' },
        formatter: (params: any) => {
          const data = params[0];
          const industry = industries.find(i => i.name === data.name.replace(i.icon + ' ', ''));
          if (!industry) return data.name + ': ' + data.value;
          return `<strong>${industry.icon} ${industry.name}</strong><br/>
                  市场规模: ${industry.marketSize} ${industry.marketSizeUnit}<br/>
                  增速: ${industry.growthRate}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
        splitLine: { lineStyle: { color: '#2a3a5c', type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: topIndustries.map(i => `${i.icon} ${i.name}`).reverse(),
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { 
          color: '#a0a0b0',
          fontSize: 11,
        },
      },
      series: [{
        type: 'bar',
        data: topIndustries.map((i, idx) => ({
          value: i.marketSize,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#60a5fa' },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
        })).reverse(),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          color: '#a0a0b0',
          fontSize: 11,
          formatter: (params: any) => {
            const industry = topIndustries.find(i => i.name === params.name.replace(i.icon + ' ', ''));
            return industry ? `${industry.marketSize}` : params.value;
          },
        },
      }],
    };

    radarChartInstance.current.setOption(radarOption);
    barChartInstance.current.setOption(barOption);

    const handleResize = () => {
      radarChartInstance.current?.resize();
      barChartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedIds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      radarChartInstance.current?.dispose();
      barChartInstance.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Industry Selector */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">选择行业对比</h3>
          <span className="text-sm text-slate-400">
            已选 {selectedIds.length}/{MAX_SELECTION} 个行业
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {industries.map(industry => {
            const isSelected = selectedIds.includes(industry.id);
            const isDisabled = !isSelected && selectedIds.length >= MAX_SELECTION;
            return (
              <button
                key={industry.id}
                onClick={() => toggleIndustry(industry.id)}
                disabled={isDisabled}
                className={`
                  p-3 rounded-lg border transition-all text-left
                  ${isSelected 
                    ? 'bg-blue-500/20 border-blue-500 text-white' 
                    : isDisabled
                      ? 'bg-slate-800/30 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                      : 'bg-slate-800/30 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{industry.icon}</span>
                  <span className="font-medium text-sm">{industry.name}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{industry.marketSize} {industry.marketSizeUnit}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div ref={radarChartRef} className="w-full h-[450px]" />
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div ref={barChartRef} className="w-full h-[450px]" />
        </div>
      </div>

      {/* Comparison Table */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">详细对比</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">指标</th>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <th key={id} className="text-center py-3 px-4 text-white font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <span>{industry.icon}</span>
                        <span>{industry.name}</span>
                      </div>
                    </th>
                  ) : null;
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 px-4 text-slate-400">市场规模</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center text-white">
                      {industry.marketSize} {industry.marketSizeUnit}
                    </td>
                  ) : null;
                })}
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 px-4 text-slate-400">增速</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center">
                      <span className={industry.growthRateValue > 0 ? 'text-green-400' : 'text-red-400'}>
                        {industry.growthRate}
                      </span>
                    </td>
                  ) : null;
                })}
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 px-4 text-slate-400">风险等级</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center">
                      <RatingBadge rating={industry.ratings.riskLevel} />
                    </td>
                  ) : null;
                })}
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 px-4 text-slate-400">回报潜力</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center">
                      <RatingBadge rating={industry.ratings.returnPotential} />
                    </td>
                  ) : null;
                })}
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 px-4 text-slate-400">进入壁垒</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center">
                      <RatingBadge rating={industry.ratings.entryBarrier} />
                    </td>
                  ) : null;
                })}
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 px-4 text-slate-400">外汇风险</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center">
                      <RatingBadge rating={industry.ratings.fxRisk} />
                    </td>
                  ) : null;
                })}
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 px-4 text-slate-400">政策支持</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center">
                      <RatingBadge rating={industry.ratings.policySupport} />
                    </td>
                  ) : null;
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400">核心优势</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center text-green-400 text-xs max-w-[200px]">
                      {industry.keyAdvantage}
                    </td>
                  ) : null;
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400">主要风险</td>
                {selectedIds.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <td key={id} className="py-3 px-4 text-center text-red-400 text-xs max-w-[200px]">
                      {industry.keyRisk}
                    </td>
                  ) : null;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  const colors = [
    'bg-green-500/20 text-green-400 border-green-500/30',
    'bg-green-500/20 text-green-400 border-green-500/30',
    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'bg-red-500/20 text-red-400 border-red-500/30',
  ];
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border font-bold ${colors[rating - 1] || colors[2]}`}>
      {rating}
    </span>
  );
}
