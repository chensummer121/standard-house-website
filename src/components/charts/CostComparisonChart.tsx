'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface CountryCost {
  name: string;
  flag: string;
  color: string;
  costs: {
    factory: number;   // 建厂成本 ($/m²)
    labor: number;     // 用工成本 ($/月)
    land: number;      // 用地成本 ($/m²)
    tax: number;       // 企业税率 (%)
    power: number;     // 电费 ($/kWh)
  };
}

const countries: CountryCost[] = [
  { 
    name: '埃塞俄比亚', 
    flag: '🇪🇹', 
    color: '#3b82f6',
    costs: { factory: 300, labor: 90, land: 10, tax: 30, power: 0.04 }
  },
  { 
    name: '乌干达', 
    flag: '🇺🇬', 
    color: '#22c55e',
    costs: { factory: 400, labor: 115, land: 28, tax: 30, power: 0.10 }
  },
  { 
    name: '肯尼亚', 
    flag: '🇰🇪', 
    color: '#f59e0b',
    costs: { factory: 550, labor: 225, land: 65, tax: 30, power: 0.13 }
  },
  { 
    name: '坦桑尼亚', 
    flag: '🇹🇿', 
    color: '#ef4444',
    costs: { factory: 350, labor: 150, land: 20, tax: 30, power: 0.08 }
  },
  { 
    name: '卢旺达', 
    flag: '🇷🇼', 
    color: '#a855f7',
    costs: { factory: 400, labor: 120, land: 35, tax: 30, power: 0.10 }
  },
  { 
    name: '南苏丹', 
    flag: '🇸🇸', 
    color: '#1a472a',
    costs: { factory: 500, labor: 100, land: 15, tax: 20, power: 0.35 }
  },
];

type CostKey = keyof typeof countries[0]['costs'];

const costItems: { key: CostKey; name: string; unit: string; max: number }[] = [
  { key: 'factory', name: '建厂成本', unit: '$/m²', max: 800 },
  { key: 'labor', name: '用工成本', unit: '$/月', max: 300 },
  { key: 'land', name: '用地成本', unit: '$/m²', max: 100 },
  { key: 'tax', name: '企业税率', unit: '%', max: 40 },
  { key: 'power', name: '电费', unit: '$/kWh', max: 0.2 },
];

export default function CostComparisonChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '六国投资成本对比',
        subtext: '数据来源：世行营商环境报告 | 2024',
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
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1f4068',
        borderColor: '#2a3a5c',
        textStyle: { color: '#e8e8e8' },
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          let html = `<div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          params.forEach((p: any) => {
            const country = countries.find(c => c.flag + ' ' + c.name === p.seriesName);
            if (country) {
              const costItem = costItems.find(c => c.name === p.seriesName.split('(')[0].trim());
              html += `
                <div style="display: flex; align-items: center; margin: 4px 0;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${p.color}; margin-right: 8px;"></span>
                  <span>${country.flag} ${country.name}: </span>
                  <span style="font-weight: bold; color: ${p.color};">${p.value}${costItem?.unit || ''}</span>
                </div>
              `;
            }
          });
          return html;
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
        itemGap: 8,
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '18%',
        bottom: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: costItems.map(c => c.name),
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { 
          color: '#a0a0b0',
          fontSize: 11,
        },
        nameLocation: 'middle',
        nameGap: 30,
      },
      yAxis: {
        type: 'value',
        name: '成本数值',
        nameTextStyle: { color: '#a0a0b0' },
        splitLine: {
          lineStyle: { color: '#2a3a5c', type: 'dashed' }
        },
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
      },
      series: countries.map(country => ({
        name: country.flag + ' ' + country.name,
        type: 'bar',
        data: costItems.map(item => item.key === 'power' 
          ? parseFloat(country.costs[item.key].toFixed(3))
          : country.costs[item.key]
        ),
        itemStyle: {
          color: country.color,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '15%',
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            const item = costItems[params.dataIndex];
            return params.value + item.unit;
          },
          color: '#a0a0b0',
          fontSize: 9,
          rotate: 45,
        },
      })),
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
      className="w-full h-full min-h-[450px]"
    />
  );
}
