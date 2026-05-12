'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface CountryRisk {
  name: string;
  flag: string;
  color: string;
  values: number[]; // [政治风险, 汇率风险, 营商便利, 基建水平, 安全指数]
}

const countries: CountryRisk[] = [
  { 
    name: '埃塞俄比亚', 
    flag: '🇪🇹', 
    color: '#3b82f6',
    values: [7.5, 8.0, 3.0, 4.0, 6.0]
  },
  { 
    name: '乌干达', 
    flag: '🇺🇬', 
    color: '#22c55e',
    values: [6.0, 5.5, 5.5, 4.5, 5.5]
  },
  { 
    name: '肯尼亚', 
    flag: '🇰🇪', 
    color: '#f59e0b',
    values: [5.0, 4.5, 7.0, 7.5, 5.5]
  },
  { 
    name: '坦桑尼亚', 
    flag: '🇹🇿', 
    color: '#ef4444',
    values: [4.5, 4.0, 5.0, 5.0, 5.5]
  },
  { 
    name: '卢旺达', 
    flag: '🇷🇼', 
    color: '#a855f7',
    values: [3.5, 3.0, 8.0, 7.0, 2.5]
  },
  { 
    name: '南苏丹', 
    flag: '🇸🇸', 
    color: '#1a472a',
    values: [9.5, 9.0, 2.0, 1.5, 8.5]
  },
];

const indicators = [
  { name: '政治风险', max: 10 },
  { name: '汇率风险', max: 10 },
  { name: '营商便利度', max: 10 },
  { name: '基建水平', max: 10 },
  { name: '安全指数', max: 10 },
];

export default function RiskRadarChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '六国投资风险雷达图',
        subtext: '数值越高风险越大 | 0-10分制',
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e8e8e8',
          fontSize: 16,
          fontWeight: 'bold',
        },
        subtextStyle: {
          color: '#a0a0b0',
          fontSize: 12,
        },
      },
      legend: {
        data: countries.map(c => c.flag + ' ' + c.name),
        bottom: 10,
        textStyle: {
          color: '#a0a0b0',
          fontSize: 11,
        },
        itemWidth: 20,
        itemHeight: 10,
        itemGap: 10,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1f4068',
        borderColor: '#2a3a5c',
        textStyle: { color: '#e8e8e8' },
        formatter: (params: any) => {
          if (params.componentType === 'series') {
            const country = countries.find(c => c.name === params.seriesName.replace(/^[^\s]+\s/, ''));
            if (!country) return '';
            return `
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                ${params.marker} ${country.flag} ${country.name}
              </div>
              <div style="color: #a0a0b0; font-size: 12px;">
                ${indicators.map((ind, i) => `
                  <div style="display: flex; justify-content: space-between; gap: 20px;">
                    <span>${ind.name}:</span>
                    <span style="color: ${country.color}; font-weight: bold;">${country.values[i]}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }
          return '';
        },
      },
      radar: {
        indicator: indicators.map(ind => ({
          name: ind.name,
          max: ind.max,
        })),
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#a0a0b0',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: '#2a3a5c',
            type: 'dashed',
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(31,64,104,0.1)', 'rgba(31,64,104,0.2)', 'rgba(31,64,104,0.3)', 'rgba(31,64,104,0.4)', 'rgba(31,64,104,0.5)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: '#2a3a5c',
          },
        },
      },
      series: [{
        type: 'radar',
        data: countries.map(country => ({
          value: country.values,
          name: country.flag + ' ' + country.name,
          lineStyle: {
            color: country.color,
            width: 2,
          },
          areaStyle: {
            color: country.color,
            opacity: 0.15,
          },
          itemStyle: {
            color: country.color,
            borderWidth: 2,
          },
          symbol: 'circle',
          symbolSize: 6,
        })),
      }],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-full min-h-[400px]"
    />
  );
}
