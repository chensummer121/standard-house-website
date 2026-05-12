'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface DebtData {
  name: string;
  value: number;
}

const debtData: DebtData[] = [
  { name: '世界银行 IDA', value: 140.42 },
  { name: '中国政府贷款', value: 53.78 },
  { name: 'IMF ECF', value: 34 },
  { name: '其他多边/双边', value: 333 },
];

export default function DebtPieChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const total = debtData.reduce((sum, item) => sum + item.value, 0);

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '外债来源构成',
        subtext: `总计: $${total.toFixed(0)}亿 (2024)`,
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
          return `
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">
              ${params.name}
            </div>
            <div style="color: #a0a0b0;">
              <div>金额: $${params.value}亿</div>
              <div>占比: ${params.percent.toFixed(1)}%</div>
            </div>
          `;
        },
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: { color: '#a0a0b0' },
        itemWidth: 12,
        itemHeight: 12,
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '55%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#1b1b2f',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '${c}亿\n({d}%)',
            color: '#e8e8e8',
            fontSize: 11,
          },
          labelLine: {
            lineStyle: { color: '#2a3a5c' },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: debtData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: ['#ff9100', '#ff5252', '#448aff', '#a0a0b0'][index],
            },
          })),
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
