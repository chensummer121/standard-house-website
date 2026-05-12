'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface IndustryData {
  name: string;
  x: number;
  y: number;
  size: number;
  sector: string;
}

const industryData: IndustryData[] = [
  { name: '咖啡', x: 2, y: 4.2, size: 26.5, sector: '农业' },
  { name: '新能源', x: 2, y: 4.0, size: 15, sector: '能源' },
  { name: '电信与数字', x: 2, y: 3.8, size: 8, sector: '科技' },
  { name: '金融科技', x: 3, y: 3.5, size: 5, sector: '金融' },
  { name: '物流与基建', x: 4, y: 3.5, size: 12, sector: '基建' },
  { name: '矿业', x: 4, y: 3.2, size: 20, sector: '资源' },
  { name: '房地产', x: 3, y: 2.8, size: 10, sector: '地产' },
  { name: '纺织服装', x: 5, y: 2.5, size: 3, sector: '制造' },
  { name: '加密算力', x: 1, y: 4.0, size: 5, sector: '套利' },
  { name: '消费品', x: 1, y: 3.8, size: 23, sector: '消费' },
];

const sectorColors: Record<string, string> = {
  '农业': '#00e676',
  '能源': '#ffd740',
  '科技': '#448aff',
  '金融': '#ff9100',
  '基建': '#e040fb',
  '资源': '#ff5252',
  '地产': '#ff6e40',
  '制造': '#18ffff',
  '套利': '#ffd740',
  '消费': '#69f0ae',
};

export default function IndustryScatterChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '行业吸引力矩阵',
        subtext: 'X轴=风险等级 | Y轴=吸引力 | 气泡=市场规模',
        left: 'center',
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
        trigger: 'item',
        backgroundColor: '#1f4068',
        borderColor: '#2a3a5c',
        textStyle: { color: '#e8e8e8' },
        formatter: (params: any) => {
          const data = params.data;
          return `
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">
              ${data.name}
            </div>
            <div style="color: #a0a0b0;">
              <div>行业类型: ${data.sector}</div>
              <div>风险等级: ${data.x}</div>
              <div>吸引力: ${data.y}</div>
              <div>市场规模(亿美元): ${data.size}</div>
            </div>
          `;
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '15%',
      },
      xAxis: {
        type: 'value',
        name: '风险等级',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: '#a0a0b0' },
        min: 0,
        max: 6,
        splitLine: {
          lineStyle: { color: '#2a3a5c', type: 'dashed' }
        },
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
      },
      yAxis: {
        type: 'value',
        name: '吸引力',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: { color: '#a0a0b0' },
        min: 0,
        max: 5,
        splitLine: {
          lineStyle: { color: '#2a3a5c', type: 'dashed' }
        },
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
      },
      series: [
        {
          type: 'scatter',
          data: industryData.map(item => ({
            ...item,
            itemStyle: {
              color: sectorColors[item.sector] || '#448aff',
              opacity: 0.8,
              borderColor: sectorColors[item.sector] || '#448aff',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: sectorColors[item.sector] || '#448aff',
            }
          })),
          symbolSize: (val: number[]) => {
            return Math.sqrt(val[2]) * 4;
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{b}',
            color: '#e8e8e8',
            fontSize: 11,
          },
        },
      ],
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
