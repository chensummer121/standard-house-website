'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface GdpData {
  year: string;
  gdp: number;
  growth: number;
}

const gdpData: GdpData[] = [
  { year: '2018', gdp: 84, growth: 6.1 },
  { year: '2019', gdp: 96, growth: 8.3 },
  { year: '2020', gdp: 107, growth: 6.1 },
  { year: '2021', gdp: 112, growth: 5.6 },
  { year: '2022', gdp: 127, growth: 6.4 },
  { year: '2023', gdp: 152, growth: 7.2 },
  { year: '2024', gdp: 155, growth: 6.5 },
];

export default function GdpTrendChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: 'GDP历史趋势',
        subtext: '单位: 亿美元 | 2018-2024',
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
        trigger: 'axis',
        backgroundColor: '#1f4068',
        borderColor: '#2a3a5c',
        textStyle: { color: '#e8e8e8' },
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          let html = `<div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          params.forEach((p: any) => {
            const unit = p.seriesName === 'GDP' ? '亿美元' : '%';
            html += `<div style="color: ${p.color};">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${p.color}; margin-right: 5px;"></span>
              ${p.seriesName}: ${p.value}${unit}
            </div>`;
          });
          return html;
        },
      },
      legend: {
        data: ['GDP', '增长率'],
        top: '15%',
        textStyle: { color: '#a0a0b0' },
        itemWidth: 20,
        itemHeight: 10,
      },
      grid: {
        left: '8%',
        right: '5%',
        top: '25%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: gdpData.map(d => d.year),
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
      },
      yAxis: [
        {
          type: 'value',
          name: 'GDP(亿$)',
          nameTextStyle: { color: '#a0a0b0' },
          splitLine: { lineStyle: { color: '#2a3a5c', type: 'dashed' } },
          axisLine: { lineStyle: { color: '#2a3a5c' } },
          axisLabel: { color: '#a0a0b0' },
        },
        {
          type: 'value',
          name: '增长%',
          nameTextStyle: { color: '#a0a0b0' },
          max: 10,
          splitLine: { show: false },
          axisLine: { lineStyle: { color: '#2a3a5c' } },
          axisLabel: { color: '#a0a0b0' },
        },
      ],
      series: [
        {
          name: 'GDP',
          type: 'bar',
          data: gdpData.map(d => d.gdp),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#448aff' },
                { offset: 1, color: '#1f4068' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '50%',
        },
        {
          name: '增长率',
          type: 'line',
          yAxisIndex: 1,
          data: gdpData.map(d => d.growth),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#00e676',
          },
          symbol: 'diamond',
          symbolSize: 8,
          itemStyle: {
            color: '#00e676',
            borderWidth: 2,
            borderColor: '#e8e8e8',
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: '#00e676',
            fontSize: 10,
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
      className="w-full h-full min-h-[350px]"
    />
  );
}
