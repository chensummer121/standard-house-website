'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RateData {
  date: string;
  rate: number;
  event?: string;
}

const rateData: RateData[] = [
  { date: '2020-01', rate: 32, event: '' },
  { date: '2021-01', rate: 42, event: '' },
  { date: '2022-01', rate: 48, event: '' },
  { date: '2023-01', rate: 55, event: '' },
  { date: '2024-01', rate: 57, event: '' },
  { date: '2024-07', rate: 80, event: '外汇改革' },
  { date: '2024-09', rate: 110, event: '' },
  { date: '2024-12', rate: 130, event: '' },
  { date: '2025-06', rate: 136, event: '' },
];

export default function ExchangeRateChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '美元/比尔汇率走势',
        subtext: '2020-2025 | 汇改后大幅贬值',
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
        formatter: (params: any) => {
          const data = params[0];
          const eventData = rateData.find(d => d.date === data.axisValue);
          let html = `
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">
              ${data.axisValue}
            </div>
            <div style="color: #a0a0b0;">
              <div>汇率: ${data.value} Birr/USD</div>
          `;
          if (eventData?.event) {
            html += `<div style="color: #ffd740;">📌 ${eventData.event}</div>`;
          }
          html += '</div>';
          return html;
        },
      },
      grid: {
        left: '10%',
        right: '5%',
        top: '20%',
        bottom: '15%',
      },
      xAxis: {
        type: 'category',
        data: rateData.map(d => d.date),
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { 
          color: '#a0a0b0',
          rotate: 45,
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'Birr/USD',
        nameTextStyle: { color: '#a0a0b0' },
        min: 0,
        max: 160,
        splitLine: {
          lineStyle: { color: '#2a3a5c', type: 'dashed' }
        },
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
      },
      visualMap: {
        show: false,
        dimension: 1,
        pieces: [
          { lte: 57, color: '#00e676' },
          { gt: 57, lte: 80, color: '#ffd740' },
          { gt: 80, color: '#ff5252' },
        ],
      },
      series: [
        {
          type: 'line',
          data: rateData.map(d => d.rate),
          smooth: true,
          lineStyle: {
            width: 4,
            color: '#448aff',
          },
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#448aff',
            borderWidth: 2,
            borderColor: '#e8e8e8',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(68, 138, 255, 0.4)' },
                { offset: 1, color: 'rgba(68, 138, 255, 0)' },
              ],
            },
          },
          markLine: {
            silent: true,
            lineStyle: { color: '#ffd740', type: 'dashed', width: 2 },
            data: [
              {
                xAxis: '2024-07',
                label: { 
                  formatter: '外汇改革', 
                  color: '#ffd740',
                  backgroundColor: '#1f4068',
                  padding: [4, 8],
                  borderRadius: 4,
                },
              },
            ],
          },
          markPoint: {
            data: [
              {
                coord: ['2024-07', 80],
                symbol: 'pin',
                symbolSize: 40,
                itemStyle: { color: '#ffd740' },
                label: { show: false },
              },
            ],
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
