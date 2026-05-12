'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface CityData {
  name: string;
  population: number;
  investment: number;
  gdp: number;
}

const cityData: CityData[] = [
  { name: '亚的斯亚贝巴', population: 600, investment: 45, gdp: 40 },
  { name: '德雷达瓦', population: 50, investment: 8, gdp: 8 },
  { name: '阿达玛', population: 58, investment: 12, gdp: 6 },
  { name: '巴哈达尔', population: 35, investment: 5, gdp: 4 },
  { name: '霍瓦萨', population: 50, investment: 7, gdp: 5 },
  { name: '默克莱', population: 50, investment: 6, gdp: 5 },
];

export default function CityComparisonChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '主要城市对比',
        subtext: '人口(万) | 投资额(亿美元) | GDP占比(%)',
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
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: ['人口', '投资额', 'GDP占比'],
        top: '15%',
        textStyle: { color: '#a0a0b0' },
        itemWidth: 20,
        itemHeight: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '25%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: cityData.map(c => c.name),
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { 
          color: '#a0a0b0',
          rotate: 30,
          fontSize: 11,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '人口/投资',
          nameTextStyle: { color: '#a0a0b0' },
          splitLine: { lineStyle: { color: '#2a3a5c', type: 'dashed' } },
          axisLine: { lineStyle: { color: '#2a3a5c' } },
          axisLabel: { color: '#a0a0b0' },
        },
        {
          type: 'value',
          name: 'GDP%',
          nameTextStyle: { color: '#a0a0b0' },
          max: 50,
          splitLine: { show: false },
          axisLine: { lineStyle: { color: '#2a3a5c' } },
          axisLabel: { color: '#a0a0b0' },
        },
      ],
      series: [
        {
          name: '人口',
          type: 'bar',
          data: cityData.map(c => c.population),
          itemStyle: {
            color: '#448aff',
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '25%',
        },
        {
          name: '投资额',
          type: 'bar',
          data: cityData.map(c => c.investment),
          itemStyle: {
            color: '#ff9100',
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '25%',
        },
        {
          name: 'GDP占比',
          type: 'line',
          yAxisIndex: 1,
          data: cityData.map(c => c.gdp),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#00e676',
          },
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#00e676',
            borderWidth: 2,
            borderColor: '#e8e8e8',
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
      className="w-full h-full min-h-[450px]"
    />
  );
}
